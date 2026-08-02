"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "ghost" | "dark" | "white";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  gold: "bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-soft)] shadow-[0_10px_30px_rgba(201,162,39,0.25)]",
  ghost:
    "bg-transparent text-[var(--ink)] border border-[var(--ink)]/15 hover:border-[var(--gold)] hover:text-[var(--gold)]",
  dark: "bg-[var(--ink)] text-white hover:bg-[var(--charcoal)]",
  white: "bg-white text-[var(--ink)] hover:bg-[var(--stone)]",
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
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 disabled:opacity-50",
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
