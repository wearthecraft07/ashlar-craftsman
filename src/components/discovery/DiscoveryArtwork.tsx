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

/** Working-tools engraving plate — beautiful without interaction. */
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
      aria-label="Working tools of the Craft plate. Use the discovery buttons to look closer."
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

      {/* Soft proportion circle */}
      <circle
        cx="200"
        cy="200"
        r="96"
        fill="none"
        stroke="#C8A24A"
        strokeWidth="0.5"
        opacity="0.12"
      />

      {/* 24-inch gauge — top left */}
      <g
        id="art-gauge"
        opacity={o("gauge")}
        style={{ filter: glow("gauge") }}
      >
        <rect
          x="56"
          y="58"
          width="148"
          height="16"
          rx="2"
          fill="none"
          stroke={s("gauge")}
          strokeWidth="1.6"
        />
        {/* Inch marks — three portions suggested */}
        <line
          x1="105"
          y1="58"
          x2="105"
          y2="74"
          stroke={s("gauge")}
          strokeWidth="1.2"
        />
        <line
          x1="154"
          y1="58"
          x2="154"
          y2="74"
          stroke={s("gauge")}
          strokeWidth="1.2"
        />
        {[64, 72, 80, 88, 96, 113, 121, 129, 137, 145, 162, 170, 178, 186, 194].map(
          (x) => (
            <line
              key={x}
              x1={x}
              y1="58"
              x2={x}
              y2={x % 8 === 0 ? 68 : 64}
              stroke={s("gauge")}
              strokeWidth="0.7"
              opacity="0.7"
            />
          ),
        )}
      </g>

      {/* Common gavel — top right */}
      <g
        id="art-gavel"
        opacity={o("gavel")}
        style={{ filter: glow("gavel") }}
        transform="translate(300 88) rotate(-28)"
      >
        <rect
          x="-5"
          y="10"
          width="10"
          height="52"
          rx="2"
          fill="none"
          stroke={s("gavel")}
          strokeWidth="1.5"
        />
        <rect
          x="-20"
          y="-2"
          width="40"
          height="18"
          rx="2"
          fill="none"
          stroke={s("gavel")}
          strokeWidth="1.5"
        />
      </g>

      {/* Plumb — left */}
      <g id="art-plumb" opacity={o("plumb")} style={{ filter: glow("plumb") }}>
        <line
          x1="72"
          y1="130"
          x2="72"
          y2="250"
          stroke={s("plumb")}
          strokeWidth="1.4"
        />
        <circle
          cx="72"
          cy="124"
          r="5"
          fill="none"
          stroke={s("plumb")}
          strokeWidth="1.4"
        />
        <path
          d="M72 250 L62 272 L82 272 Z"
          fill="none"
          stroke={s("plumb")}
          strokeWidth="1.5"
        />
      </g>

      {/* Square — center */}
      <g
        id="art-square"
        opacity={o("square")}
        style={{ filter: glow("square") }}
      >
        <path
          d="M150 250 V150 H260"
          fill="none"
          stroke={s("square")}
          strokeWidth="2.4"
          strokeLinecap="square"
        />
        <path
          d="M150 250 H178 M150 178 V150"
          fill="none"
          stroke={s("square")}
          strokeWidth="1.1"
          opacity="0.55"
        />
      </g>

      {/* Level — lower right */}
      <g id="art-level" opacity={o("level")} style={{ filter: glow("level") }}>
        <rect
          x="210"
          y="286"
          width="120"
          height="16"
          rx="2"
          fill="none"
          stroke={s("level")}
          strokeWidth="1.5"
        />
        <circle
          cx="270"
          cy="294"
          r="4.5"
          fill="none"
          stroke={s("level")}
          strokeWidth="1.3"
        />
        <line
          x1="228"
          y1="294"
          x2="252"
          y2="294"
          stroke={s("level")}
          strokeWidth="1"
        />
        <line
          x1="288"
          y1="294"
          x2="312"
          y2="294"
          stroke={s("level")}
          strokeWidth="1"
        />
      </g>

      {/* Trowel — lower left / bottom center */}
      <g
        id="art-trowel"
        opacity={o("trowel")}
        style={{ filter: glow("trowel") }}
        transform="translate(150 310) rotate(18)"
      >
        <path
          d="M0 0 L42 0 L21 48 Z"
          fill="none"
          stroke={s("trowel")}
          strokeWidth="1.6"
        />
        <line
          x1="21"
          y1="0"
          x2="21"
          y2="-28"
          stroke={s("trowel")}
          strokeWidth="1.5"
        />
        <rect
          x="14"
          y="-36"
          width="14"
          height="10"
          rx="1"
          fill="none"
          stroke={s("trowel")}
          strokeWidth="1.3"
        />
      </g>

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
