"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  title: string;
  body: string;
};

type Props = {
  sizes: string[];
  inventory: number;
};

export function ProductTrust({ sizes, inventory }: Props) {
  const baseId = useId();
  const [open, setOpen] = useState<string | null>("shipping");

  const items: Item[] = [
    {
      id: "shipping",
      title: "Shipping",
      body: "Shipping worldwide. Free shipping on orders of $75 or more; otherwise shipping is calculated at checkout.",
    },
    {
      id: "checkout",
      title: "Checkout",
      body: "Secure Stripe checkout. Your payment details are processed by Stripe — we never store card numbers on this site.",
    },
    {
      id: "sizing",
      title: "Sizing",
      body: `Available sizes: ${sizes.join(", ")}. Select your size above before adding to cart.`,
    },
    {
      id: "availability",
      title: "Availability",
      body:
        inventory > 0
          ? `${inventory} currently listed in stock.`
          : "Currently listed as out of stock.",
    },
  ];

  return (
    <div className="mt-8 border-t border-[var(--stone)]/40 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--walnut)]/70">
        Buying information
      </p>
      <div className="mt-3 divide-y divide-[var(--stone)]/40 border-y border-[var(--stone)]/40">
        {items.map((item) => {
          const isOpen = open === item.id;
          const panelId = `${baseId}-${item.id}`;
          return (
            <div key={item.id}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className={cn(
                    "flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-[var(--lodge-blue)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                  )}
                >
                  {item.title}
                  <span aria-hidden className="text-[var(--gold)]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                hidden={!isOpen}
                className="pb-3 text-sm leading-relaxed text-[var(--walnut)]"
              >
                {item.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
