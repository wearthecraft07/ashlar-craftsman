import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return <CheckoutForm paymentsEnabled={isStripeConfigured()} />;
}
