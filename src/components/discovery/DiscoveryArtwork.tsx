"use client";

import { cn } from "@/lib/utils";
import type { DiscoveryId } from "@/data/discovery";

type Props = {
  discovered: Set<DiscoveryId>;
  activeId: DiscoveryId | null;
  className?: string;
};

function strokeFor(
  id: DiscoveryId,
  discovered: Set<DiscoveryId>,
  activeId: DiscoveryId | null,
) {
  if (activeId === id || discovered.has(id)) return "#C8A24A";
  return "#C8A24A";
}

function opacityFor(
  id: DiscoveryId,
  discovered: Set<DiscoveryId>,
  activeId: DiscoveryId | null,
) {
  if (activeId === id) return 1;
  if (discovered.has(id)) return 0.95;
  return 0.45;
}

/** Architectural engraving plate — beautiful without interaction. */
export function DiscoveryArtwork({ discovered, activeId, className }: Props) {
  const o = (id: DiscoveryId) => opacityFor(id, discovered, activeId);
  const s = (id: DiscoveryId) => strokeFor(id, discovered, activeId);
  const glow = (id: DiscoveryId) =>
    activeId === id || discovered.has(id)
      ? "drop-shadow(0 0 6px rgba(200,162,74,0.35))"
      : undefined;

  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Architectural Craft plate with hidden public Masonic references. Use the discovery buttons to look closer."
    >
      <defs>
        <linearGradient id="plate-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E2A44" />
          <stop offset="55%" stopColor="#162033" />
          <stop offset="100%" stopColor="#121926" />
        </linearGradient>
        <pattern
          id="plate-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#C8A24A"
            strokeWidth="0.4"
            opacity="0.12"
          />
        </pattern>
      </defs>

      <rect width="400" height="400" fill="url(#plate-bg)" />
      <rect width="400" height="400" fill="url(#plate-grid)" />

      {/* Outer plate frame */}
      <rect
        x="18"
        y="18"
        width="364"
        height="364"
        fill="none"
        stroke="#C8A24A"
        strokeWidth="1.25"
        opacity="0.35"
      />
      <rect
        x="28"
        y="28"
        width="344"
        height="344"
        fill="none"
        stroke="#F7F2E7"
        strokeWidth="0.6"
        opacity="0.12"
      />

      {/* Celestial canopy — stars / arc */}
      <g
        id="art-celestial"
        opacity={o("celestial")}
        style={{ filter: glow("celestial") }}
      >
        <path
          d="M80 70 Q200 18 320 70"
          fill="none"
          stroke={s("celestial")}
          strokeWidth="1.4"
        />
        <circle cx="140" cy="52" r="1.6" fill="#F7F2E7" opacity="0.7" />
        <circle cx="200" cy="38" r="2" fill="#C8A24A" opacity="0.85" />
        <circle cx="260" cy="52" r="1.4" fill="#F7F2E7" opacity="0.65" />
        <circle cx="180" cy="58" r="1" fill="#F7F2E7" opacity="0.5" />
        <circle cx="230" cy="48" r="1.1" fill="#F7F2E7" opacity="0.55" />
      </g>

      {/* Twin pillars */}
      <g
        id="art-pillars"
        opacity={o("pillars")}
        style={{ filter: glow("pillars") }}
      >
        <rect
          x="48"
          y="150"
          width="22"
          height="160"
          fill="none"
          stroke={s("pillars")}
          strokeWidth="1.6"
        />
        <rect
          x="42"
          y="140"
          width="34"
          height="12"
          fill="none"
          stroke={s("pillars")}
          strokeWidth="1.4"
        />
        <rect
          x="44"
          y="308"
          width="30"
          height="10"
          fill="none"
          stroke={s("pillars")}
          strokeWidth="1.4"
        />
        <rect
          x="86"
          y="150"
          width="22"
          height="160"
          fill="none"
          stroke={s("pillars")}
          strokeWidth="1.6"
        />
        <rect
          x="80"
          y="140"
          width="34"
          height="12"
          fill="none"
          stroke={s("pillars")}
          strokeWidth="1.4"
        />
        <rect
          x="82"
          y="308"
          width="30"
          height="10"
          fill="none"
          stroke={s("pillars")}
          strokeWidth="1.4"
        />
      </g>

      {/* Plumb line */}
      <g
        id="art-plumb"
        opacity={o("plumb")}
        style={{ filter: glow("plumb") }}
      >
        <line
          x1="88"
          y1="78"
          x2="88"
          y2="150"
          stroke={s("plumb")}
          strokeWidth="1.2"
        />
        <path
          d="M88 150 L80 168 L96 168 Z"
          fill="none"
          stroke={s("plumb")}
          strokeWidth="1.4"
        />
      </g>

      {/* Compasses */}
      <g
        id="art-compasses"
        opacity={o("compasses")}
        style={{ filter: glow("compasses") }}
      >
        <circle
          cx="208"
          cy="112"
          r="5"
          fill="none"
          stroke={s("compasses")}
          strokeWidth="1.5"
        />
        <line
          x1="208"
          y1="112"
          x2="168"
          y2="178"
          stroke={s("compasses")}
          strokeWidth="1.6"
        />
        <line
          x1="208"
          y1="112"
          x2="252"
          y2="178"
          stroke={s("compasses")}
          strokeWidth="1.6"
        />
        <path
          d="M178 158 H238"
          stroke={s("compasses")}
          strokeWidth="1"
          opacity="0.7"
        />
      </g>

      {/* Square — try square formed by architecture */}
      <g
        id="art-square"
        opacity={o("square")}
        style={{ filter: glow("square") }}
      >
        <path
          d="M130 210 V160 H210"
          fill="none"
          stroke={s("square")}
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path
          d="M130 210 H155 M130 185 V160"
          fill="none"
          stroke={s("square")}
          strokeWidth="1"
          opacity="0.55"
        />
      </g>

      {/* Keystone in arch */}
      <g
        id="art-keystone"
        opacity={o("keystone")}
        style={{ filter: glow("keystone") }}
      >
        <path
          d="M170 220 Q200 188 230 220"
          fill="none"
          stroke="#F7F2E7"
          strokeWidth="1.2"
          opacity="0.35"
        />
        <path
          d="M192 198 L200 186 L208 198 L204 214 L196 214 Z"
          fill="none"
          stroke={s("keystone")}
          strokeWidth="1.6"
        />
      </g>

      {/* Gavel */}
      <g
        id="art-gavel"
        opacity={o("gavel")}
        style={{ filter: glow("gavel") }}
        transform="translate(300 120) rotate(-22)"
      >
        <rect
          x="-6"
          y="8"
          width="12"
          height="48"
          rx="2"
          fill="none"
          stroke={s("gavel")}
          strokeWidth="1.5"
        />
        <rect
          x="-18"
          y="0"
          width="36"
          height="16"
          rx="2"
          fill="none"
          stroke={s("gavel")}
          strokeWidth="1.5"
        />
      </g>

      {/* Level */}
      <g
        id="art-level"
        opacity={o("level")}
        style={{ filter: glow("level") }}
      >
        <rect
          x="140"
          y="292"
          width="100"
          height="14"
          rx="2"
          fill="none"
          stroke={s("level")}
          strokeWidth="1.5"
        />
        <circle
          cx="190"
          cy="299"
          r="4"
          fill="none"
          stroke={s("level")}
          strokeWidth="1.3"
        />
        <line
          x1="158"
          y1="299"
          x2="176"
          y2="299"
          stroke={s("level")}
          strokeWidth="1"
        />
        <line
          x1="204"
          y1="299"
          x2="222"
          y2="299"
          stroke={s("level")}
          strokeWidth="1"
        />
      </g>

      {/* Rough ashlar */}
      <g
        id="art-ashlar"
        opacity={o("ashlar")}
        style={{ filter: glow("ashlar") }}
      >
        <path
          d="M268 268 L318 260 L328 310 L274 318 Z"
          fill="#E8E0D0"
          fillOpacity="0.12"
          stroke={s("ashlar")}
          strokeWidth="1.6"
        />
        <path
          d="M278 278 L308 274 M282 290 L312 286 M286 302 L316 298"
          stroke={s("ashlar")}
          strokeWidth="0.8"
          opacity="0.45"
        />
      </g>

      {/* Quiet geometric proportion marks — always soft */}
      <circle
        cx="200"
        cy="200"
        r="92"
        fill="none"
        stroke="#C8A24A"
        strokeWidth="0.5"
        opacity="0.12"
      />
      <text
        x="200"
        y="378"
        textAnchor="middle"
        fill="#C8A24A"
        fontSize="7"
        letterSpacing="3"
        opacity="0.4"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        LOOK CLOSER
      </text>
    </svg>
  );
}
