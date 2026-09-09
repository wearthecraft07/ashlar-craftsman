import type { StickerPropId } from "@/types/stickers";

const LINE = "#1A120C";
const GOLD = "#C9A227";
const IVORY = "#F7F4EE";
const NAVY = "#0F1C2E";

/** Cohesive ASHLAR CRAFTSMAN prop illustrations (original SVG). */
export function StickerProp({ id }: { id: StickerPropId }) {
  switch (id) {
    case "coffeeCup":
      return (
        <g transform="translate(268 248)">
          <rect x="0" y="12" width="38" height="42" rx="7" fill={IVORY} stroke={LINE} strokeWidth="2.5" />
          <path d="M38 22 H50 Q58 33 50 44 H38" fill="none" stroke={LINE} strokeWidth="2.5" />
          <ellipse cx="19" cy="14" rx="15" ry="5" fill="#4A2F1F" stroke={LINE} strokeWidth="2" />
          <path d="M10 2 Q14 -8 18 2" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.75" />
          <path d="M20 2 Q24 -8 28 2" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.75" />
        </g>
      );
    case "sun":
      return (
        <g transform="translate(56 52)" opacity="0.92">
          <circle cx="0" cy="0" r="15" fill={GOLD} stroke={LINE} strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={Math.cos(rad) * 20}
                y1={Math.sin(rad) * 20}
                x2={Math.cos(rad) * 28}
                y2={Math.sin(rad) * 28}
                stroke={GOLD}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      );
    case "moon":
      return (
        <g transform="translate(300 58)">
          <circle cx="0" cy="0" r="17" fill={IVORY} stroke={GOLD} strokeWidth="2" />
          <circle cx="8" cy="-4" r="15" fill={NAVY} />
        </g>
      );
    case "spark":
      return (
        <g fill={GOLD} stroke={LINE} strokeWidth="1.4">
          <path d="M46 88 L50 100 L62 104 L50 108 L46 120 L42 108 L30 104 L42 100 Z" />
          <path d="M302 118 L305 126 L314 129 L305 132 L302 140 L299 132 L290 129 L299 126 Z" />
          <path d="M68 298 L71 306 L80 309 L71 312 L68 320 L65 312 L56 309 L65 306 Z" />
        </g>
      );
    case "gavel":
      return (
        <g transform="translate(42 208) rotate(-18)">
          <rect x="0" y="10" width="9" height="50" rx="3" fill="#8B5A2B" stroke={LINE} strokeWidth="2.5" />
          <rect x="-14" y="0" width="36" height="16" rx="4" fill="#A86B3C" stroke={LINE} strokeWidth="2.5" />
        </g>
      );
    case "squareAndCompasses":
      return (
        <g transform="translate(180 52)">
          <path d="M0 -18 L-22 22 L22 22 Z" fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M-16 8 H16" stroke={GOLD} strokeWidth="3" />
          <circle cx="0" cy="4" r="7" fill="none" stroke={GOLD} strokeWidth="2.5" />
          <text x="0" y="8" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="700" fontFamily="Georgia, serif">
            G
          </text>
        </g>
      );
    case "masonicApron":
      return (
        <g transform="translate(248 300)">
          <path d="M0 0 L48 0 L42 52 L6 52 Z" fill={IVORY} stroke={LINE} strokeWidth="2.5" />
          <path d="M10 18 L24 8 L38 18 L24 28 Z" fill="none" stroke={GOLD} strokeWidth="2" />
        </g>
      );
    case "workingTools":
      return (
        <g transform="translate(40 300)">
          <rect x="0" y="8" width="8" height="36" rx="2" fill="#8B5A2B" stroke={LINE} strokeWidth="2" />
          <path d="M22 4 L22 40" stroke="#8B5A2B" strokeWidth="5" strokeLinecap="round" />
          <path d="M12 40 Q22 54 32 40 Z" fill={GOLD} stroke={LINE} strokeWidth="2" />
        </g>
      );
    case "trowel":
      return (
        <g transform="translate(48 290)">
          <path d="M8 0 L8 34" stroke="#8B5A2B" strokeWidth="5" strokeLinecap="round" />
          <path d="M-8 34 Q8 52 24 34 Z" fill={GOLD} stroke={LINE} strokeWidth="2.5" />
        </g>
      );
    case "level":
      return (
        <g transform="translate(44 310)">
          <rect x="0" y="0" width="52" height="12" rx="3" fill="#2A2A2A" stroke={LINE} strokeWidth="2" />
          <circle cx="26" cy="6" r="3.5" fill={GOLD} />
        </g>
      );
    case "plumb":
      return (
        <g transform="translate(52 280)">
          <path d="M12 0 V40" stroke={LINE} strokeWidth="3" />
          <path d="M12 40 L4 52 H20 Z" fill={GOLD} stroke={LINE} strokeWidth="2" />
        </g>
      );
    case "lodgeBuilding":
      return (
        <g transform="translate(28 250)" opacity="0.9">
          <rect x="8" y="40" width="70" height="70" fill="#E8E0D0" stroke={LINE} strokeWidth="2.5" />
          <path d="M0 40 L43 8 L86 40 Z" fill={NAVY} stroke={LINE} strokeWidth="2.5" />
          <rect x="34" y="70" width="18" height="40" fill={NAVY} stroke={LINE} strokeWidth="2" />
          <circle cx="43" cy="28" r="6" fill={GOLD} />
        </g>
      );
    case "columns":
      return (
        <g opacity="0.7">
          <rect x="26" y="70" width="18" height="220" fill="#E8E0D0" stroke={LINE} strokeWidth="2" />
          <rect x="20" y="62" width="30" height="14" rx="3" fill={GOLD} stroke={LINE} strokeWidth="2" />
          <rect x="316" y="70" width="18" height="220" fill="#E8E0D0" stroke={LINE} strokeWidth="2" />
          <rect x="310" y="62" width="30" height="14" rx="3" fill={GOLD} stroke={LINE} strokeWidth="2" />
        </g>
      );
    case "tracingBoard":
      return (
        <g transform="translate(40 300)">
          <rect x="0" y="0" width="48" height="36" rx="4" fill={IVORY} stroke={LINE} strokeWidth="2.5" />
          <path d="M8 28 L24 8 L40 28" fill="none" stroke={GOLD} strokeWidth="2" />
        </g>
      );
    case "book":
      return (
        <g transform="translate(250 268)">
          <path d="M0 8 L28 0 L56 8 L56 48 L28 40 L0 48 Z" fill={NAVY} stroke={LINE} strokeWidth="2.5" />
          <path d="M28 0 V40" stroke={GOLD} strokeWidth="2" />
        </g>
      );
    case "degreeCertificate":
      return (
        <g transform="translate(42 290)">
          <rect x="0" y="0" width="50" height="36" rx="3" fill={IVORY} stroke={LINE} strokeWidth="2.5" />
          <path d="M8 12 H42 M8 20 H34" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="28" r="5" fill="none" stroke={GOLD} strokeWidth="1.5" />
        </g>
      );
    case "travelBag":
      return (
        <g transform="translate(250 300)">
          <rect x="4" y="8" width="44" height="34" rx="4" fill="#6B4423" stroke={LINE} strokeWidth="2.5" />
          <path d="M4 18 H48" stroke={GOLD} strokeWidth="2" />
          <circle cx="26" cy="8" r="8" fill="none" stroke={LINE} strokeWidth="2.5" />
        </g>
      );
    default:
      return null;
  }
}
