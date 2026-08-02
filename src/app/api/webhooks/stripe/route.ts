import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

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
      // Persist order to Supabase when connected.
      console.info("Stripe checkout completed", event.data.object.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
