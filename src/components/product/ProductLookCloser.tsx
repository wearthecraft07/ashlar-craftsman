"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductStorySymbol } from "@/data/product-stories";

type Props = {
  symbols: ProductStorySymbol[];
};

export function ProductLookCloser({ symbols }: Props) {
  const [active, setActive] = useState(0);
  const headingId = useId();
  if (!symbols.length) return null;
  const current = symbols[active] ?? symbols[0];

  return (
    <section
      className="border-t border-[var(--stone)]/40 py-14"
      aria-labelledby={headingId}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
        Discovery
      </p>
      <h2
        id={headingId}
        className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-4xl"
      >
        Look closer.
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--walnut)]">
        Working tools of the Craft — measure, refine, and build character.
        Nothing private. Everything intentional.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-[var(--gold)]/25 bg-[linear-gradient(160deg,#1E2A44,#121926)] p-6">
          <svg
            viewBox="0 0 320 320"
            className="h-full w-full"
            aria-hidden
          >
            <rect
              x="28"
              y="28"
              width="264"
              height="264"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="1"
              opacity="0.3"
            />
            <path
              d="M100 170 V120 H180"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="2"
              opacity={active === 0 ? 1 : 0.35}
            />
            <circle
              cx="160"
              cy="145"
              r="36"
              fill="none"
              stroke="#F7F2E7"
              strokeWidth="1.2"
              opacity={active === 1 ? 0.85 : 0.25}
            />
            <path
              d="M210 210 L250 200 L258 240 L216 248 Z"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="1.5"
              opacity={active === 2 ? 1 : 0.3}
            />
            <path
              d="M140 90 Q160 70 180 90"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="1.2"
              opacity={active >= 3 ? 1 : 0.25}
            />
          </svg>

          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4">
            {symbols.map((symbol, index) => (
              <button
                key={symbol.name}
                type="button"
                aria-label={`Reveal: ${symbol.name}`}
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                  active === index
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--lodge-blue)]"
                    : "border-[var(--gold)]/40 bg-[var(--lodge-blue)]/70 text-[var(--gold)]",
                )}
              >
                <span className="text-xs font-bold" aria-hidden>
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-[1.25rem] border border-[var(--gold)]/20 bg-[var(--panel)] p-6"
          role="status"
          aria-live="polite"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            {current.name}
          </p>
          <p className="mt-3 text-base leading-relaxed text-[var(--walnut)]">
            {current.meaning}
          </p>
          <ul className="mt-8 space-y-3">
            {symbols.map((symbol, index) => (
              <li key={symbol.name}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                    active === index
                      ? "border-[var(--gold)]/50 bg-[color-mix(in_srgb,var(--gold)_10%,white)]"
                      : "border-[var(--stone)]/40 hover:border-[var(--gold)]/35",
                  )}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lodge-blue)]">
                    {symbol.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
