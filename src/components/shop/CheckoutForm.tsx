"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

const fieldClass =
  "mt-2 h-12 w-full rounded-full border border-black/10 px-4 outline-none ring-[var(--gold)] focus:ring-2";

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, items }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      clear();
      router.push(`/checkout/success?order=${data.orderId || "demo"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">
          Nothing to checkout
        </h1>
        <Button href="/shop" className="mt-8">
          Browse shop
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <form
        onSubmit={onSubmit}
        className="rounded-[2rem] border border-black/8 bg-white p-6 sm:p-8"
      >
        <h1 className="font-[family-name:var(--font-display)] text-4xl">
          Checkout
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Secure Stripe checkout when keys are configured. Demo mode works
          locally without Stripe.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Full name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium">
            Address
            <input
              required
              className={fieldClass}
              placeholder="Street address"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              City
              <input required className={fieldClass} />
            </label>
            <label className="block text-sm font-medium">
              Postal code
              <input required className={fieldClass} />
            </label>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="mt-8 w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : `Pay ${formatCurrency(subtotal)}`}
        </Button>
      </form>

      <aside className="rounded-[2rem] border border-black/8 bg-[var(--ink)] p-6 text-white sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Order summary
        </h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span className="text-white/75">
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-between border-t border-white/10 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
