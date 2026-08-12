"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

const fieldClass =
  "mt-2 h-12 w-full rounded-full border border-black/10 px-4 outline-none ring-[var(--gold)] focus:ring-2";

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const shipping = subtotal >= 7500 ? 0 : subtotal > 0 ? 800 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          shippingAddress: {
            name,
            line1,
            line2,
            city,
            state,
            postalCode,
            country: "US",
          },
          items: items.map((item) => ({
            productId: item.productId || item.slug,
            slug: item.slug,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            avatarConfig: item.avatarConfig,
            custom: item.custom,
          })),
        }),
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
      router.push(
        `/checkout/success?order=${data.orderId || "demo"}`,
      );
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
          Prices, tax, and shipping are calculated on the server. Stripe is used
          when configured; otherwise demo checkout still creates an order.
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
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className={fieldClass}
              placeholder="Street address"
            />
          </label>
          <label className="block text-sm font-medium">
            Apt / suite (optional)
            <input
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className={fieldClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium">
              City
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium">
              State
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Postal code
              <input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={fieldClass}
              />
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
          {loading ? "Processing..." : `Pay ${formatCurrency(total)}`}
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
        <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between text-white/70">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Tax (est.)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </aside>
    </div>
  );
}
