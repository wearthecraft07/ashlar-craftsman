"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  availableGalleryViews,
  resolveProductMedia,
  type ProductMediaView,
} from "@/lib/products/media";
import {
  ProductPhoto,
  ProductStage,
  ProductVisual,
} from "@/components/product/ProductVisual";
import type { Product, ProductColor } from "@/types";
import type { ProductStorySymbol } from "@/data/product-stories";

export type GalleryView = ProductMediaView;

type Props = {
  product: Product;
  color: ProductColor;
  activeView: GalleryView;
  onViewChange: (view: GalleryView) => void;
  /** First look-closer symbol for detail caption */
  detailSymbols?: ProductStorySymbol[];
};

export function ProductGallery({
  product,
  color,
  activeView,
  onViewChange,
  detailSymbols = [],
}: Props) {
  const views = useMemo(() => availableGalleryViews(product), [product]);
  const media = useMemo(() => resolveProductMedia(product), [product]);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const dialogTitle = useId();

  const activeSlot =
    media.find((s) => s.view === activeView) ?? media[0];

  // Keep active view valid if product changes
  useEffect(() => {
    if (!views.some((v) => v.view === activeView)) {
      onViewChange(views[0]?.view ?? "front");
    }
  }, [views, activeView, onViewChange]);

  const openZoom = useCallback(() => {
    setZoom(1);
    setZoomOpen(true);
  }, []);

  const closeZoom = useCallback(() => {
    setZoomOpen(false);
    setZoom(1);
  }, []);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, closeZoom]);

  const caption =
    activeView === "detail"
      ? "See the detail"
      : activeSlot?.kind === "photo"
        ? undefined
        : "Design preview · photography forthcoming";

  const detailCaption = detailSymbols[0];

  return (
    <div className="space-y-4">
      <div className="relative">
        <button
          type="button"
          onClick={openZoom}
          className="group block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
          aria-label={`Inspect ${product.name} — ${activeSlot?.label ?? "Front"}`}
        >
          <ProductStage caption={caption}>
            <GalleryCanvas
              product={product}
              color={color}
              view={activeView}
              src={activeSlot?.src ?? null}
              kind={activeSlot?.kind ?? "mock"}
              priority={activeView === "front"}
              className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
            />
          </ProductStage>
        </button>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--walnut)]/55">
          Look closer · tap to inspect
        </p>
      </div>

      {activeView === "detail" && detailCaption && (
        <div className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--panel)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            What you&apos;re seeing
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--lodge-blue)]">
            {detailCaption.name}
          </p>
          <p className="mt-1 text-sm text-[var(--walnut)]">
            {detailCaption.meaning}
          </p>
        </div>
      )}

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Product views"
      >
        {views.map((view) => (
          <button
            key={view.view}
            type="button"
            role="tab"
            aria-selected={activeView === view.view}
            onClick={() => onViewChange(view.view)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
              activeView === view.view
                ? "border-[var(--lodge-blue)] bg-[var(--lodge-blue)] text-[#FFFFFF]"
                : "border-[var(--stone)]/60 text-[var(--walnut)] hover:border-[var(--gold)]",
            )}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Soft worn architecture — not prominent */}
      {!media.find((s) => s.view === "worn")?.available && (
        <p className="text-[11px] leading-relaxed text-[var(--walnut)]/55">
          <span className="font-semibold uppercase tracking-[0.18em] text-[var(--walnut)]/70">
            See it worn
          </span>
          <span className="mx-2 text-[var(--stone)]">·</span>
          Real-world photography is coming.
        </p>
      )}

      {zoomOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[color-mix(in_srgb,var(--lodge-blue)_88%,black)]/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitle}
          onClick={closeZoom}
        >
          <div
            className="relative w-full max-w-lg rounded-[1.5rem] border border-[var(--gold)]/25 bg-[linear-gradient(165deg,#1E2A44,#121926)] p-4 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id={dialogTitle}
                className="font-[family-name:var(--font-display)] text-lg text-[var(--ivory)]"
              >
                See the detail
              </h2>
              <button
                type="button"
                onClick={closeZoom}
                className="rounded-full border border-[var(--gold)]/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              >
                Close
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl">
              <div
                className="flex min-h-[280px] items-center justify-center transition-transform duration-200 motion-reduce:transition-none"
                style={{ transform: `scale(${zoom})` }}
              >
                <GalleryCanvas
                  product={product}
                  color={color}
                  view={activeView === "front" ? "detail" : activeView}
                  src={activeSlot?.src ?? null}
                  kind={activeSlot?.kind ?? "mock"}
                  detail
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
                className="h-10 w-10 rounded-full border border-[var(--gold)]/40 text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              >
                −
              </button>
              <span className="min-w-14 text-center text-xs tabular-nums text-[var(--ivory)]/70">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                className="h-10 w-10 rounded-full border border-[var(--gold)]/40 text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              >
                +
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/40">
              Made to be worn beyond the Lodge
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryCanvas({
  product,
  color,
  view,
  src,
  kind,
  detail,
  priority,
  className,
}: {
  product: Product;
  color: ProductColor;
  view: GalleryView;
  src: string | null;
  kind: "mock" | "photo" | "placeholder";
  detail?: boolean;
  priority?: boolean;
  className?: string;
}) {
  if (kind === "photo" && src) {
    return (
      <div className={cn("h-full w-full", className)}>
        <ProductPhoto
          src={src}
          alt={`${product.name} — ${view}`}
          priority={priority}
        />
      </div>
    );
  }

  if (view === "detail") {
    return (
      <div className={cn("w-full", className)}>
        <ProductVisual
          product={product}
          color={color}
          size="hero"
          detail
          decorative
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <ProductVisual
        product={product}
        color={color}
        size={detail ? "hero" : "hero"}
        decorative
      />
    </div>
  );
}
