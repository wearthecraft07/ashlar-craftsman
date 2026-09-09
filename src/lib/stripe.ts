import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("sk_test_...")) {
    return null;
  }

  return new Stripe(key, {
    typescript: true,
  });
}

export function isStripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY;
  const pub = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return Boolean(
    key &&
      pub &&
      !key.includes("sk_test_...") &&
      !pub.includes("pk_test_..."),
  );
}

/** True when the publishable key is a Stripe test key (`pk_test_…`). */
export function isStripeTestMode() {
  const pub = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  return pub.startsWith("pk_test");
}
