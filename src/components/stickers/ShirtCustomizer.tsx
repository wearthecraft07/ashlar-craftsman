"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TshirtBodySvg } from "@/components/product/TshirtMockup";
import { StickerRenderer } from "@/components/stickers/StickerRenderer";
import { useCartStore } from "@/lib/cart-store";
import {
  DEFAULT_PRINT_AREA,
  clamp,
  designBoxStyle,
  type PrintLayout,
} from "@/lib/print/layout";
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
  /** Bumps when a placement chip is clicked so presets re-apply even if id is unchanged. */
  const [placementTick, setPlacementTick] = useState(0);
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

  const price = product?.price ?? 3000;

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
              colorHex={color?.hex ?? "#FFFFFF"}
              placement={placement}
              placementTick={placementTick}
              designSize={designSize}
              artworkUrl={previewUrl}
              sticker={sticker}
              avatarConfig={draft.avatarConfig}
              stageRef={stageRef}
              showLive={!previewUrl}
              interactive={!locked}
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
                    setPlacementTick((n) => n + 1);
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

/** Design box in print-area fractions (same space as `@/lib/print/layout`). */
type DesignBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Map apparel SVG preset (320×380) into DEFAULT_PRINT_AREA fractions. */
function presetToPrintBox(
  placement: DesignPlacementId,
  designSize: DesignSizeId,
): DesignBox {
  const svg = placementLayout(placement, designSize);
  const pa = DEFAULT_PRINT_AREA;
  const absLeft = svg.x / 320;
  const absTop = svg.y / 380;
  const absW = svg.width / 320;
  const absH = svg.height / 380;
  return constrainDesignBox({
    x: (absLeft - pa.x) / pa.width,
    y: (absTop - pa.y) / pa.height,
    width: absW / pa.width,
    height: absH / pa.height,
  });
}

function sizeOnlyBox(designSize: DesignSizeId, previous: DesignBox): DesignBox {
  const next = presetToPrintBox("center-chest", designSize);
  const cx = previous.x + previous.width / 2;
  const cy = previous.y + previous.height / 2;
  return constrainDesignBox({
    x: cx - next.width / 2,
    y: cy - next.height / 2,
    width: next.width,
    height: next.height,
  });
}

function constrainDesignBox(box: DesignBox): DesignBox {
  const width = clamp(box.width, 0.08, 1);
  const height = clamp(box.height, 0.08, 1);
  return {
    width,
    height,
    x: clamp(box.x, 0, Math.max(0, 1 - width)),
    y: clamp(box.y, 0, Math.max(0, 1 - height)),
  };
}

function toPrintLayout(box: DesignBox): PrintLayout {
  return {
    designUrl: null,
    mockupUrl: null,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    rotation: 0,
    printArea: { ...DEFAULT_PRINT_AREA },
    designAspect: 1,
  };
}

function ShirtMockup({
  colorHex,
  placement,
  placementTick,
  designSize,
  artworkUrl,
  sticker,
  avatarConfig,
  stageRef,
  showLive,
  interactive,
}: {
  colorHex: string;
  placement: DesignPlacementId;
  placementTick: number;
  designSize: DesignSizeId;
  artworkUrl: string | null;
  sticker: StickerDefinition;
  avatarConfig: import("@/types").AvatarConfig;
  stageRef: React.RefObject<HTMLDivElement | null>;
  showLive: boolean;
  interactive: boolean;
}) {
  const mockupRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<DesignBox>(() =>
    presetToPrintBox(placement, designSize),
  );
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origin: DesignBox;
  } | null>(null);
  const prevPlacementTick = useRef(placementTick);
  const prevDesignSize = useRef(designSize);

  useEffect(() => {
    if (prevPlacementTick.current !== placementTick) {
      setBox(presetToPrintBox(placement, designSize));
      prevPlacementTick.current = placementTick;
      prevDesignSize.current = designSize;
      return;
    }
    if (prevDesignSize.current !== designSize) {
      setBox((prev) => sizeOnlyBox(designSize, prev));
      prevDesignSize.current = designSize;
    }
  }, [placement, placementTick, designSize]);

  const clientToPrintDelta = useCallback((dxPx: number, dyPx: number) => {
    const el = mockupRef.current;
    if (!el) return { dx: 0, dy: 0 };
    const rect = el.getBoundingClientRect();
    const pa = DEFAULT_PRINT_AREA;
    const printW = rect.width * pa.width;
    const printH = rect.height * pa.height;
    return {
      dx: printW > 0 ? dxPx / printW : 0,
      dy: printH > 0 ? dyPx / printH : 0,
    };
  }, []);

  const applyDragDelta = useCallback(
    (clientX: number, clientY: number) => {
      const state = dragRef.current;
      if (!state) return;
      const { dx, dy } = clientToPrintDelta(
        clientX - state.startX,
        clientY - state.startY,
      );
      setBox(
        constrainDesignBox({
          ...state.origin,
          x: state.origin.x + dx,
          y: state.origin.y + dy,
        }),
      );
    },
    [clientToPrintDelta],
  );

  function endDrag(event: ReactPointerEvent) {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    try {
      (event.currentTarget as HTMLElement).releasePointerCapture?.(
        event.pointerId,
      );
    } catch {
      /* already released */
    }
  }

  function startDrag(event: ReactPointerEvent) {
    if (!interactive) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origin: box,
    };
    setDragging(true);
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  // Window-level listeners so drag stays smooth even if capture is lost.
  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => {
      applyDragDelta(event.clientX, event.clientY);
    };
    const onUp = () => {
      dragRef.current = null;
      setDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, applyDragDelta]);

  const isBack = placement === "upper-back" || placement === "full-back";
  const artStyle = designBoxStyle(toPrintLayout(box));

  return (
    <div
      ref={mockupRef}
      className="relative mx-auto aspect-[3/4] w-full select-none"
    >
      <div className="absolute inset-0 overflow-hidden">
        <TshirtBodySvg shirtColor={colorHex} fillContainer />

        {isBack ? (
          <p
            className="pointer-events-none absolute left-1/2 top-[6%] z-30 -translate-x-1/2 text-[11px] font-bold tracking-[0.2em] text-[var(--gold)] opacity-70"
            aria-hidden
          >
            BACK
          </p>
        ) : null}

        {artworkUrl ? (
          <div
            role={interactive ? "button" : undefined}
            aria-label={interactive ? "Move sticker on shirt" : undefined}
            className={cn(
              "absolute z-20 touch-none overflow-hidden",
              interactive && (dragging ? "cursor-grabbing" : "cursor-grab"),
            )}
            style={artStyle}
            onPointerDown={startDrag}
            onPointerMove={(event) => applyDragDelta(event.clientX, event.clientY)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artworkUrl}
              alt=""
              draggable={false}
              className="pointer-events-none h-full w-full select-none object-contain"
            />
          </div>
        ) : null}

        {showLive && !artworkUrl ? (
          <div
            role={interactive ? "button" : undefined}
            aria-label={interactive ? "Move sticker on shirt" : undefined}
            className={cn(
              "absolute z-20 touch-none overflow-hidden",
              interactive && (dragging ? "cursor-grabbing" : "cursor-grab"),
            )}
            style={artStyle}
            onPointerDown={startDrag}
            onPointerMove={(event) => applyDragDelta(event.clientX, event.clientY)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <StickerRenderer
              sticker={sticker}
              config={avatarConfig}
              showOutline
              className="pointer-events-none h-full w-full"
            />
          </div>
        ) : null}
      </div>

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
