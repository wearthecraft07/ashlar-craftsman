"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { LodgeEmblemUploadField } from "@/components/lodge/LodgeEmblemUploadField";
import { TshirtBodySvg } from "@/components/product/TshirtMockup";
import { ProductStage } from "@/components/product/ProductVisual";
import type { LodgeEmblemId } from "@/data/lodge-edition";
import {
  DEFAULT_PRINT_AREA,
  clamp,
  constrainLayout,
  designBoxStyle,
  heightFromWidth,
  type PrintLayout,
} from "@/lib/print/layout";
import { TSHIRT_COLORS, isLightShirtColor } from "@/lib/products/shirt-colors";
import { cn } from "@/lib/utils";

/** Typography plate aspect (width / height) inside the print area. */
const DESIGN_ASPECT = 1.28;

const SIZE_MIN = 0.38;
const SIZE_MAX = 1;
const SIZE_DEFAULT = 0.72;
const NUDGE = 0.05;

/** Emblem size as a fraction of print-area width. */
const EMBLEM_SIZE_MIN = 0.16;
const EMBLEM_SIZE_MAX = 0.55;
const EMBLEM_SIZE_DEFAULT = 0.28;
/** Left-chest style default inside the printable area. */
const EMBLEM_DEFAULT_X = 0.02;
const EMBLEM_DEFAULT_Y = 0.04;

const TEXT_COLORS = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1A1A1A" },
  { id: "navy", name: "Navy", hex: "#1E2A44" },
  { id: "gold", name: "Gold", hex: "#C9A227" },
  { id: "gray", name: "Gray", hex: "#8B8B8B" },
] as const;

type TextColorId = (typeof TEXT_COLORS)[number]["id"];
type DragTarget = "design" | "emblem";

type Props = {
  lodgeName: string;
  lodgeNumber: string;
  city: string;
  yearEstablished: string;
  emblemIntent: LodgeEmblemId;
  emblemUrl: string | null;
  emblemFileName: string | null;
  emblemError: string | null;
  onEmblemFile: (file: File) => void;
  onEmblemRemove: () => void;
  onEmblemLoadError?: () => void;
};

type DragState = {
  target: DragTarget;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

function luminance(hex: string) {
  const m = /^#?([a-f0-9]{6})$/i.exec(hex.trim());
  if (!m) return 0.5;
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isReadable(textHex: string, shirtHex: string) {
  return Math.abs(luminance(textHex) - luminance(shirtHex)) >= 0.28;
}

function defaultTextForShirt(shirtHex: string): TextColorId {
  return isLightShirtColor(shirtHex) ? "navy" : "white";
}

function ensureReadableText(
  shirtHex: string,
  preferred: TextColorId,
): TextColorId {
  const preferredHex =
    TEXT_COLORS.find((c) => c.id === preferred)?.hex ?? "#FFFFFF";
  if (isReadable(preferredHex, shirtHex)) return preferred;
  return defaultTextForShirt(shirtHex);
}

function layoutFromState(
  x: number,
  y: number,
  width: number,
  aspect: number,
): PrintLayout {
  return constrainLayout({
    designUrl: null,
    mockupUrl: null,
    x,
    y,
    width,
    height: heightFromWidth(width, aspect, DEFAULT_PRINT_AREA),
    rotation: 0,
    printArea: { ...DEFAULT_PRINT_AREA },
    designAspect: aspect,
  });
}

function resizeKeepingCenter(
  prev: PrintLayout,
  nextWidth: number,
  aspect: number,
  sizeMin: number,
  sizeMax: number,
): PrintLayout {
  const width = clamp(nextWidth, sizeMin, sizeMax);
  const height = heightFromWidth(width, aspect, DEFAULT_PRINT_AREA);
  const cx = prev.x + prev.width / 2;
  const cy = prev.y + prev.height / 2;
  return layoutFromState(cx - width / 2, cy - height / 2, width, aspect);
}

function defaultEmblemLayout(aspect: number): PrintLayout {
  return layoutFromState(
    EMBLEM_DEFAULT_X,
    EMBLEM_DEFAULT_Y,
    EMBLEM_SIZE_DEFAULT,
    aspect,
  );
}

export function LodgeConceptPreview({
  lodgeName,
  lodgeNumber,
  city,
  yearEstablished,
  emblemIntent,
  emblemUrl,
  emblemFileName,
  emblemError,
  onEmblemFile,
  onEmblemRemove,
  onEmblemLoadError,
}: Props) {
  const mockupRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const lastEmblemUrlRef = useRef<string | null>(null);

  const [shirtColor, setShirtColor] = useState(TSHIRT_COLORS[0]!.hex);
  const [textColorId, setTextColorId] = useState<TextColorId>("navy");
  const [draggingTarget, setDraggingTarget] = useState<DragTarget | null>(null);
  const [activeLayer, setActiveLayer] = useState<DragTarget>("design");

  const [layout, setLayout] = useState<PrintLayout>(() =>
    layoutFromState(0.14, 0.08, SIZE_DEFAULT, DESIGN_ASPECT),
  );

  const [emblemAspect, setEmblemAspect] = useState(1);
  const [emblemLayout, setEmblemLayout] = useState<PrintLayout>(() =>
    defaultEmblemLayout(1),
  );

  const emblemEnabled = emblemIntent === "have";
  const emblemVisible = emblemEnabled && Boolean(emblemUrl);

  const textHex =
    TEXT_COLORS.find((c) => c.id === textColorId)?.hex ?? "#1E2A44";

  const title = useMemo(() => {
    const name = (lodgeName.trim() || "Your Lodge").toUpperCase();
    const num = lodgeNumber.trim();
    return num ? `${name} No. ${num}` : name;
  }, [lodgeName, lodgeNumber]);

  const subtitle = useMemo(() => {
    const year = yearEstablished.trim();
    const place = city.trim();
    if (year && place) return `Est. ${year} · ${place}`;
    if (year) return `Est. ${year}`;
    return place;
  }, [yearEstablished, city]);

  const boxStyle = designBoxStyle(layout);
  const emblemBoxStyle = designBoxStyle(emblemLayout);
  const sizePct = Math.round(layout.width * 100);
  const emblemSizePct = Math.round(emblemLayout.width * 100);

  // Fresh left-chest placement whenever a new emblem source is chosen.
  useEffect(() => {
    if (!emblemUrl) {
      lastEmblemUrlRef.current = null;
      return;
    }
    if (lastEmblemUrlRef.current === emblemUrl) return;
    lastEmblemUrlRef.current = emblemUrl;
    setEmblemAspect(1);
    setEmblemLayout(defaultEmblemLayout(1));
    setActiveLayer("emblem");
  }, [emblemUrl]);

  const selectShirt = useCallback((hex: string) => {
    setShirtColor(hex);
    setTextColorId((prev) => ensureReadableText(hex, prev));
  }, []);

  const selectTextColor = useCallback(
    (id: TextColorId) => {
      setTextColorId(ensureReadableText(shirtColor, id));
    },
    [shirtColor],
  );

  const setSize = useCallback((nextWidth: number) => {
    setLayout((prev) =>
      resizeKeepingCenter(prev, nextWidth, DESIGN_ASPECT, SIZE_MIN, SIZE_MAX),
    );
  }, []);

  const setEmblemSize = useCallback(
    (nextWidth: number) => {
      setEmblemLayout((prev) =>
        resizeKeepingCenter(
          prev,
          nextWidth,
          emblemAspect,
          EMBLEM_SIZE_MIN,
          EMBLEM_SIZE_MAX,
        ),
      );
    },
    [emblemAspect],
  );

  const nudgeDesign = useCallback((dx: number, dy: number) => {
    setLayout((prev) =>
      layoutFromState(prev.x + dx, prev.y + dy, prev.width, DESIGN_ASPECT),
    );
  }, []);

  const nudgeEmblem = useCallback(
    (dx: number, dy: number) => {
      setEmblemLayout((prev) =>
        layoutFromState(prev.x + dx, prev.y + dy, prev.width, emblemAspect),
      );
    },
    [emblemAspect],
  );

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
      if (state.target === "design") {
        setLayout((prev) =>
          layoutFromState(
            state.originX + dx,
            state.originY + dy,
            prev.width,
            DESIGN_ASPECT,
          ),
        );
      } else {
        setEmblemLayout((prev) =>
          layoutFromState(
            state.originX + dx,
            state.originY + dy,
            prev.width,
            emblemAspect,
          ),
        );
      }
    },
    [clientToPrintDelta, emblemAspect],
  );

  function endDrag(event: ReactPointerEvent) {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDraggingTarget(null);
    try {
      (event.currentTarget as HTMLElement).releasePointerCapture?.(
        event.pointerId,
      );
    } catch {
      /* already released */
    }
  }

  function startDesignDrag(event: ReactPointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    setActiveLayer("design");
    dragRef.current = {
      target: "design",
      startX: event.clientX,
      startY: event.clientY,
      originX: layout.x,
      originY: layout.y,
    };
    setDraggingTarget("design");
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  function startEmblemDrag(event: ReactPointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    setActiveLayer("emblem");
    dragRef.current = {
      target: "emblem",
      startX: event.clientX,
      startY: event.clientY,
      originX: emblemLayout.x,
      originY: emblemLayout.y,
    };
    setDraggingTarget("emblem");
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  useEffect(() => {
    if (!draggingTarget) return;
    const onMove = (event: PointerEvent) => {
      applyDragDelta(event.clientX, event.clientY);
    };
    const onUp = () => {
      dragRef.current = null;
      setDraggingTarget(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [draggingTarget, applyDragDelta]);

  const shirtName =
    TSHIRT_COLORS.find((c) => c.hex === shirtColor)?.name ?? "Custom";
  const textName =
    TEXT_COLORS.find((c) => c.id === textColorId)?.name ?? "Navy";

  const controlBtn =
    "rounded-full border border-[var(--stone)]/60 bg-white px-3 py-2 text-xs font-semibold text-[var(--lodge-blue)] transition hover:border-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]";
  const stepBtn =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--stone)]/60 bg-white text-lg font-semibold text-[var(--lodge-blue)] transition hover:border-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]";

  return (
    <div>
      <ProductStage caption="Concept preview" aspect="portrait">
        <div className="relative w-full max-w-[280px]">
          <div
            ref={mockupRef}
            className="relative mx-auto aspect-[3/4] w-full select-none"
          >
            <div className="absolute inset-0 overflow-hidden">
              <TshirtBodySvg shirtColor={shirtColor} fillContainer />

              <div
                role="button"
                tabIndex={0}
                aria-label="Move Lodge Edition design on shirt"
                className={cn(
                  "absolute z-20 touch-none overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]/80",
                  draggingTarget === "design"
                    ? "cursor-grabbing ring-1 ring-[var(--gold)]/70"
                    : "cursor-grab",
                )}
                style={boxStyle}
                draggable={false}
                onPointerDown={startDesignDrag}
                onPointerMove={(event) =>
                  applyDragDelta(event.clientX, event.clientY)
                }
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onFocus={() => setActiveLayer("design")}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    nudgeDesign(-NUDGE, 0);
                  } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    nudgeDesign(NUDGE, 0);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    nudgeDesign(0, -NUDGE);
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    nudgeDesign(0, NUDGE);
                  }
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center px-[6%] text-center">
                  <p
                    className="text-[clamp(5px,4.2%,8px)] font-semibold uppercase tracking-[0.28em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                    style={{
                      color:
                        textColorId === "gold" ? textHex : "var(--gold)",
                    }}
                  >
                    the ASHLAR CRAFTSMAN
                  </p>
                  <p
                    className="mt-[0.35em] font-[family-name:var(--font-display)] text-[clamp(9px,11%,16px)] leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
                    style={{ color: textHex }}
                  >
                    {title}
                  </p>
                  {subtitle ? (
                    <p
                      className="mt-[0.4em] text-[clamp(6px,5.5%,10px)] uppercase tracking-[0.18em] opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                      style={{ color: textHex }}
                    >
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </div>

              {emblemVisible ? (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Move Lodge emblem on shirt"
                  className={cn(
                    "absolute z-30 touch-none overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]/80",
                    draggingTarget === "emblem"
                      ? "cursor-grabbing ring-1 ring-[var(--gold)]/80"
                      : "cursor-grab",
                    activeLayer === "emblem" &&
                      draggingTarget !== "emblem" &&
                      "ring-1 ring-[var(--gold)]/55",
                  )}
                  style={emblemBoxStyle}
                  draggable={false}
                  onPointerDown={startEmblemDrag}
                  onPointerMove={(event) =>
                    applyDragDelta(event.clientX, event.clientY)
                  }
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onFocus={() => setActiveLayer("emblem")}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      nudgeEmblem(-NUDGE, 0);
                    } else if (event.key === "ArrowRight") {
                      event.preventDefault();
                      nudgeEmblem(NUDGE, 0);
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      nudgeEmblem(0, -NUDGE);
                    } else if (event.key === "ArrowDown") {
                      event.preventDefault();
                      nudgeEmblem(0, NUDGE);
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- object-URL preview; not a static asset */}
                  <img
                    src={emblemUrl!}
                    alt=""
                    draggable={false}
                    className="pointer-events-none h-full w-full select-none object-contain"
                    onLoad={(event) => {
                      const img = event.currentTarget;
                      const w = img.naturalWidth;
                      const h = img.naturalHeight;
                      if (!w || !h) return;
                      const nextAspect = w / h;
                      setEmblemAspect(nextAspect);
                      setEmblemLayout((prev) =>
                        resizeKeepingCenter(
                          prev,
                          prev.width,
                          nextAspect,
                          EMBLEM_SIZE_MIN,
                          EMBLEM_SIZE_MAX,
                        ),
                      );
                    }}
                    onError={() => {
                      onEmblemLoadError?.();
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </ProductStage>

      <div className="mt-4 space-y-5 rounded-2xl border border-[var(--stone)]/50 bg-[var(--panel)] p-4">
        {/* SHIRT */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Shirt
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--walnut)]/70">
            Color
          </p>
          <p className="mt-1 text-xs text-[var(--walnut)]/70">{shirtName}</p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="listbox"
            aria-label="Shirt color"
          >
            {TSHIRT_COLORS.map((color) => {
              const selected = color.hex === shirtColor;
              return (
                <button
                  key={color.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={color.name}
                  title={color.name}
                  onClick={() => selectShirt(color.hex)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                    selected
                      ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/40"
                      : "border-[var(--stone)]/50 hover:border-[var(--gold)]/50",
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* LODGE EDITION */}
        <div className="space-y-4 border-t border-[var(--stone)]/40 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Lodge Edition
          </p>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--walnut)]/70">
              Text color
            </p>
            <p className="mt-1 text-xs text-[var(--walnut)]/70">{textName}</p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="listbox"
              aria-label="Text color"
            >
              {TEXT_COLORS.map((color) => {
                const selected = color.id === textColorId;
                const readable = isReadable(color.hex, shirtColor);
                return (
                  <button
                    key={color.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    aria-label={color.name}
                    title={
                      readable
                        ? color.name
                        : `${color.name} (low contrast on this shirt)`
                    }
                    disabled={!readable && !selected}
                    onClick={() => selectTextColor(color.id)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] disabled:opacity-35",
                      selected
                        ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/40"
                        : "border-[var(--stone)]/50 hover:border-[var(--gold)]/50",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--walnut)]/70">
                Size
              </p>
              <p className="text-xs font-semibold text-[var(--lodge-blue)]">
                {sizePct}%
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease design size"
                onClick={() => setSize(layout.width - 0.06)}
                className={stepBtn}
              >
                −
              </button>
              <input
                type="range"
                min={SIZE_MIN}
                max={SIZE_MAX}
                step={0.01}
                value={layout.width}
                aria-label="Design size"
                onChange={(event) => setSize(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-[var(--gold)]"
              />
              <button
                type="button"
                aria-label="Increase design size"
                onClick={() => setSize(layout.width + 0.06)}
                className={stepBtn}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--walnut)]/70">
              Position
            </p>
            <p className="mt-1 text-xs text-[var(--walnut)]/70">
              Drag the Lodge Edition design on the shirt, or use the controls.
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <span aria-hidden />
              <button
                type="button"
                aria-label="Move design up"
                onClick={() => {
                  setActiveLayer("design");
                  nudgeDesign(0, -NUDGE);
                }}
                className={controlBtn}
              >
                Up
              </button>
              <span aria-hidden />
              <button
                type="button"
                aria-label="Move design left"
                onClick={() => {
                  setActiveLayer("design");
                  nudgeDesign(-NUDGE, 0);
                }}
                className={controlBtn}
              >
                Left
              </button>
              <button
                type="button"
                aria-label="Move design down"
                onClick={() => {
                  setActiveLayer("design");
                  nudgeDesign(0, NUDGE);
                }}
                className={controlBtn}
              >
                Down
              </button>
              <button
                type="button"
                aria-label="Move design right"
                onClick={() => {
                  setActiveLayer("design");
                  nudgeDesign(NUDGE, 0);
                }}
                className={controlBtn}
              >
                Right
              </button>
            </div>
          </div>
        </div>

        {/* LODGE EMBLEM */}
        {emblemEnabled ? (
          <div className="space-y-4 border-t border-[var(--stone)]/40 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Lodge Emblem
            </p>

            <LodgeEmblemUploadField
              fileName={emblemFileName}
              error={emblemError}
              onFile={onEmblemFile}
              onRemove={onEmblemRemove}
            />

            {emblemVisible ? (
              <>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--walnut)]/70">
                      Size
                    </p>
                    <p className="text-xs font-semibold text-[var(--lodge-blue)]">
                      {emblemSizePct}%
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease emblem size"
                      onClick={() => {
                        setActiveLayer("emblem");
                        setEmblemSize(emblemLayout.width - 0.04);
                      }}
                      className={stepBtn}
                    >
                      −
                    </button>
                    <input
                      type="range"
                      min={EMBLEM_SIZE_MIN}
                      max={EMBLEM_SIZE_MAX}
                      step={0.01}
                      value={emblemLayout.width}
                      aria-label="Emblem size"
                      onChange={(event) => {
                        setActiveLayer("emblem");
                        setEmblemSize(Number(event.target.value));
                      }}
                      className="h-2 w-full cursor-pointer accent-[var(--gold)]"
                    />
                    <button
                      type="button"
                      aria-label="Increase emblem size"
                      onClick={() => {
                        setActiveLayer("emblem");
                        setEmblemSize(emblemLayout.width + 0.04);
                      }}
                      className={stepBtn}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--walnut)]/70">
                    Position
                  </p>
                  <p className="mt-1 text-xs text-[var(--walnut)]/70">
                    Drag the emblem on the shirt, or use the controls.
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <span aria-hidden />
                    <button
                      type="button"
                      aria-label="Move emblem up"
                      onClick={() => {
                        setActiveLayer("emblem");
                        nudgeEmblem(0, -NUDGE);
                      }}
                      className={controlBtn}
                    >
                      Up
                    </button>
                    <span aria-hidden />
                    <button
                      type="button"
                      aria-label="Move emblem left"
                      onClick={() => {
                        setActiveLayer("emblem");
                        nudgeEmblem(-NUDGE, 0);
                      }}
                      className={controlBtn}
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      aria-label="Move emblem down"
                      onClick={() => {
                        setActiveLayer("emblem");
                        nudgeEmblem(0, NUDGE);
                      }}
                      className={controlBtn}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      aria-label="Move emblem right"
                      onClick={() => {
                        setActiveLayer("emblem");
                        nudgeEmblem(NUDGE, 0);
                      }}
                      className={controlBtn}
                    >
                      Right
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
