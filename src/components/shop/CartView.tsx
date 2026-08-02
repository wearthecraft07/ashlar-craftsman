"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">
          Your cart is empty
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Craft an avatar or browse the shop to get started.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/shop">Shop</Button>
          <Button href="/avatar" variant="ghost">
            Avatar Studio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Cart</h1>
      <div className="mt-10 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-[1.5rem] border border-black/8 bg-white p-4 sm:flex-row sm:items-center"
          >
            <div
              className="h-24 w-24 shrink-0 rounded-2xl"
              style={{ backgroundColor: item.color.hex }}
            />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {item.color.name} · Size {item.size}
                {item.custom ? " · Custom avatar" : ""}
              </p>
              <p className="mt-2 font-medium">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-black/10"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-black/10"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                type="button"
                className="ml-2 text-sm text-[var(--muted)] underline"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[1.5rem] border border-black/8 bg-white p-6">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Shipping and tax calculated at checkout.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/checkout" size="lg">
            Secure checkout
          </Button>
          <Link href="/shop" className="text-sm underline self-center">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
