"use client";

import { memo, useId } from "react";
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
  /** grid = lightweight; preview/print keep full fidelity. */
  quality?: "grid" | "preview" | "print";
};

const CREAM = "#F4EFE6";
const NAVY = "#0F1C2E";
const GOLD = "#C9A227";
const IVORY = "#F7F4EE";

/**
 * Layered sticker stage:
 * collectible card frame → background motif → avatar → props → badge text.
 */
export const StickerRenderer = memo(function StickerRenderer({
  sticker,
  config,
  className,
  stageRef,
  showOutline = true,
  quality = "preview",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const composition = sticker.composition;
  const merged = composeAvatarConfig(config, composition);
  const background = composition.background ?? "parchment";
  const props = composition.props ?? [];
  const isGrid = quality === "grid";

  /**
   * Card / environment motifs render BEHIND the avatar.
   * Handheld / interactive props render in the foreground layer.
   * Emblematic motifs must never use the foreground layer — they would
   * paint over the character face when anchors sit in the head zone.
   */
  const environmentProps = props.filter((p) =>
    [
      "columns",
      "lodgeBuilding",
      "sun",
      "moon",
      "spark",
      "handshakePartner",
      "squareAndCompasses",
    ].includes(p),
  );
  const foregroundProps = props.filter(
    (p) => !environmentProps.includes(p),
  );

  return (
    <div
      ref={stageRef}
      data-sticker-stage={sticker.id}
      data-sticker-quality={quality}
      className={cn(
        "relative aspect-square w-full",
        showOutline && !isGrid && "sticker-outline-preview",
        className,
      )}
    >
      <svg
        viewBox="0 0 360 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        data-sticker-decor
      >
        <CollectibleCardFrame uid={uid} />
        <g clipPath={`url(#${uid}-card-clip)`}>
          <StickerBackdrop type={background} uid={uid} />
          {environmentProps.map((prop) => (
            <StickerProp key={`${uid}-env-${prop}`} id={prop} />
          ))}
        </g>
      </svg>

      <div
        className="absolute inset-x-[12%] top-[6%] bottom-[22%]"
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
          style={composition.textStyle ?? "collectible"}
        />
      ) : null}
    </div>
  );
});

function CollectibleCardFrame({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-card-clip`}>
          <rect x="14" y="14" width="332" height="332" rx="28" />
        </clipPath>
        <linearGradient id={`${uid}-card-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={IVORY} />
          <stop offset="100%" stopColor={CREAM} />
        </linearGradient>
      </defs>
      <rect
        x="8"
        y="8"
        width="344"
        height="344"
        rx="32"
        fill={NAVY}
        opacity="0.12"
      />
      <rect
        x="14"
        y="14"
        width="332"
        height="332"
        rx="28"
        fill={`url(#${uid}-card-face)`}
        stroke={GOLD}
        strokeWidth="3.5"
      />
      <rect
        x="22"
        y="22"
        width="316"
        height="316"
        rx="22"
        fill="none"
        stroke={NAVY}
        strokeWidth="1"
        opacity="0.22"
      />
    </g>
  );
}

function StickerTextBanner({
  text,
  style,
}: {
  text: string;
  style: StickerTextStyle;
}) {
  const lines = text.includes("\n") ? text.split("\n") : wrapBadgeLines(text);
  const collectible = style === "collectible" || style === "badge";
  const soft = style === "soft";

  return (
    <div
      className="absolute inset-x-[7%] bottom-[4.5%] flex justify-center"
      data-sticker-text
    >
      <div
        className={cn(
          "max-w-[94%] px-3.5 py-2 text-center",
          soft
            ? "rounded-xl bg-[var(--lodge-blue)]/80"
            : collectible
              ? "rounded-full border border-[var(--gold)] bg-[color-mix(in_srgb,var(--lodge-blue)_94%,black)] shadow-[0_6px_16px_rgba(15,28,46,0.28)]"
              : "rounded-2xl border-2 border-[var(--gold)] bg-[var(--lodge-blue)]/95 shadow-[0_8px_20px_rgba(15,28,46,0.28)]",
        )}
      >
        {lines.map((line) => (
          <p
            key={line}
            className={cn(
              "font-[family-name:var(--font-display)] font-bold uppercase leading-tight tracking-[0.12em] text-[var(--ivory)]",
              lines.length > 2
                ? "text-[8px] sm:text-[9px]"
                : line.length > 18
                  ? "text-[9px] sm:text-[10px]"
                  : "text-[10px] sm:text-[11px]",
            )}
            style={{
              textShadow: soft
                ? undefined
                : "0 1px 0 rgba(0,0,0,0.35), 0 0 1px rgba(201,162,39,0.45)",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Deterministic wrap for long single-line badges — preserves exact wording. */
function wrapBadgeLines(text: string): string[] {
  if (text.length <= 16) return [text];
  const words = text.split(" ");
  if (words.length < 2) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function StickerBackdrop({
  type,
  uid,
}: {
  type: StickerBackgroundId;
  uid: string;
}) {
  if (type === "transparent") return null;

  if (type === "sunRays" || type === "sunrise") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        <g transform="translate(72 64)" opacity="0.85">
          <circle cx="0" cy="0" r="18" fill="none" stroke={GOLD} strokeWidth="2" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={Math.cos(rad) * 24}
                y1={Math.sin(rad) * 24}
                x2={Math.cos(rad) * 38}
                y2={Math.sin(rad) * 38}
                stroke={GOLD}
                strokeWidth="1.75"
                strokeLinecap="round"
                opacity="0.7"
              />
            );
          })}
        </g>
      </g>
    );
  }

  if (type === "lodgeSilhouette" || type === "lodge") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={IVORY} />
        <g transform="translate(36 250)" opacity="0.35">
          <path d="M0 60 L40 10 L80 60 Z" fill="none" stroke={NAVY} strokeWidth="2" />
          <rect x="12" y="60" width="56" height="48" fill="none" stroke={NAVY} strokeWidth="2" />
          <rect x="32" y="78" width="16" height="30" fill="none" stroke={GOLD} strokeWidth="1.5" />
        </g>
      </g>
    );
  }

  if (type === "goldLevelLine") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        <line
          x1="40"
          y1="188"
          x2="320"
          y2="188"
          stroke={GOLD}
          strokeWidth="3"
          opacity="0.55"
        />
        <line
          x1="40"
          y1="196"
          x2="320"
          y2="196"
          stroke={NAVY}
          strokeWidth="1"
          opacity="0.2"
        />
      </g>
    );
  }

  if (type === "neonRing" || type === "goldRing") {
    return (
      <g>
        <defs>
          <radialGradient id={`${uid}-ring`} cx="50%" cy="38%" r="45%">
            <stop offset="70%" stopColor={CREAM} />
            <stop offset="100%" stopColor="#E8EEF8" />
          </radialGradient>
        </defs>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={`url(#${uid}-ring)`} />
        <circle
          cx="180"
          cy="128"
          r="78"
          fill="none"
          stroke="#3A6EA5"
          strokeWidth="3"
          opacity="0.45"
        />
        <circle
          cx="180"
          cy="128"
          r="72"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.5"
          opacity="0.55"
        />
      </g>
    );
  }

  if (type === "compassRose" || type === "journey") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={IVORY} />
        <g transform="translate(180 150)" opacity="0.28">
          <circle cx="0" cy="0" r="70" fill="none" stroke={NAVY} strokeWidth="1.25" />
          <circle cx="0" cy="0" r="48" fill="none" stroke={GOLD} strokeWidth="1" />
          {[0, 45, 90, 135].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="-70"
              x2="0"
              y2="70"
              stroke={NAVY}
              strokeWidth="1"
              transform={`rotate(${deg})`}
            />
          ))}
          <path d="M0 -28 L8 0 L0 28 L-8 0 Z" fill={GOLD} opacity="0.7" />
        </g>
        {[80, 120, 160, 200, 240, 280].map((y, i) => (
          <line
            key={y}
            x1="40"
            y1={y}
            x2="320"
            y2={y}
            stroke={NAVY}
            strokeWidth="0.6"
            opacity={0.08 + (i % 2) * 0.04}
          />
        ))}
      </g>
    );
  }

  if (type === "squareCompassMotif") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        <g transform="translate(180 130)" opacity="0.22">
          <path
            d="M0 -70 L-55 55 L55 55 Z"
            fill="none"
            stroke={GOLD}
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path d="M-40 20 H40" stroke={GOLD} strokeWidth="7" />
          <circle cx="0" cy="8" r="18" fill="none" stroke={NAVY} strokeWidth="5" />
        </g>
      </g>
    );
  }

  if (type === "interlockingForms") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={IVORY} />
        <defs>
          <radialGradient id={`${uid}-warm`} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#F4D078" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F4D078" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="150" r="90" fill={`url(#${uid}-warm)`} />
        <circle
          cx="155"
          cy="145"
          r="42"
          fill="none"
          stroke={GOLD}
          strokeWidth="3"
          opacity="0.45"
        />
        <circle
          cx="205"
          cy="145"
          r="42"
          fill="none"
          stroke={NAVY}
          strokeWidth="3"
          opacity="0.28"
        />
      </g>
    );
  }

  if (type === "plumbLine") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        <line
          x1="180"
          y1="40"
          x2="180"
          y2="300"
          stroke={GOLD}
          strokeWidth="2.5"
          opacity="0.5"
        />
        <path
          d="M180 300 L168 318 H192 Z"
          fill={NAVY}
          opacity="0.45"
        />
      </g>
    );
  }

  if (type === "blueprintGrid" || type === "parchment") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill="#EEF3F8" />
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={40 + i * 28}
            y1="36"
            x2={40 + i * 28}
            y2="324"
            stroke="#1E3A5F"
            strokeWidth="0.7"
            opacity="0.12"
          />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="36"
            y1={40 + i * 28}
            x2="324"
            y2={40 + i * 28}
            stroke="#1E3A5F"
            strokeWidth="0.7"
            opacity="0.12"
          />
        ))}
      </g>
    );
  }

  if (type === "draftingBoard") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        <rect
          x="48"
          y="250"
          width="90"
          height="62"
          rx="4"
          fill="none"
          stroke={NAVY}
          strokeWidth="1.75"
          opacity="0.3"
          transform="rotate(-8 93 281)"
        />
        <path
          d="M60 290 L90 260 L120 290"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.5"
          opacity="0.55"
          transform="rotate(-8 93 281)"
        />
      </g>
    );
  }

  if (type === "tableSetting") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={IVORY} />
        <ellipse
          cx="180"
          cy="300"
          rx="110"
          ry="22"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.5"
          opacity="0.35"
        />
        <ellipse
          cx="180"
          cy="300"
          rx="70"
          ry="12"
          fill="none"
          stroke={NAVY}
          strokeWidth="1"
          opacity="0.2"
        />
      </g>
    );
  }

  if (type === "ascendingSteps") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={70 + i * 18}
            y={280 - i * 28}
            width={220 - i * 36}
            height="28"
            fill="none"
            stroke={NAVY}
            strokeWidth="1.75"
            opacity={0.18 + i * 0.06}
          />
        ))}
      </g>
    );
  }

  if (type === "arches") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={IVORY} />
        <path
          d="M70 300 V160 Q70 70 180 70 Q290 70 290 160 V300"
          fill="none"
          stroke={NAVY}
          strokeWidth="2.5"
          opacity="0.22"
        />
        <path
          d="M100 300 V175 Q100 100 180 100 Q260 100 260 175 V300"
          fill="none"
          stroke={GOLD}
          strokeWidth="2"
          opacity="0.4"
        />
      </g>
    );
  }

  if (type === "starburstEmblem") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        {/* Rays may radiate behind the upper figure; emblem sits behind torso — not the face. */}
        <g transform="translate(180 120)" opacity="0.32">
          {Array.from({ length: 12 }).map((_, i) => {
            const deg = i * 30;
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={Math.cos(rad) * 36}
                y1={Math.sin(rad) * 36}
                x2={Math.cos(rad) * 68}
                y2={Math.sin(rad) * 68}
                stroke={GOLD}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        <g transform="translate(180 168)" opacity="0.28">
          <path
            d="M0 -28 L-22 24 L22 24 Z"
            fill="none"
            stroke={NAVY}
            strokeWidth="3"
          />
          <path d="M-16 8 H16" stroke={NAVY} strokeWidth="2.5" />
        </g>
      </g>
    );
  }

  if (type === "mapPins") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={IVORY} />
        {[
          [70, 250],
          [120, 280],
          [280, 240],
          [300, 290],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} opacity="0.4">
            <path
              d="M0 0 Q0 -18 12 -18 Q24 -18 24 0 L12 18 Z"
              fill="none"
              stroke={i % 2 ? GOLD : NAVY}
              strokeWidth="1.75"
              transform="translate(-12 -18)"
            />
            <rect
              x="-10"
              y="22"
              width="20"
              height="14"
              fill="none"
              stroke={NAVY}
              strokeWidth="1.25"
              opacity="0.7"
            />
          </g>
        ))}
      </g>
    );
  }

  if (type === "checkerboard") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const y = 220 + row * 18;
            const perspective = 1 + row * 0.08;
            const w = 36 * perspective;
            const x = 40 + col * w - row * 4;
            if ((row + col) % 2 !== 0) return null;
            return (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={w}
                height="18"
                fill={NAVY}
                opacity={0.12 + row * 0.03}
              />
            );
          }),
        )}
      </g>
    );
  }

  if (type === "parallelLines") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        <line x1="36" y1="200" x2="324" y2="200" stroke={GOLD} strokeWidth="3" opacity="0.55" />
        <line x1="36" y1="214" x2="324" y2="214" stroke={GOLD} strokeWidth="3" opacity="0.55" />
      </g>
    );
  }

  if (type === "radiantBeam") {
    return (
      <g>
        <defs>
          <linearGradient id={`${uid}-beam`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#F4D078" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F4D078" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={IVORY} />
        <path
          d="M140 40 L220 40 L260 320 L100 320 Z"
          fill={`url(#${uid}-beam)`}
        />
      </g>
    );
  }

  if (type === "speechBubble") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
        {/* Anchored in the far top-right card margin — clear of the head/face zone. */}
        <g transform="translate(268 28)" opacity="0.5">
          <rect
            x="0"
            y="0"
            width="58"
            height="36"
            rx="12"
            fill="none"
            stroke={NAVY}
            strokeWidth="2"
          />
          <path d="M18 36 L24 48 L32 36" fill="none" stroke={NAVY} strokeWidth="2" />
          <g transform="translate(29 16)">
            <path
              d="M0 -8 L-7 8 L7 8 Z"
              fill="none"
              stroke={GOLD}
              strokeWidth="1.5"
            />
            <path d="M-5 2 H5" stroke={GOLD} strokeWidth="1.25" />
          </g>
        </g>
      </g>
    );
  }

  if (type === "moonlitLodge" || type === "evening") {
    return (
      <g>
        <rect x="14" y="14" width="332" height="332" rx="28" fill="#0F1C2E" />
        <g transform="translate(40 230)" opacity="0.9">
          <path d="M10 70 L55 20 L100 70 Z" fill="#1A2A40" stroke={GOLD} strokeWidth="1.25" />
          <rect x="22" y="70" width="66" height="55" fill="#162338" stroke={GOLD} strokeWidth="1.25" />
          <rect x="36" y="88" width="10" height="12" fill="#F4D078" opacity="0.85" />
          <rect x="64" y="88" width="10" height="12" fill="#F4D078" opacity="0.7" />
          <rect x="48" y="108" width="14" height="17" fill="#0A1220" />
        </g>
      </g>
    );
  }

  return (
    <rect x="14" y="14" width="332" height="332" rx="28" fill={CREAM} />
  );
}
