import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/admin";

async function fulfillPaidOrder(session: Stripe.Checkout.Session) {
  const service = createServiceClient();
  if (!service) {
    console.info("Stripe paid but Supabase service role is not configured");
    return;
  }

  const orderId = session.metadata?.order_id;
  let orderQuery = service.from("orders").select("*");
  if (orderId) {
    orderQuery = orderQuery.eq("id", orderId);
  } else if (session.id) {
    orderQuery = orderQuery.eq("stripe_session_id", session.id);
  } else {
    return;
  }

  const { data: order } = await orderQuery.maybeSingle();
  if (!order) {
    console.info("No matching order for Stripe session", session.id);
    return;
  }

  if (order.status === "paid" || order.status === "processing") {
    return;
  }

  await service
    .from("orders")
    .update({
      status: "paid",
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  const items = Array.isArray(order.items) ? order.items : [];
  for (const item of items) {
    const productId = item?.productId as string | undefined;
    const quantity = Number(item?.quantity ?? 0);
    if (!productId || quantity <= 0) continue;

    const { data: product } = await service
      .from("products")
      .select("inventory, status")
      .eq("id", productId)
      .maybeSingle();

    if (!product) continue;

    const next = Math.max(0, Number(product.inventory) - quantity);
    await service
      .from("products")
      .update({
        inventory: next,
        ...(next === 0 ? { status: "out_of_stock" } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret || secret.includes("whsec_...")) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 501 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    if (event.type === "checkout.session.completed") {
      await fulfillPaidOrder(event.data.object as Stripe.Checkout.Session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
