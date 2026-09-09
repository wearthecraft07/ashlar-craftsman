"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StickerRenderer } from "@/components/stickers/StickerRenderer";
import { useCartStore } from "@/lib/cart-store";
import {
  DESIGN_PLACEMENTS,
  DESIGN_SIZES,
  colorsForApparel,
  enabledApparelStyles,
  getApparelProduct,
  placementLayout,
  sizesForApparel,
  type ApparelStyleId,
  type DesignPlacementId,
  type DesignSizeId,
} from "@/lib/stickers/apparel";
import { getStickerById } from "@/lib/stickers/catalog";
import {
  clearShirtDesignDraft,
  loadShirtDesignDraft,
  type ShirtDesignDraft,
} from "@/lib/stickers/shirt-draft";
import { cn, formatCurrency } from "@/lib/utils";
import type { ProductColor, StickerShirtDesign } from "@/types";
import type { StickerDefinition } from "@/types/stickers";

export function ShirtCustomizer() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const stageRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState<ShirtDesignDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [apparel, setApparel] = useState<ApparelStyleId>("tee");
  const [color, setColor] = useState<ProductColor | null>(null);
  const [garmentSize, setGarmentSize] = useState("M");
  const [placement, setPlacement] =
    useState<DesignPlacementId>("center-chest");
  const [designSize, setDesignSize] = useState<DesignSizeId>("medium");
  const [locked, setLocked] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const styles = enabledApparelStyles();
  const product = getApparelProduct(apparel);
  const colors = colorsForApparel(apparel);
  const sizes = sizesForApparel(apparel);

  useEffect(() => {
    const loaded = loadShirtDesignDraft();
    setDraft(loaded);
    setReady(true);
    if (loaded?.previewDataUrl) setPreviewUrl(loaded.previewDataUrl);
  }, []);

  useEffect(() => {
    if (!color && colors[0]) setColor(colors[0]);
  }, [colors, color]);

  useEffect(() => {
    if (!sizes.includes(garmentSize) && sizes[0]) {
      setGarmentSize(sizes.includes("M") ? "M" : sizes[0]);
    }
  }, [sizes, garmentSize]);

  const sticker: StickerDefinition | null = useMemo(() => {
    if (!draft) return null;
    const fromCatalog = getStickerById(draft.stickerId);
    if (fromCatalog) {
      return {
        ...fromCatalog,
        composition: draft.composition,
        name: draft.stickerName || fromCatalog.name,
      };
    }
    return {
      id: draft.stickerId,
      name: draft.stickerName,
      category: "greetings",
      pack: "lodge-life",
      composition: draft.composition,
    };
  }, [draft]);

  const price = product?.price ?? 6400;

  async function lockDesign() {
    if (!stageRef.current || !sticker || !draft) return;
    setBusy(true);
    setStatus("Finalizing your shirt design…");
    try {
      const { renderPreviewArtworkFromStage } = await import(
        "@/lib/stickers/print-artwork"
      );
      const art = await renderPreviewArtworkFromStage(
        stageRef.current,
        sticker,
      );
      setPreviewUrl(art);
      setLocked(true);
      setStatus("Your shirt design is ready.");
    } catch {
      setStatus("Could not finalize artwork. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function addToCart() {
    if (!draft || !sticker || !color || !product) return;
    if (!locked || !previewUrl) {
      setStatus("Finalize your design before adding to cart.");
      return;
    }

    const design: StickerShirtDesign = {
      stickerId: draft.stickerId,
      stickerName: draft.stickerName,
      composition: draft.composition as unknown as Record<string, unknown>,
      avatarConfig: draft.avatarConfig,
      apparelStyle: apparel,
      placement,
      designSize,
      lockedAt: new Date().toISOString(),
      previewDataUrl: previewUrl,
    };

    addItem({
      productId: product.id,
      slug: product.slug,
      name: `Sticker Tee — ${draft.stickerName}`,
      price: product.price,
      color,
      size: garmentSize,
      quantity: 1,
      image: previewUrl,
      avatarConfig: draft.avatarConfig,
      custom: true,
      stickerDesign: design,
    });

    clearShirtDesignDraft();
    setStatus("Added to cart.");
    router.push("/cart");
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 pt-28">
        <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]">
          Preparing your shirt…
        </p>
      </div>
    );
  }

  if (!draft || !sticker) {
    return (
      <div className="mx-auto max-w-lg px-4 pb-20 pt-28 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)]">
          No sticker selected
        </h1>
        <p className="mt-3 text-sm text-[var(--walnut)]">
          Pick a sticker first, then put it on a shirt.
        </p>
        <Button href="/avatar/stickers" className="mt-6">
          Craft Your Stickers
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
      <Link
        href="/avatar/stickers"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--walnut)] hover:text-[var(--lodge-blue)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Stickers
      </Link>

      <div className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Put your sticker on a shirt
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-4xl">
          Your character. Your design. Your shirt.
        </h1>
        <p className="mt-2 text-sm text-[var(--walnut)]">
          {draft.stickerName} — printed from your locked sticker design.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Mockup */}
        <div className="lodge-card rounded-[1.75rem] p-4 sm:p-6">
          <div className="mx-auto max-w-md">
            <ShirtMockup
              colorHex={color?.hex ?? "#0A0A0A"}
              placement={placement}
              designSize={designSize}
              artworkUrl={previewUrl}
              sticker={sticker}
              avatarConfig={draft.avatarConfig}
              stageRef={stageRef}
              showLive={!previewUrl}
            />
          </div>
          <p className="mt-4 text-center text-xs text-[var(--walnut)]/80">
            Preview only — print file excludes the shirt mockup.
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <ControlBlock label="Shirt">
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <Chip
                  key={style.id}
                  active={apparel === style.id}
                  onClick={() => {
                    setApparel(style.id);
                    setLocked(false);
                    setPreviewUrl(draft.previewDataUrl ?? null);
                  }}
                >
                  {style.label}
                </Chip>
              ))}
              {APPAREL_COMING_SOON.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-dashed border-[var(--stone)] px-4 py-2.5 text-sm text-[var(--walnut)]/50"
                >
                  {label} · soon
                </span>
              ))}
            </div>
          </ControlBlock>

          <ControlBlock label="Color">
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.name}
                  aria-label={c.name}
                  onClick={() => {
                    setColor(c);
                    setLocked(false);
                  }}
                  className={cn(
                    "h-11 w-11 rounded-full border-2 transition",
                    color?.id === c.id
                      ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/40"
                      : "border-[var(--stone)]",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-[var(--walnut)]">
              {color?.name}
            </p>
          </ControlBlock>

          <ControlBlock label="Placement">
            <div className="flex flex-wrap gap-2">
              {DESIGN_PLACEMENTS.map((p) => (
                <Chip
                  key={p.id}
                  active={placement === p.id}
                  onClick={() => {
                    setPlacement(p.id);
                    setLocked(false);
                  }}
                >
                  {p.label}
                </Chip>
              ))}
            </div>
          </ControlBlock>

          <ControlBlock label="Design size">
            <div className="flex flex-wrap gap-2">
              {DESIGN_SIZES.map((s) => (
                <Chip
                  key={s.id}
                  active={designSize === s.id}
                  onClick={() => {
                    setDesignSize(s.id);
                    setLocked(false);
                  }}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
          </ControlBlock>

          <ControlBlock label="Your size">
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <Chip
                  key={s}
                  active={garmentSize === s}
                  onClick={() => setGarmentSize(s)}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </ControlBlock>

          <div className="lodge-card rounded-[1.5rem] p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Price
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)]">
                  {formatCurrency(price)}
                </p>
              </div>
              {locked ? (
                <p className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--lodge-blue)]">
                  <Check className="h-4 w-4 text-[var(--gold)]" />
                  Design locked
                </p>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3">
              {!locked ? (
                <Button onClick={lockDesign} disabled={busy} className="w-full">
                  Finalize design
                </Button>
              ) : (
                <Button onClick={addToCart} className="w-full">
                  <ShoppingBag className="h-4 w-4" />
                  Add to cart
                </Button>
              )}
              {locked ? (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setLocked(false);
                    setStatus("Edit your design, then finalize again.");
                  }}
                >
                  Edit design
                </Button>
              ) : null}
            </div>

            {status ? (
              <p className="mt-4 text-sm text-[var(--copper)]" role="status">
                {status}
              </p>
            ) : (
              <p className="mt-4 text-xs text-[var(--walnut)]/80">
                Finalizing locks a snapshot of your avatar + sticker so later
                edits won’t change this shirt.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden layout reference kept via placementLayout in mockup */}
    </div>
  );
}

const APPAREL_COMING_SOON = ["Long Sleeve", "Hoodie"];

function ControlBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lodge-card rounded-[1.5rem] p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2.5 text-sm font-semibold transition",
        active
          ? "bg-[var(--lodge-blue)] text-[#FFFFFF]"
          : "bg-[var(--panel)] text-[var(--walnut)] ring-1 ring-[var(--stone)] hover:ring-[var(--gold)]",
      )}
    >
      {children}
    </button>
  );
}

function ShirtMockup({
  colorHex,
  placement,
  designSize,
  artworkUrl,
  sticker,
  avatarConfig,
  stageRef,
  showLive,
}: {
  colorHex: string;
  placement: DesignPlacementId;
  designSize: DesignSizeId;
  artworkUrl: string | null;
  sticker: StickerDefinition;
  avatarConfig: import("@/types").AvatarConfig;
  stageRef: React.RefObject<HTMLDivElement | null>;
  showLive: boolean;
}) {
  const layout = placementLayout(placement, designSize);
  const isBack = placement === "upper-back" || placement === "full-back";

  return (
    <div className="relative">
      <svg viewBox="0 0 320 380" className="h-auto w-full">
        <path
          d="M86 78 C110 54 140 48 160 48 C180 48 210 54 234 78 L268 108 L244 128 L228 114 L228 340 C228 352 218 360 204 360 L116 360 C102 360 92 352 92 340 L92 114 L76 128 L52 108 Z"
          fill={colorHex}
          stroke="#1A120C"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M116 78 C132 92 148 98 160 98 C172 98 188 92 204 78"
          fill="none"
          stroke="#1A120C"
          strokeWidth="2.5"
          opacity="0.35"
        />
        {isBack ? (
          <text
            x="160"
            y="70"
            textAnchor="middle"
            fill="#C9A227"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.2em"
            opacity="0.7"
          >
            BACK
          </text>
        ) : null}
        {artworkUrl ? (
          <image
            href={artworkUrl}
            x={layout.x}
            y={layout.y}
            width={layout.width}
            height={layout.height}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : null}
      </svg>

      {showLive && !artworkUrl ? (
        <div
          className="absolute overflow-hidden"
          style={{
            left: `${(layout.x / 320) * 100}%`,
            top: `${(layout.y / 380) * 100}%`,
            width: `${(layout.width / 320) * 100}%`,
            height: `${(layout.height / 380) * 100}%`,
          }}
        >
          <StickerRenderer
            sticker={sticker}
            config={avatarConfig}
            showOutline
            className="h-full w-full"
          />
        </div>
      ) : null}

      {/* Always-mounted stage for print/preview generation */}
      <div className="pointer-events-none absolute -left-[9999px] top-0 h-[360px] w-[360px] overflow-hidden opacity-0">
        <StickerRenderer
          sticker={sticker}
          config={avatarConfig}
          stageRef={stageRef}
          showOutline={false}
        />
      </div>
    </div>
  );
}
