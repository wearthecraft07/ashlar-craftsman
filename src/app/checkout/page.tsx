import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { isStripeConfigured, isStripeTestMode } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  const paymentsEnabled = isStripeConfigured();
  return (
    <CheckoutForm
      paymentsEnabled={paymentsEnabled}
      testMode={paymentsEnabled && isStripeTestMode()}
    />
  );
}
