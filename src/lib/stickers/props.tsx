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
      // Far top-right card ornament. Must stay outside the head/face bbox
      // (approx. x 100–260, y 30–140 in the 360 sticker viewBox).
      return (
        <g transform="translate(304 38)" opacity="0.88">
          <path d="M0 -12 L-14 14 L14 14 Z" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M-10 5 H10" stroke={GOLD} strokeWidth="2" />
          <circle cx="0" cy="2" r="4.5" fill="none" stroke={GOLD} strokeWidth="1.75" />
          <text x="0" y="5" textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="700" fontFamily="Georgia, serif">
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
    case "backpack":
      return (
        <g transform="translate(248 200)">
          <rect x="0" y="10" width="36" height="48" rx="8" fill="#3D2A1A" stroke={LINE} strokeWidth="2.5" />
          <rect x="6" y="18" width="24" height="18" rx="3" fill="#5A3C24" stroke={LINE} strokeWidth="1.5" />
          <path d="M8 10 V0 H28 V10" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="48" r="3" fill={GOLD} />
        </g>
      );
    case "blueprint":
      return (
        <g transform="translate(250 255)">
          <rect x="0" y="8" width="14" height="42" rx="2" fill="#DCE8F5" stroke={LINE} strokeWidth="2" transform="rotate(-18 7 29)" />
          <rect x="4" y="4" width="14" height="42" rx="2" fill="#EEF4FA" stroke={LINE} strokeWidth="2" transform="rotate(8 11 25)" />
          <path d="M8 16 H16 M8 24 H14" stroke="#1E3A5F" strokeWidth="1.2" opacity="0.55" transform="rotate(8 11 25)" />
        </g>
      );
    case "magnifier":
      return (
        <g transform="translate(255 230)">
          <circle cx="14" cy="14" r="14" fill="none" stroke={LINE} strokeWidth="3.5" />
          <circle cx="14" cy="14" r="10" fill="#C8D9EA" opacity="0.35" />
          <path d="M24 24 L40 42" stroke="#6B4423" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "lantern":
      return (
        <g transform="translate(258 240)">
          <defs>
            <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4D078" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F4D078" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="28" r="28" fill="url(#lantern-glow)" />
          <rect x="6" y="14" width="20" height="28" rx="4" fill="#1E3A5F" stroke={LINE} strokeWidth="2" />
          <rect x="9" y="18" width="14" height="16" rx="2" fill="#F4D078" opacity="0.9" />
          <path d="M16 4 V14" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 4 H24" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case "handshakePartner":
      return (
        <g transform="translate(248 210)" opacity="0.55">
          <ellipse cx="22" cy="18" rx="16" ry="18" fill="#2A3548" />
          <path d="M6 40 Q22 28 38 40 L38 78 L6 78 Z" fill="#2A3548" />
          <path d="M-8 58 Q10 50 28 62" fill="none" stroke="#C9A227" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "tinySquare":
      return (
        <g transform="translate(48 250)">
          <path d="M0 8 H36 V44" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="square" />
          <path d="M0 8 V0" stroke="#6B4423" strokeWidth="3" />
        </g>
      );
    case "tinyCompass":
      return (
        <g transform="translate(280 248)">
          <path d="M16 4 L4 44" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
          <path d="M16 4 L28 44" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="4" r="3.5" fill={NAVY} stroke={LINE} strokeWidth="1.5" />
        </g>
      );
    default:
      return null;
  }
}
