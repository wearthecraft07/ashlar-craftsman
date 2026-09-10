"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProductPrintArt } from "@/lib/products/media";
import type { Product, ProductColor } from "@/types";

type Size = "sm" | "md" | "lg" | "hero";

type Props = {
  product: Product;
  color?: ProductColor;
  size?: Size;
  /** Crop tighter for detail inspection */
  detail?: boolean;
  className?: string;
  decorative?: boolean;
};

const SIZE_MAP: Record<
  Size,
  { wrap: string; mark: { x: number; y: number; w: number; h: number } }
> = {
  sm: {
    wrap: "max-w-[140px]",
    mark: { x: 72, y: 94, w: 56, h: 56 },
  },
  md: {
    wrap: "max-w-[200px]",
    mark: { x: 68, y: 90, w: 64, h: 64 },
  },
  lg: {
    wrap: "max-w-[280px]",
    mark: { x: 64, y: 86, w: 72, h: 72 },
  },
  hero: {
    wrap: "max-w-[340px]",
    mark: { x: 60, y: 82, w: 80, h: 80 },
  },
};

/** Chest print placement tuned to the tee body (below collar, inside side seams). */
const PRINT_MAP: Record<
  Size,
  { x: number; y: number; w: number; h: number }
> = {
  sm: { x: 66, y: 102, w: 68, h: 68 },
  md: { x: 62, y: 100, w: 76, h: 76 },
  lg: { x: 58, y: 98, w: 84, h: 84 },
  hero: { x: 54, y: 96, w: 92, h: 92 },
};

/**
 * Consistent premium mock presentation for all product surfaces.
 * Product print artwork is placed on the tee template; photography uses ProductPhoto.
 */
export function ProductVisual({
  product,
  color,
  size = "md",
  detail = false,
  className,
  decorative,
}: Props) {
  const fill = color?.hex ?? product.colors[0]?.hex ?? "#0A0A0A";
  const light =
    fill.toLowerCase() === "#f7f7f5" ||
    fill.toLowerCase() === "#ffffff" ||
    fill.toLowerCase() === "#d6d1c7";
  const stroke = light ? "#1E2A44" : "#F7F2E7";
  const printArt = getProductPrintArt(product);
  const markSrc = printArt ?? "/shirt-mark-sm.png";
  const customPrint = Boolean(printArt);
  const clipId = `shirt-body-${product.slug}-${size}-${detail ? "d" : "n"}`;

  const mark = customPrint
    ? detail
      ? { x: 48, y: 88, w: 104, h: 104 }
      : PRINT_MAP[size]
    : detail
      ? { x: 50, y: 70, w: 100, h: 100 }
      : SIZE_MAP[size].mark;

  const label = `${product.name}${color ? ` in ${color.name}` : ""}`;

  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        detail ? "max-w-[360px]" : SIZE_MAP[size].wrap,
        className,
      )}
    >
      <svg
        viewBox="0 0 200 220"
        className="h-full w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.28)]"
        role={decorative ? "presentation" : "img"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
      >
        <defs>
          {/* Keep print inside the tee body */}
          <clipPath id={clipId}>
            <path d="M60 96 L140 96 L140 190 L60 190 Z" />
          </clipPath>
        </defs>

        {/* Soft ground shadow */}
        <ellipse
          cx="100"
          cy="208"
          rx="48"
          ry="6"
          fill="rgba(0,0,0,0.28)"
          opacity="0.55"
        />
        <path
          d="M40 70 L70 48 L90 68 L110 68 L130 48 L160 70 L150 100 L140 96 L140 190 L60 190 L60 96 L50 100 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="2.75"
          strokeLinejoin="round"
        />
        {/* Soft fold lines for depth — subtle, brand-consistent */}
        <path
          d="M70 72 L78 96 M130 72 L122 96"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.18"
        />
        <image
          href={markSrc}
          x={mark.x}
          y={mark.y}
          width={mark.w}
          height={mark.h}
          preserveAspectRatio="xMidYMid meet"
          clipPath={customPrint ? `url(#${clipId})` : undefined}
          opacity={detail ? 1 : 0.98}
        />
      </svg>
    </div>
  );
}

type StageProps = {
  children: ReactNode;
  className?: string;
  aspect?: "square" | "portrait";
  caption?: string;
};

/** Shared premium stage — consistent background across site. */
export function ProductStage({
  children,
  className,
  aspect = "square",
  caption,
}: StageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-[var(--gold)]/18",
        "bg-[linear-gradient(165deg,#1E2A44_0%,#162033_52%,#121926_100%)]",
        aspect === "square" ? "aspect-square" : "aspect-[4/5]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(#C8A24A 1px, transparent 1px), linear-gradient(90deg, #C8A24A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(200,162,74,0.14),transparent_48%)]"
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
        {children}
      </div>
      {caption && (
        <p className="absolute bottom-3 left-3 right-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ivory)]/40">
          {caption}
        </p>
      )}
    </div>
  );
}

/** Real photo when available — lazy by default. */
export function ProductPhoto({
  src,
  alt,
  priority,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={1000}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className={cn("h-full w-full object-contain", className)}
      sizes="(max-width: 768px) 100vw, 520px"
    />
  );
}
