"use client";

import { useId } from "react";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { composeAvatarConfig } from "@/lib/stickers/compose";
import { StickerProp } from "@/lib/stickers/props";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/types";
import type {
  StickerBackgroundId,
  StickerDefinition,
  StickerTextStyle,
} from "@/types/stickers";

type Props = {
  sticker: StickerDefinition;
  config: AvatarConfig;
  className?: string;
  stageRef?: React.RefObject<HTMLDivElement | null>;
  /** Preview outline via CSS drop-shadow (export uses true silhouette). */
  showOutline?: boolean;
};

/**
 * Layered sticker stage:
 * background → environment props → avatar (existing AvatarCanvas) →
 * foreground props → text → outline (preview).
 */
export function StickerRenderer({
  sticker,
  config,
  className,
  stageRef,
  showOutline = true,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const composition = sticker.composition;
  const merged = composeAvatarConfig(config, composition);
  const background = composition.background ?? "transparent";
  const props = composition.props ?? [];

  const environmentProps = props.filter((p) =>
    ["columns", "lodgeBuilding", "sun", "moon", "spark"].includes(p),
  );
  const foregroundProps = props.filter(
    (p) => !environmentProps.includes(p),
  );

  return (
    <div
      ref={stageRef}
      data-sticker-stage={sticker.id}
      className={cn(
        "relative aspect-square w-full",
        showOutline && "sticker-outline-preview",
        className,
      )}
    >
      <svg
        viewBox="0 0 360 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        data-sticker-decor
      >
        <StickerBackdrop type={background} />
        {environmentProps.map((prop) => (
          <StickerProp key={`${uid}-env-${prop}`} id={prop} />
        ))}
      </svg>

      <div
        className="absolute inset-x-[10%] top-[4%] bottom-[18%]"
        data-sticker-avatar
      >
        <AvatarCanvas
          config={merged}
          showBackground={false}
          decorative
          className="h-full w-full"
        />
      </div>

      <svg
        viewBox="0 0 360 360"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
        data-sticker-foreground
      >
        {foregroundProps.map((prop) => (
          <StickerProp key={`${uid}-fg-${prop}`} id={prop} />
        ))}
      </svg>

      {composition.text ? (
        <StickerTextBanner
          text={composition.text}
          style={composition.textStyle ?? "banner"}
        />
      ) : null}
    </div>
  );
}

function StickerTextBanner({
  text,
  style,
}: {
  text: string;
  style: StickerTextStyle;
}) {
  const lines = text.split("\n");
  const soft = style === "soft";

  return (
    <div
      className="absolute inset-x-[5%] bottom-[3%] flex justify-center"
      data-sticker-text
    >
      <div
        className={cn(
          "max-w-[94%] px-3 py-2 text-center",
          soft
            ? "rounded-xl bg-[var(--lodge-blue)]/80"
            : "rounded-2xl border-2 border-[var(--gold)] bg-[var(--lodge-blue)]/95 shadow-[0_8px_20px_rgba(15,28,46,0.28)]",
        )}
      >
        {lines.map((line) => (
          <p
            key={line}
            className={cn(
              "font-[family-name:var(--font-display)] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--ivory)]",
              lines.length > 2 ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-[11px]",
            )}
            style={{
              textShadow: soft
                ? undefined
                : "0 1px 0 rgba(0,0,0,0.35), 0 0 1px rgba(201,162,39,0.5)",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function StickerBackdrop({ type }: { type: StickerBackgroundId }) {
  if (type === "transparent") return null;

  if (type === "sunrise") {
    return (
      <g>
        <defs>
          <linearGradient id="sunrise-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4EFE4" />
            <stop offset="100%" stopColor="#E8D5A8" />
          </linearGradient>
        </defs>
        <circle cx="180" cy="180" r="168" fill="url(#sunrise-bg)" opacity="0.95" />
      </g>
    );
  }

  if (type === "evening") {
    return (
      <g>
        <circle cx="180" cy="180" r="168" fill="#0F1C2E" />
        <path
          d="M50 300 L180 170 L310 300 Z"
          fill="none"
          stroke="#C9A227"
          strokeWidth="2"
          opacity="0.3"
        />
      </g>
    );
  }

  if (type === "lodge") {
    return (
      <g>
        <circle cx="180" cy="180" r="168" fill="#F4EFE4" />
        <path
          d="M70 280 L180 120 L290 280 Z"
          fill="none"
          stroke="#0F1C2E"
          strokeWidth="2"
          opacity="0.2"
        />
      </g>
    );
  }

  if (type === "parchment") {
    return (
      <g>
        <circle cx="180" cy="180" r="168" fill="#F4EFE4" />
        <circle
          cx="180"
          cy="180"
          r="168"
          fill="none"
          stroke="#C9A227"
          strokeWidth="2"
          opacity="0.35"
        />
      </g>
    );
  }

  if (type === "goldRing") {
    return (
      <g>
        <circle cx="180" cy="180" r="168" fill="#F7F4EE" />
        <circle cx="180" cy="180" r="168" fill="none" stroke="#C9A227" strokeWidth="5" />
        <circle
          cx="180"
          cy="180"
          r="156"
          fill="none"
          stroke="#0F1C2E"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </g>
    );
  }

  if (type === "journey") {
    return (
      <g>
        <circle cx="180" cy="180" r="168" fill="#F7F4EE" />
        <path
          d="M55 290 L120 210 L180 255 L240 170 L305 280"
          fill="none"
          stroke="#C9A227"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />
      </g>
    );
  }

  return null;
}
