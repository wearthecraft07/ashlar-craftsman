import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const itemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
  size: z.string(),
  color: z.object({
    id: z.string(),
    name: z.string(),
    hex: z.string(),
  }),
});

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  items: z.array(itemSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (!isStripeConfigured()) {
      return NextResponse.json({
        orderId: `demo_${Date.now()}`,
        mode: "demo",
        message:
          "Stripe is not configured. Completing demo checkout locally.",
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
      line_items: body.items.map((item) => ({
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
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        customer_name: body.name,
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid checkout request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
