"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "ghost" | "dark" | "white";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  gold:
    "bg-[var(--gold)] text-[var(--lodge-blue)] hover:bg-[var(--copper)] hover:text-[var(--ivory)] shadow-[0_10px_28px_rgba(200,162,74,0.28)]",
  ghost:
    "bg-[var(--ivory)] text-[var(--walnut)] border border-[var(--gold)] hover:bg-[color-mix(in_srgb,var(--candle)_35%,var(--ivory))] hover:text-[var(--lodge-blue)]",
  dark: "bg-[var(--lodge-blue)] text-[var(--ivory)] hover:bg-[color-mix(in_srgb,var(--lodge-blue)_85%,black)]",
  white:
    "bg-[var(--panel)] text-[var(--charcoal)] border border-[var(--stone)] hover:border-[var(--gold)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
};

export function Button({
  variant = "gold",
  size = "md",
  href,
  className,
  children,
  ...props
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ivory)] disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
