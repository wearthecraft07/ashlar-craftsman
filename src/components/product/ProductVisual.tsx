"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ShirtPrintComposer } from "@/components/print/ShirtPrintComposer";
import { TshirtMockup } from "@/components/product/TshirtMockup";
import { cn } from "@/lib/utils";
import { constrainLayout } from "@/lib/print/layout";
import { getProductPrintArt } from "@/lib/products/media";
import { defaultShirtColor } from "@/lib/products/shirt-colors";
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
    mark: { x: 64, y: 66, w: 72, h: 72 },
  },
  md: {
    wrap: "max-w-[200px]",
    mark: { x: 60, y: 64, w: 80, h: 80 },
  },
  lg: {
    wrap: "max-w-[280px]",
    mark: { x: 56, y: 62, w: 88, h: 88 },
  },
  hero: {
    wrap: "max-w-[340px]",
    mark: { x: 52, y: 60, w: 96, h: 96 },
  },
};

/** Chest print placement tuned to the photographic tee body. */
const PRINT_MAP: Record<
  Size,
  { x: number; y: number; w: number; h: number }
> = {
  sm: { x: 58, y: 68, w: 84, h: 84 },
  md: { x: 54, y: 66, w: 92, h: 92 },
  lg: { x: 50, y: 64, w: 100, h: 100 },
  hero: { x: 46, y: 62, w: 108, h: 108 },
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
  const fill =
    color?.hex ?? defaultShirtColor(product).hex ?? "#FFFFFF";
  const savedLayout =
    product.printLayout?.designUrl
      ? constrainLayout(product.printLayout)
      : null;
  const printArt = getProductPrintArt(product);
  const markSrc = printArt ?? "/shirt-mark-sm.png";
  const customPrint = Boolean(printArt) && !savedLayout;

  const mark = customPrint
    ? detail
      ? { x: 44, y: 72, w: 112, h: 112 }
      : PRINT_MAP[size]
    : detail
      ? { x: 48, y: 68, w: 104, h: 104 }
      : SIZE_MAP[size].mark;

  const label = `${product.name}${color ? ` in ${color.name}` : ""}`;
  const wrapClass = cn(
    "relative mx-auto w-full",
    detail ? "max-w-[360px]" : SIZE_MAP[size].wrap,
    className,
  );

  /* Admin-saved normalized placement — same composer as the print editor */
  if (savedLayout) {
    return (
      <div
        className={cn(wrapClass, "aspect-[3/4]")}
        role={decorative ? "presentation" : "img"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
      >
        <ShirtPrintComposer
          layout={savedLayout}
          shirtColor={fill}
          editing={false}
          className="absolute inset-0 h-full w-full max-w-none"
        />
      </div>
    );
  }

  return (
    <div className={cn(wrapClass, "aspect-[3/4]")}>
      <TshirtMockup
        shirtColor={fill}
        artworkSrc={markSrc}
        artworkBox={mark}
        clipArtwork={customPrint}
        decorative={decorative}
        label={label}
        className="absolute inset-0 h-full w-full"
      />
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
