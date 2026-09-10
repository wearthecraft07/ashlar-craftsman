"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/utils";
import {
  constrainLayout,
  designBoxStyle,
  printAreaStyle,
  type PrintLayout,
} from "@/lib/print/layout";

type Props = {
  layout: PrintLayout;
  shirtColor?: string;
  /** Show print-safe guides and handles */
  editing?: boolean;
  className?: string;
  onChange?: (next: PrintLayout) => void;
};

type DragMode = "move" | "resize" | "rotate" | null;

/**
 * Shared tee + design composition for admin editor and storefront.
 * Placement uses normalized print-area coordinates.
 */
export function ShirtPrintComposer({
  layout,
  shirtColor = "#0A0A0A",
  editing = false,
  className,
  onChange,
}: Props) {
  const clipId = useId().replace(/:/g, "");
  const stageRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragMode>(null);
  const [designBroken, setDesignBroken] = useState(false);
  const [mockupBroken, setMockupBroken] = useState(false);
  const dragRef = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    origin: PrintLayout;
  } | null>(null);

  useEffect(() => {
    setDesignBroken(false);
  }, [layout.designUrl]);

  useEffect(() => {
    setMockupBroken(false);
  }, [layout.mockupUrl]);

  const fill = shirtColor;
  const light =
    fill.toLowerCase() === "#f7f7f5" ||
    fill.toLowerCase() === "#ffffff" ||
    fill.toLowerCase() === "#d6d1c7";
  const stroke = light ? "#1E2A44" : "#F7F2E7";

  const emit = useCallback(
    (next: PrintLayout) => {
      onChange?.(constrainLayout(next));
    },
    [onChange],
  );

  const clientToPrintDelta = useCallback(
    (dxPx: number, dyPx: number) => {
      const el = stageRef.current;
      if (!el) return { dx: 0, dy: 0 };
      const rect = el.getBoundingClientRect();
      const pa = dragRef.current?.origin.printArea ?? layout.printArea;
      const printW = rect.width * pa.width;
      const printH = rect.height * pa.height;
      return {
        dx: printW > 0 ? dxPx / printW : 0,
        dy: printH > 0 ? dyPx / printH : 0,
      };
    },
    [layout.printArea],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const state = dragRef.current;
      if (!state?.mode) return;
      const { dx, dy } = clientToPrintDelta(
        event.clientX - state.startX,
        event.clientY - state.startY,
      );
      const o = state.origin;

      if (state.mode === "move") {
        emit({ ...o, x: o.x + dx, y: o.y + dy });
        return;
      }

      if (state.mode === "resize") {
        emit({ ...o, width: o.width + dx });
        return;
      }

      if (state.mode === "rotate") {
        const el = stageRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const pa = o.printArea;
        const cx =
          rect.left +
          rect.width * (pa.x + (o.x + o.width / 2) * pa.width);
        const cy =
          rect.top +
          rect.height * (pa.y + (o.y + o.height / 2) * pa.height);
        const angle =
          (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) /
          Math.PI;
        emit({ ...o, rotation: Math.round(angle + 90) });
      }
    },
    [clientToPrintDelta, emit],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDrag(null);
  }, []);

  useEffect(() => {
    if (!drag) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [drag, onPointerMove, endDrag]);

  function startDrag(
    mode: Exclude<DragMode, null>,
    event: ReactPointerEvent,
  ) {
    if (!editing || !onChange) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: layout,
    };
    setDrag(mode);
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  const box = designBoxStyle(layout);
  const area = printAreaStyle(layout.printArea);
  const hasDesign = Boolean(layout.designUrl) && !designBroken;
  const showMockup = Boolean(layout.mockupUrl) && !mockupBroken;

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative mx-auto w-full max-w-[340px] select-none",
        className,
      )}
    >
      <div className="relative aspect-[200/220] w-full">
        {showMockup ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={layout.mockupUrl!}
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
            onError={() => setMockupBroken(true)}
          />
        ) : (
          <svg
            viewBox="0 0 200 220"
            className="absolute inset-0 h-full w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.28)]"
            aria-hidden
          >
            <defs>
              <clipPath id={`body-${clipId}`}>
                <path d="M60 96 L140 96 L140 190 L60 190 Z" />
              </clipPath>
            </defs>
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
            <path
              d="M70 72 L78 96 M130 72 L122 96"
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              opacity="0.18"
            />
          </svg>
        )}

        {editing && (
          <div
            className="pointer-events-none absolute border border-dashed border-[var(--gold)]/55 bg-[var(--gold)]/[0.04]"
            style={area}
            aria-hidden
          />
        )}

        {hasDesign && (
          <div
            className={cn(
              "absolute",
              editing && onChange
                ? "cursor-move touch-none"
                : "pointer-events-none",
            )}
            style={{
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
              transform: box.transform,
              transformOrigin: "center center",
            }}
            onPointerDown={
              editing && onChange
                ? (e) => startDrag("move", e)
                : undefined
            }
            role={editing ? "group" : undefined}
            aria-label={editing ? "Print design — drag to move" : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={layout.designUrl!}
              alt=""
              className="pointer-events-none h-full w-full object-contain"
              draggable={false}
              onError={() => setDesignBroken(true)}
            />

            {editing && onChange && (
              <>
                <button
                  type="button"
                  aria-label="Resize design"
                  className="absolute -bottom-2 -right-2 h-5 w-5 cursor-se-resize rounded-full border-2 border-[var(--lodge-blue)] bg-[var(--gold)] shadow"
                  onPointerDown={(e) => startDrag("resize", e)}
                />
                <button
                  type="button"
                  aria-label="Rotate design"
                  className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 cursor-grab rounded-full border-2 border-[var(--lodge-blue)] bg-white shadow active:cursor-grabbing"
                  onPointerDown={(e) => startDrag("rotate", e)}
                />
              </>
            )}
          </div>
        )}

        {layout.designUrl && designBroken && (
          <p className="absolute inset-x-4 bottom-4 rounded-xl bg-black/55 px-3 py-2 text-center text-xs text-white/80">
            Design image unavailable
          </p>
        )}
      </div>
    </div>
  );
}
