"use client";

import { useId } from "react";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { applyStickerToConfig } from "@/lib/stickers/catalog";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/types";
import type {
  StickerBackground,
  StickerDefinition,
  StickerPropId,
} from "@/types/stickers";

type Props = {
  sticker: StickerDefinition;
  config: AvatarConfig;
  className?: string;
  /** Attach to the outer stage for export queries */
  stageRef?: React.RefObject<HTMLDivElement | null>;
};

/**
 * Layered sticker stage: SVG backdrop/props/caption + live AvatarCanvas.
 * Export helpers read [data-sticker-avatar] SVG and compose a flat SVG/PNG.
 */
export function StickerRenderer({
  sticker,
  config,
  className,
  stageRef,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const merged = applyStickerToConfig(config, sticker);

  return (
    <div
      ref={stageRef}
      data-sticker-stage={sticker.id}
      className={cn("relative aspect-[360/440] w-full", className)}
    >
      <svg
        viewBox="0 0 360 440"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <StickerBackdrop type={sticker.background ?? "none"} />
        {(sticker.props ?? []).map((prop) => (
          <StickerProp key={`${uid}-${prop}`} id={prop} />
        ))}
      </svg>

      <div
        className="absolute inset-x-[11%] top-[2.5%] bottom-[16%]"
        data-sticker-avatar
      >
        <AvatarCanvas
          config={merged}
          showBackground={false}
          decorative
          className="h-full w-full"
        />
      </div>

      {sticker.text ? (
        <div className="absolute inset-x-[6%] bottom-[3.5%] flex justify-center">
          <div className="max-w-[92%] rounded-2xl border-2 border-[var(--gold)] bg-[var(--lodge-blue)]/95 px-3 py-2 text-center shadow-[0_8px_24px_rgba(15,28,46,0.28)]">
            {sticker.text.split("\n").map((line) => (
              <p
                key={line}
                className="font-[family-name:var(--font-display)] text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--ivory)] sm:text-[11px]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StickerBackdrop({ type }: { type: StickerBackground }) {
  if (type === "none") return null;

  if (type === "parchment") {
    return (
      <g>
        <rect
          x="18"
          y="18"
          width="324"
          height="404"
          rx="36"
          fill="#F4EFE4"
          stroke="#C9A227"
          strokeWidth="2"
          strokeOpacity="0.45"
        />
        <circle
          cx="48"
          cy="52"
          r="10"
          fill="none"
          stroke="#C9A227"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle
          cx="312"
          cy="52"
          r="10"
          fill="none"
          stroke="#C9A227"
          strokeWidth="1.5"
          opacity="0.35"
        />
      </g>
    );
  }

  if (type === "gold-ring") {
    return (
      <g>
        <circle cx="180" cy="200" r="168" fill="#F7F4EE" opacity="0.95" />
        <circle
          cx="180"
          cy="200"
          r="168"
          fill="none"
          stroke="#C9A227"
          strokeWidth="4"
        />
        <circle
          cx="180"
          cy="200"
          r="156"
          fill="none"
          stroke="#0F1C2E"
          strokeWidth="1.5"
          opacity="0.35"
        />
      </g>
    );
  }

  if (type === "columns") {
    return (
      <g opacity="0.9">
        <rect
          x="24"
          y="40"
          width="28"
          height="320"
          rx="6"
          fill="#E8E0D0"
          stroke="#1A120C"
          strokeWidth="2"
        />
        <rect
          x="308"
          y="40"
          width="28"
          height="320"
          rx="6"
          fill="#E8E0D0"
          stroke="#1A120C"
          strokeWidth="2"
        />
        <rect
          x="18"
          y="36"
          width="40"
          height="18"
          rx="4"
          fill="#C9A227"
          stroke="#1A120C"
          strokeWidth="2"
        />
        <rect
          x="302"
          y="36"
          width="40"
          height="18"
          rx="4"
          fill="#C9A227"
          stroke="#1A120C"
          strokeWidth="2"
        />
      </g>
    );
  }

  if (type === "lodge-night") {
    return (
      <g>
        <rect x="18" y="18" width="324" height="404" rx="36" fill="#0F1C2E" />
        <circle cx="280" cy="70" r="18" fill="#F7F4EE" opacity="0.85" />
        <circle cx="288" cy="64" r="18" fill="#0F1C2E" />
        <path
          d="M60 360 L180 220 L300 360 Z"
          fill="none"
          stroke="#C9A227"
          strokeWidth="2"
          opacity="0.35"
        />
      </g>
    );
  }

  if (type === "coffee") {
    return (
      <g>
        <rect
          x="18"
          y="18"
          width="324"
          height="404"
          rx="36"
          fill="#F4EFE4"
          stroke="#C9A227"
          strokeWidth="2"
        />
        <ellipse cx="180" cy="380" rx="90" ry="12" fill="#C9A227" opacity="0.12" />
      </g>
    );
  }

  if (type === "journey") {
    return (
      <g>
        <rect
          x="18"
          y="18"
          width="324"
          height="404"
          rx="36"
          fill="#F7F4EE"
          stroke="#0F1C2E"
          strokeWidth="2"
        />
        <path
          d="M50 380 L120 280 L180 340 L240 240 L310 360"
          fill="none"
          stroke="#C9A227"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </g>
    );
  }

  return null;
}

function StickerProp({ id }: { id: StickerPropId }) {
  if (id === "coffee") {
    return (
      <g transform="translate(268 250)">
        <rect
          x="0"
          y="10"
          width="36"
          height="40"
          rx="6"
          fill="#F7F4EE"
          stroke="#1A120C"
          strokeWidth="2.5"
        />
        <path
          d="M36 20 H48 Q56 30 48 40 H36"
          fill="none"
          stroke="#1A120C"
          strokeWidth="2.5"
        />
        <ellipse
          cx="18"
          cy="12"
          rx="14"
          ry="5"
          fill="#4A2F1F"
          stroke="#1A120C"
          strokeWidth="2"
        />
      </g>
    );
  }

  if (id === "sun") {
    return (
      <g transform="translate(54 48)" opacity="0.9">
        <circle cx="0" cy="0" r="14" fill="#C9A227" stroke="#1A120C" strokeWidth="2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={Math.cos(rad) * 18}
              y1={Math.sin(rad) * 18}
              x2={Math.cos(rad) * 26}
              y2={Math.sin(rad) * 26}
              stroke="#C9A227"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
      </g>
    );
  }

  if (id === "moon") {
    return (
      <g transform="translate(300 56)">
        <circle cx="0" cy="0" r="16" fill="#F7F4EE" stroke="#C9A227" strokeWidth="2" />
        <circle cx="8" cy="-4" r="14" fill="#0F1C2E" />
      </g>
    );
  }

  if (id === "spark") {
    return (
      <g fill="#C9A227" stroke="#1A120C" strokeWidth="1.5">
        <path d="M48 90 L52 102 L64 106 L52 110 L48 122 L44 110 L32 106 L44 102 Z" />
        <path d="M300 120 L303 128 L312 131 L303 134 L300 142 L297 134 L288 131 L297 128 Z" />
      </g>
    );
  }

  if (id === "gavel-float") {
    return (
      <g transform="translate(40 210) rotate(-20)">
        <rect
          x="0"
          y="8"
          width="8"
          height="46"
          rx="3"
          fill="#8B5A2B"
          stroke="#1A120C"
          strokeWidth="2.5"
        />
        <rect
          x="-12"
          y="0"
          width="32"
          height="14"
          rx="3"
          fill="#A86B3C"
          stroke="#1A120C"
          strokeWidth="2.5"
        />
      </g>
    );
  }

  if (id === "ashlar") {
    return (
      <g transform="translate(40 320)">
        <rect
          x="0"
          y="0"
          width="36"
          height="36"
          fill="#E8E0D0"
          stroke="#1A120C"
          strokeWidth="2.5"
        />
      </g>
    );
  }

  if (id === "columns-pair") {
    return (
      <g opacity="0.55">
        <rect
          x="28"
          y="80"
          width="16"
          height="200"
          fill="#E8E0D0"
          stroke="#1A120C"
          strokeWidth="2"
        />
        <rect
          x="316"
          y="80"
          width="16"
          height="200"
          fill="#E8E0D0"
          stroke="#1A120C"
          strokeWidth="2"
        />
      </g>
    );
  }

  if (id === "apron-fold") {
    return (
      <g transform="translate(250 300)">
        <path
          d="M0 0 L40 0 L34 48 L6 48 Z"
          fill="#F7F7F5"
          stroke="#1A120C"
          strokeWidth="2.5"
        />
      </g>
    );
  }

  return null;
}
