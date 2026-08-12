import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/admin";
import {
  priceCheckoutLines,
  type CheckoutLineInput,
} from "@/lib/checkout/pricing";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/admin";

const itemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().optional(),
  quantity: z.number().int().positive(),
  size: z.string().min(1),
  color: z.object({
    id: z.string(),
    name: z.string(),
    hex: z.string(),
  }),
  avatarConfig: z.record(z.string(), z.string()).optional(),
  custom: z.boolean().optional(),
});

const addressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().default(""),
  postalCode: z.string().min(1),
  country: z.string().default("US"),
});

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  items: z.array(itemSchema).min(1),
  shippingAddress: addressSchema,
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const priced = await priceCheckoutLines(
      body.items as CheckoutLineInput[],
    );

    const { user } = await getSessionUser();
    const service = createServiceClient();

    const orderPayload = {
      user_id: user?.id ?? null,
      email: body.email,
      status: "pending",
      items: priced.lines,
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      tax: priced.tax,
      total: priced.total,
      shipping_address: {
        name: body.shippingAddress.name || body.name,
        line1: body.shippingAddress.line1,
        line2: body.shippingAddress.line2 ?? "",
        city: body.shippingAddress.city,
        state: body.shippingAddress.state,
        postalCode: body.shippingAddress.postalCode,
        country: body.shippingAddress.country,
      },
    };

    let orderId: string | null = null;

    if (service) {
      const { data: order, error } = await service
        .from("orders")
        .insert(orderPayload)
        .select("id")
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      orderId = order.id;
    }

    if (!isStripeConfigured()) {
      if (service && orderId) {
        await service
          .from("orders")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", orderId);

        for (const line of priced.lines) {
          const { data: product } = await service
            .from("products")
            .select("inventory")
            .eq("id", line.productId)
            .maybeSingle();
          if (product) {
            const next = Math.max(0, product.inventory - line.quantity);
            await service
              .from("products")
              .update({
                inventory: next,
                ...(next === 0 ? { status: "out_of_stock" } : {}),
                updated_at: new Date().toISOString(),
              })
              .eq("id", line.productId);
          }
        }
      }

      return NextResponse.json({
        orderId: orderId ?? `demo_${Date.now()}`,
        mode: "demo",
        totals: {
          subtotal: priced.subtotal,
          shipping: priced.shipping,
          tax: priced.tax,
          total: priced.total,
        },
        message:
          "Stripe is not configured. Completed demo checkout with server-side pricing.",
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe unavailable" },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email,
      line_items: [
        ...priced.lines.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: item.price,
            product_data: {
              name: item.name,
              description: `${item.color.name} / Size ${item.size}`,
            },
          },
        })),
        ...(priced.shipping > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: priced.shipping,
                  product_data: { name: "Shipping" },
                },
              },
            ]
          : []),
        ...(priced.tax > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: priced.tax,
                  product_data: { name: "Estimated tax" },
                },
              },
            ]
          : []),
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${orderId ?? ""}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        order_id: orderId ?? "",
        customer_name: body.name,
      },
    });

    if (service && orderId) {
      await service
        .from("orders")
        .update({
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid checkout request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
