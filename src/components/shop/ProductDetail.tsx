"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductDetail({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function add() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      color,
      size,
      quantity: 1,
      image: product.images[0],
    });
    setAdded(true);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="aspect-square overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#2A2A2A,#0A0A0A)] p-10">
        <svg viewBox="0 0 200 220" className="h-full w-full">
          <path
            d="M40 70 L70 48 L90 68 L110 68 L130 48 L160 70 L150 100 L140 96 L140 190 L60 190 L60 96 L50 100 Z"
            fill={color.hex}
            stroke="#F7F7F5"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <image
            href="/shirt-mark.png"
            x="62"
            y="82"
            width="76"
            height="76"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
          {product.category}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)] sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-[var(--ink)]">
          {formatCurrency(product.price)}
        </p>
        <p className="mt-5 leading-relaxed text-[var(--muted)]">
          {product.description}
        </p>

        <div className="mt-8">
          <p className="text-sm font-semibold">Color</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.colors.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                onClick={() => setColor(item)}
                className={`h-10 w-10 rounded-full border-2 ${
                  color.id === item.id ? "border-[var(--gold)]" : "border-black/10"
                }`}
                style={{ backgroundColor: item.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSize(item)}
                className={`h-11 min-w-11 rounded-full px-4 text-sm font-medium ${
                  size === item
                    ? "bg-[var(--ink)] text-white"
                    : "bg-black/5 text-[var(--ink)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button onClick={add} size="lg">
            Add to cart
          </Button>
          {product.category === "custom" && (
            <Button href="/avatar" variant="ghost" size="lg">
              Open Avatar Studio
            </Button>
          )}
        </div>
        {added && (
          <p className="mt-4 text-sm text-[var(--gold)]" role="status">
            Added to cart.{" "}
            <a href="/cart" className="underline">
              View cart
            </a>
          </p>
        )}
        <p className="mt-6 text-sm text-[var(--muted)]">
          {product.inventory} in stock · Secure Stripe checkout
        </p>
      </div>
    </div>
  );
}
