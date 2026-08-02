import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
