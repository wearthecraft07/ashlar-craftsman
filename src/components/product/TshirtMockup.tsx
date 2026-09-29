"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { isLightShirtColor } from "@/lib/products/shirt-colors";

/** Photoreal blank tee — transparent PNG, front view. */
export const TSHIRT_MOCKUP_SRC = "/mockups/tshirt-front.png?v=4";

export type TshirtArtworkBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Props = {
  shirtColor: string;
  /** Product print / logo URL placed on the chest */
  artworkSrc?: string | null;
  /** Placement in legacy 200×220 space (converted to % of mockup). */
  artworkBox?: TshirtArtworkBox;
  /** Soften artwork edges into the torso (no hard rectangle). */
  clipArtwork?: boolean;
  className?: string;
  decorative?: boolean;
  label?: string;
  /** Soften artwork into fabric (default true) */
  printedLook?: boolean;
  /**
   * Fill a parent mockup frame instead of establishing aspect/centering.
   * Used by ShirtPrintComposer so print-area overlays share the same box.
   */
  fillContainer?: boolean;
};

function isNearWhite(hex: string) {
  const h = hex.toLowerCase();
  return h === "#ffffff" || h === "#f7f7f5" || h === "#fff";
}

/**
 * Premium front-facing tee mockup.
 * One photographic base image + masked CSS overlays (color / fabric / print).
 * Same URL is browser-cached across cards — only one <img> per mockup instance.
 */
export function TshirtMockup({
  shirtColor,
  artworkSrc,
  artworkBox = { x: 58, y: 88, w: 84, h: 84 },
  clipArtwork = true,
  className,
  decorative,
  label,
  printedLook = true,
  fillContainer = false,
}: Props) {
  const fill = shirtColor || "#FFFFFF";
  const light = isLightShirtColor(fill);
  const white = isNearWhite(fill);

  const artLeft = `${(artworkBox.x / 200) * 100}%`;
  const artTop = `${(artworkBox.y / 220) * 100}%`;
  const artWidth = `${(artworkBox.w / 200) * 100}%`;
  const artHeight = `${(artworkBox.h / 220) * 100}%`;

  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url(${TSHIRT_MOCKUP_SRC})`,
    maskImage: `url(${TSHIRT_MOCKUP_SRC})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };

  /** Reuse photo as masked background — no extra network decode beyond cache. */
  const photoFillStyle: CSSProperties = {
    ...maskStyle,
    backgroundImage: `url(${TSHIRT_MOCKUP_SRC})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div
      className={cn(
        fillContainer
          ? "absolute inset-0 h-full w-full"
          : "relative mx-auto aspect-[3/4] w-full",
        className,
      )}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
    >
      {/* Soft contact shadow — light, not dirty */}
      <div
        className="pointer-events-none absolute bottom-[1.5%] left-1/2 z-0 h-[2.8%] w-[46%] -translate-x-1/2 rounded-[100%] bg-black/[0.14] blur-[7px]"
        aria-hidden
      />

      <div className="absolute inset-0 z-10">
        {/* 1. Single photographic base (browser-cached across product cards) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={TSHIRT_MOCKUP_SRC}
          alt=""
          draggable={false}
          decoding="async"
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
        />

        {/* 2. Colorize — multiply keeps fold shading from the white cotton photo */}
        {!white && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              ...maskStyle,
              backgroundColor: fill,
              mixBlendMode: "multiply",
            }}
            aria-hidden
          />
        )}

        {/* 3. Restore fabric highlights after dark dyes (avoids flat solid black/navy) */}
        {!light && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.48] mix-blend-soft-light"
            style={photoFillStyle}
            aria-hidden
          />
        )}

        {/* Mid-tone colors (gray/beige-adjacent): keep a touch of photo dimensionality */}
        {light && !white && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-soft-light"
            style={photoFillStyle}
            aria-hidden
          />
        )}

        {/* 4. White cotton: subtle warm depth — never gray/dirty */}
        {white && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-soft-light"
            style={{
              ...maskStyle,
              background:
                "radial-gradient(ellipse 58% 48% at 50% 26%, rgba(255,255,255,0.65), transparent 68%), linear-gradient(180deg, rgba(255,253,250,0.25) 0%, transparent 42%, rgba(236,232,226,0.14) 100%)",
            }}
            aria-hidden
          />
        )}

        {/* 5. Artwork — printed into fabric (ellipse clip, no rectangular plate) */}
        {artworkSrc && (
          <div
            className={cn(
              "absolute z-20 overflow-hidden",
              clipArtwork && "[clip-path:ellipse(48%_46%_at_50%_48%)]",
            )}
            style={{
              left: artLeft,
              top: artTop,
              width: artWidth,
              height: artHeight,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artworkSrc}
              alt=""
              draggable={false}
              decoding="async"
              loading="lazy"
              className={cn(
                "pointer-events-none h-full w-full select-none object-contain",
                printedLook && light && "opacity-[0.84] mix-blend-multiply",
                printedLook && !light && "opacity-[0.92]",
                !printedLook && "opacity-100",
              )}
            />
          </div>
        )}

        {/* 6. Fabric shading over ink so the print follows cotton folds */}
        {artworkSrc && printedLook && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-30 mix-blend-multiply",
              light ? "opacity-[0.34]" : "opacity-[0.26]",
            )}
            style={photoFillStyle}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

/** Shirt body only — used when artwork is composed via HTML overlay. */
export function TshirtBodySvg({
  shirtColor,
  className,
  fillContainer = true,
}: {
  shirtColor: string;
  className?: string;
  /** Fill parent mockup frame (default true for print composer). */
  fillContainer?: boolean;
}) {
  return (
    <TshirtMockup
      shirtColor={shirtColor}
      artworkSrc={null}
      className={className}
      decorative
      fillContainer={fillContainer}
    />
  );
}
