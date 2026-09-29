"use client";

import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types";

type Props = {
  colors: ProductColor[];
  value: ProductColor;
  onChange: (color: ProductColor) => void;
  className?: string;
  size?: "sm" | "md";
};

/**
 * Circular color swatches for T-shirt products.
 * Selection is local to the parent — does not affect other products.
 */
export function ShirtColorSwatches({
  colors,
  value,
  onChange,
  className,
  size = "md",
}: Props) {
  const dim = size === "sm" ? "h-6 w-6" : "h-7 w-7 sm:h-8 sm:w-8";

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="radiogroup"
      aria-label="T-shirt color"
    >
      {colors.map((color) => {
        const selected = value.id === color.id;
        const isWhite =
          color.hex.toLowerCase() === "#ffffff" ||
          color.hex.toLowerCase() === "#f7f7f5";
        return (
          <button
            key={color.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={color.name}
            title={color.name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(color);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className={cn(
              dim,
              "rounded-full transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
              selected
                ? "ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-[var(--panel,#F7F2E7)] scale-105"
                : "ring-1 ring-black/15 hover:ring-black/30",
              isWhite && "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]",
            )}
            style={{ backgroundColor: color.hex }}
          />
        );
      })}
    </div>
  );
}
