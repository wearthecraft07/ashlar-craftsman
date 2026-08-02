"use client";

import { useId } from "react";
import type { AvatarConfig } from "@/types";
import { getTone } from "@/avatar/options";

type Props = {
  config: AvatarConfig;
  className?: string;
  decorative?: boolean;
};

const LINE = "#1A120C";
const GOLD = "#C9A227";
const SW = 4; // bold 3–5px outlines

function poseTransform(pose: string) {
  switch (pose) {
    case "wave":
      return "translate(3,0) rotate(-2 140 200)";
    case "power":
      return "translate(0,-2) scale(1.015)";
    case "lean":
      return "translate(-5,2) rotate(2.5 140 200)";
    default:
      return undefined;
  }
}

export function AvatarCanvas({ config, className, decorative }: Props) {
  const uid = useId().replace(/:/g, "");
  const skin = getTone("skin", config.skin);
  const skinShade = getTone("skin", config.skin, "shade");
  const hair = getTone("hairColor", config.hairColor);
  const hairShade = getTone("hairColor", config.hairColor, "shade");
  const cloth = getTone("clothingColor", config.clothingColor);
  const clothShade = getTone("clothingColor", config.clothingColor, "shade");

  const bodyScale =
    config.body === "slim" ? 0.9 : config.body === "broad" ? 1.1 : 1;

  const wink = config.expression === "wink";
  const laugh =
    config.expression === "laugh" || config.mouth === "grin";
  const smirk =
    config.expression === "confident" || config.mouth === "smirk";
  const smile =
    !laugh &&
    !smirk &&
    (config.expression === "smile" ||
      config.expression === "friendly" ||
      config.mouth === "smile");

  const gloveFill =
    config.gloves === "cream" ? "#F3E6C8" : config.gloves === "white" ? "#F7F7F5" : null;

  const collarColor =
    config.collar === "blue"
      ? "#2F5DA8"
      : config.collar === "red"
        ? "#9B2C2C"
        : config.collar === "gold"
          ? GOLD
          : null;

  return (
    <svg
      viewBox="0 0 280 360"
      className={className}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Custom Ashlar Craftsman avatar"}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#2A2A2A" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`skin-${uid}`} x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={skin} />
          <stop offset="100%" stopColor={skinShade} />
        </linearGradient>
        <linearGradient id={`hair-${uid}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={hair} />
          <stop offset="100%" stopColor={hairShade} />
        </linearGradient>
        <linearGradient id={`cloth-${uid}`} x1="0.25" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={cloth} />
          <stop offset="100%" stopColor={clothShade} />
        </linearGradient>
        <linearGradient id={`cel-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="280" height="360" rx="32" fill={`url(#bg-${uid})`} />

      <g transform={poseTransform(config.pose)}>
        {/* —— BODY (smaller, ~2/3 of figure under oversized head) —— */}
        <g transform={`translate(140 250) scale(${bodyScale} 1) translate(-140 -250)`}>
          {/* Legs */}
          <path
            d="M118 268 L112 318 L134 318 L138 268 Z"
            fill={`url(#cloth-${uid})`}
            stroke={LINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <path
            d="M162 268 L166 318 L188 318 L182 268 Z"
            fill={`url(#cloth-${uid})`}
            stroke={LINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <path d="M118 268 L138 268 L136 286 L120 286 Z" fill={`url(#cel-${uid})`} />

          {/* Shoes */}
          {config.shoes === "dress" ? (
            <>
              <ellipse cx="123" cy="324" rx="18" ry="8" fill="#151515" stroke={LINE} strokeWidth={SW} />
              <ellipse cx="177" cy="324" rx="18" ry="8" fill="#151515" stroke={LINE} strokeWidth={SW} />
            </>
          ) : config.shoes === "boots" ? (
            <>
              <path d="M104 304 H142 V328 Q123 334 104 328 Z" fill="#1A1A1A" stroke={LINE} strokeWidth={SW} strokeLinejoin="round" />
              <path d="M158 304 H196 V328 Q177 334 158 328 Z" fill="#1A1A1A" stroke={LINE} strokeWidth={SW} strokeLinejoin="round" />
            </>
          ) : (
            <>
              <ellipse cx="123" cy="322" rx="19" ry="9" fill="#1A1A1A" stroke={LINE} strokeWidth={SW} />
              <ellipse cx="177" cy="322" rx="19" ry="9" fill="#1A1A1A" stroke={LINE} strokeWidth={SW} />
              <path d="M108 320 H138" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M162 320 H192" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Torso / clothing */}
          {config.clothing === "hoodie" && (
            <path
              d="M92 176 C92 156 112 146 140 146 C168 146 188 156 188 176 L196 268 C196 280 184 288 172 288 L108 288 C96 288 84 280 84 268 Z"
              fill={`url(#cloth-${uid})`}
              stroke={LINE}
              strokeWidth={SW}
              strokeLinejoin="round"
            />
          )}
          {config.clothing === "jacket" && (
            <>
              <path
                d="M90 178 L106 156 L140 166 L174 156 L190 178 L200 272 C200 284 188 292 174 292 L106 292 C92 292 80 284 80 272 Z"
                fill={`url(#cloth-${uid})`}
                stroke={LINE}
                strokeWidth={SW}
                strokeLinejoin="round"
              />
              <path d="M140 166 V292" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {(config.clothing === "tee" ||
            config.clothing === "polo" ||
            config.clothing === "lodge") && (
            <path
              d="M96 178 L114 158 L140 168 L166 158 L184 178 L194 270 C194 282 182 290 170 290 L110 290 C98 290 86 282 86 270 Z"
              fill={`url(#cloth-${uid})`}
              stroke={LINE}
              strokeWidth={SW}
              strokeLinejoin="round"
            />
          )}
          {config.clothing === "polo" && (
            <path
              d="M128 164 L140 182 L152 164"
              fill="none"
              stroke={GOLD}
              strokeWidth="3"
              strokeLinejoin="round"
            />
          )}
          {config.clothing === "lodge" && (
            <>
              <path d="M120 168 H160" stroke="#F7F7F5" strokeWidth="3" strokeLinecap="round" />
              <circle cx="140" cy="188" r="3.5" fill={GOLD} stroke={LINE} strokeWidth="2" />
            </>
          )}

          {/* Soft cel highlight on torso */}
          <path
            d="M108 182 C118 176 130 174 140 174 C128 190 118 220 114 250 C108 240 104 210 108 182 Z"
            fill={`url(#cel-${uid})`}
            opacity="0.55"
          />

          {/* Shirt mark */}
          {(config.clothing === "tee" ||
            config.clothing === "polo" ||
            config.clothing === "hoodie" ||
            config.clothing === "lodge") && (
            <image
              href="/shirt-mark.png"
              x="116"
              y="196"
              width="48"
              height="48"
              preserveAspectRatio="xMidYMid meet"
            />
          )}

          {/* Apron */}
          {config.apron !== "none" && (
            <g>
              <path
                d="M108 232 H192 L186 292 C186 300 178 306 170 306 H130 C122 306 114 300 114 292 Z"
                fill="#F7F4EE"
                stroke={LINE}
                strokeWidth={SW}
                strokeLinejoin="round"
              />
              <path d="M108 232 H192" stroke={GOLD} strokeWidth="3.5" />
              {config.apron === "ea" && (
                <text x="140" y="272" textAnchor="middle" fontSize="16" fontWeight="700" fill={GOLD} stroke={LINE} strokeWidth="0.6">
                  EA
                </text>
              )}
              {config.apron === "fc" && (
                <text x="140" y="272" textAnchor="middle" fontSize="16" fontWeight="700" fill={GOLD} stroke={LINE} strokeWidth="0.6">
                  FC
                </text>
              )}
              {config.apron === "mm" && (
                <image
                  href="/mm-apron-mark.png"
                  x="116"
                  y="246"
                  width="48"
                  height="48"
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </g>
          )}

          {/* Arms */}
          <g>
            <path
              d={
                config.pose === "wave"
                  ? "M94 186 C68 168 54 128 74 108"
                  : config.pose === "power"
                    ? "M94 186 C74 210 66 242 74 262"
                    : "M94 186 C76 214 72 246 84 266"
              }
              fill="none"
              stroke={`url(#cloth-${uid})`}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d={
                config.pose === "wave"
                  ? "M94 186 C68 168 54 128 74 108"
                  : config.pose === "power"
                    ? "M94 186 C74 210 66 242 74 262"
                    : "M94 186 C76 214 72 246 84 266"
              }
              fill="none"
              stroke={LINE}
              strokeWidth={SW}
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d={
                config.pose === "power"
                  ? "M186 186 C206 210 214 242 206 262"
                  : "M186 186 C204 214 208 246 196 266"
              }
              fill="none"
              stroke={`url(#cloth-${uid})`}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d={
                config.pose === "power"
                  ? "M186 186 C206 210 214 242 206 262"
                  : "M186 186 C204 214 208 246 196 266"
              }
              fill="none"
              stroke={LINE}
              strokeWidth={SW}
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Hands */}
            <Hand
              cx={config.pose === "wave" ? 74 : config.pose === "power" ? 74 : 84}
              cy={config.pose === "wave" ? 108 : config.pose === "power" ? 262 : 266}
              skin={`url(#skin-${uid})`}
              glove={gloveFill}
              ring={config.ring}
            />
            <Hand
              cx={config.pose === "power" ? 206 : 196}
              cy={config.pose === "power" ? 262 : 266}
              skin={`url(#skin-${uid})`}
              glove={gloveFill}
              ring="none"
            />
          </g>

          {/* Working tool (right side prop) */}
          {config.tool !== "none" && (
            <g transform="translate(210 220)">
              {config.tool === "gavel" && (
                <>
                  <rect x="-4" y="0" width="8" height="46" rx="3" fill="#8B5A2B" stroke={LINE} strokeWidth="3" />
                  <rect x="-16" y="-8" width="32" height="16" rx="4" fill="#A86B3C" stroke={LINE} strokeWidth="3" />
                </>
              )}
              {config.tool === "trowel" && (
                <>
                  <path d="M0 0 L0 36" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
                  <path d="M-14 36 Q0 52 14 36 Z" fill={GOLD} stroke={LINE} strokeWidth="3" />
                </>
              )}
              {config.tool === "level" && (
                <g>
                  <rect x="-22" y="18" width="44" height="10" rx="3" fill="#2A2A2A" stroke={LINE} strokeWidth="3" />
                  <circle cx="0" cy="23" r="3" fill={GOLD} />
                </g>
              )}
              {config.tool === "plumb" && (
                <>
                  <path d="M0 0 V40" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
                  <path d="M-10 40 L0 54 L10 40 Z" fill={GOLD} stroke={LINE} strokeWidth="3" />
                </>
              )}
              {config.tool === "square-compass" && (
                <g transform="scale(0.7)">
                  <path d="M0 40 L20 0 L40 40" fill="none" stroke={GOLD} strokeWidth="5" strokeLinejoin="round" />
                  <path d="M8 42 L30 18" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
                  <path d="M32 42 L10 18" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
                </g>
              )}
            </g>
          )}
        </g>

        {/* —— NECK —— */}
        <rect
          x="126"
          y="158"
          width="28"
          height="28"
          rx="10"
          fill={`url(#skin-${uid})`}
          stroke={LINE}
          strokeWidth={SW}
        />

        {/* Collar jewel / chain */}
        {collarColor && (
          <g>
            <path
              d="M118 178 Q140 198 162 178"
              fill="none"
              stroke={collarColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="140" cy="196" r="7" fill={GOLD} stroke={LINE} strokeWidth="3" />
          </g>
        )}

        {/* —— OVERSIZED HEAD (~1/3 of figure) —— */}
        <g>
          {/* Back hair */}
          {config.hair !== "bald" && config.hair !== "fade" && config.hair !== "short" && (
            <HairBack config={config} fill={`url(#hair-${uid})`} />
          )}

          {/* Face shapes */}
          {config.face === "round" && (
            <circle cx="140" cy="108" r="62" fill={`url(#skin-${uid})`} stroke={LINE} strokeWidth={SW} />
          )}
          {config.face === "oval" && (
            <ellipse cx="140" cy="110" rx="56" ry="64" fill={`url(#skin-${uid})`} stroke={LINE} strokeWidth={SW} />
          )}
          {config.face === "square" && (
            <rect x="82" y="52" width="116" height="120" rx="34" fill={`url(#skin-${uid})`} stroke={LINE} strokeWidth={SW} />
          )}
          {config.face === "heart" && (
            <path
              d="M140 48 C112 48 84 70 84 100 C84 138 112 168 140 174 C168 168 196 138 196 100 C196 70 168 48 140 48 Z"
              fill={`url(#skin-${uid})`}
              stroke={LINE}
              strokeWidth={SW}
            />
          )}

          {/* Cel shade cheek */}
          <ellipse cx="108" cy="128" rx="12" ry="8" fill={skinShade} opacity="0.28" />
          <ellipse cx="172" cy="128" rx="12" ry="8" fill={skinShade} opacity="0.28" />
          <path
            d="M96 86 C110 70 130 66 140 66 C128 88 112 110 100 120 C94 110 92 96 96 86 Z"
            fill={`url(#cel-${uid})`}
            opacity="0.65"
          />

          {/* Top / front hair */}
          {config.hair !== "bald" && (
            <HairFront config={config} fill={`url(#hair-${uid})`} />
          )}

          {/* Brows */}
          <g stroke={LINE} strokeLinecap="round" fill="none">
            <path
              d={
                config.eyebrows === "arched"
                  ? "M102 90 Q118 78 134 88"
                  : config.eyebrows === "straight"
                    ? "M104 88 H134"
                    : config.eyebrows === "thick"
                      ? "M102 90 Q118 82 134 90"
                      : "M104 90 Q118 84 134 90"
              }
              strokeWidth={config.eyebrows === "thick" ? 5.5 : 4}
            />
            <path
              d={
                config.eyebrows === "arched"
                  ? "M146 88 Q162 78 178 90"
                  : config.eyebrows === "straight"
                    ? "M146 88 H176"
                    : config.eyebrows === "thick"
                      ? "M146 90 Q162 82 178 90"
                      : "M146 90 Q162 84 176 90"
              }
              strokeWidth={config.eyebrows === "thick" ? 5.5 : 4}
            />
          </g>

          {/* Eyes — large & friendly */}
          <Eyes
            style={config.eyes}
            wink={wink}
            line={LINE}
          />

          {/* Nose — small simplified */}
          <g stroke={LINE} fill="none" strokeLinecap="round">
            {config.nose === "broad" ? (
              <path d="M128 122 Q140 134 152 122" strokeWidth="3.5" />
            ) : config.nose === "soft" ? (
              <path d="M140 114 Q148 124 140 130" strokeWidth="3.2" />
            ) : (
              <path d="M140 116 Q146 124 140 128" strokeWidth="3.2" />
            )}
          </g>

          {/* Mouth */}
          <g stroke={LINE} strokeWidth="3.8" strokeLinecap="round">
            {laugh ? (
              <path d="M118 142 Q140 168 162 142 Q140 154 118 142 Z" fill="#3A1C14" />
            ) : smirk ? (
              <path d="M124 146 Q140 156 160 140" fill="none" />
            ) : smile ? (
              <path d="M120 144 Q140 162 160 144" fill="none" />
            ) : (
              <path d="M124 148 H156" fill="none" />
            )}
          </g>

          {/* Beard */}
          {config.beard !== "none" && (
            <g
              fill={`url(#hair-${uid})`}
              stroke={LINE}
              strokeWidth="3.5"
              strokeLinejoin="round"
              opacity={config.beard === "stubble" ? 0.5 : 1}
            >
              {config.beard === "mustache" && (
                <path d="M116 136 Q140 148 164 136 Q140 142 116 136 Z" />
              )}
              {config.beard === "goatee" && (
                <path d="M130 152 Q140 178 150 152 Q140 160 130 152 Z" />
              )}
              {(config.beard === "full" || config.beard === "stubble") && (
                <path d="M92 132 C86 168 108 196 140 200 C172 196 194 168 188 132 C172 158 156 164 140 164 C124 164 108 158 92 132 Z" />
              )}
            </g>
          )}

          {/* Glasses */}
          {config.glasses !== "none" && (
            <g fill="none" stroke={LINE} strokeWidth="3.8">
              {config.glasses === "round" && (
                <>
                  <circle cx="118" cy="108" r="16" />
                  <circle cx="162" cy="108" r="16" />
                  <path d="M134 108 H146" />
                </>
              )}
              {config.glasses === "square" && (
                <>
                  <rect x="102" y="94" width="32" height="28" rx="8" />
                  <rect x="146" y="94" width="32" height="28" rx="8" />
                  <path d="M134 108 H146" />
                </>
              )}
              {config.glasses === "half" && (
                <>
                  <path d="M102 108 H134" />
                  <path d="M146 108 H178" />
                  <path d="M134 108 H146" />
                  <path d="M102 108 Q118 94 134 108" />
                  <path d="M146 108 Q162 94 178 108" />
                </>
              )}
            </g>
          )}

          {/* Hats */}
          <Hat type={config.hat} />
        </g>
      </g>
    </svg>
  );
}

function Hand({
  cx,
  cy,
  skin,
  glove,
  ring,
}: {
  cx: number;
  cy: number;
  skin: string;
  glove: string | null;
  ring: string;
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="13"
        fill={glove ?? skin}
        stroke={LINE}
        strokeWidth={SW}
      />
      {ring !== "none" && (
        <g>
          <ellipse
            cx={cx + 8}
            cy={cy - 2}
            rx="5"
            ry="3"
            fill="none"
            stroke={GOLD}
            strokeWidth="2.5"
          />
          {ring === "signet" && (
            <circle cx={cx + 8} cy={cy - 2} r="2.2" fill={GOLD} stroke={LINE} strokeWidth="1.5" />
          )}
        </g>
      )}
    </g>
  );
}

function Eyes({
  style,
  wink,
  line,
}: {
  style: string;
  wink: boolean;
  line: string;
}) {
  const rx = style === "wide" ? 13 : style === "almond" ? 12 : 11;
  const ry = style === "lidded" ? 7 : style === "almond" ? 10 : 12;

  return (
    <g>
      <ellipse cx="118" cy="108" rx={rx} ry={ry} fill="#FFF" stroke={line} strokeWidth="3.5" />
      {!wink ? (
        <ellipse cx="162" cy="108" rx={rx} ry={ry} fill="#FFF" stroke={line} strokeWidth="3.5" />
      ) : (
        <path
          d="M148 108 Q162 98 176 108"
          fill="none"
          stroke={line}
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
      <circle cx="120" cy="109" r="4.5" fill={line} />
      <circle cx="117" cy="106" r="1.6" fill="#FFF" />
      {!wink && (
        <>
          <circle cx="164" cy="109" r="4.5" fill={line} />
          <circle cx="161" cy="106" r="1.6" fill="#FFF" />
        </>
      )}
    </g>
  );
}

function HairBack({
  config,
  fill,
}: {
  config: AvatarConfig;
  fill: string;
}) {
  if (config.hair === "afro") {
    return <circle cx="140" cy="96" r="78" fill={fill} stroke={LINE} strokeWidth={SW} />;
  }
  if (config.hair === "long" || config.hair === "wavy" || config.hair === "curly") {
    return (
      <path
        d="M78 110 C74 70 104 42 140 42 C176 42 206 70 202 110 C210 150 204 200 196 220 C186 200 180 160 176 130 C170 160 156 190 140 198 C124 190 110 160 104 130 C100 160 94 200 84 220 C76 200 70 150 78 110 Z"
        fill={fill}
        stroke={LINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
    );
  }
  return null;
}

function HairFront({
  config,
  fill,
}: {
  config: AvatarConfig;
  fill: string;
}) {
  return (
    <g fill={fill} stroke={LINE} strokeWidth={SW} strokeLinejoin="round">
      {config.hair === "short" && (
        <path d="M84 112 C84 58 108 44 140 44 C172 44 196 58 196 112 C186 82 166 74 140 74 C114 74 94 82 84 112 Z" />
      )}
      {config.hair === "fade" && (
        <path d="M90 108 C92 60 112 48 140 48 C168 48 188 60 190 108 C180 84 164 78 140 78 C116 78 100 84 90 108 Z" />
      )}
      {config.hair === "wavy" && (
        <path d="M82 108 C78 56 110 40 140 40 C170 40 202 56 198 108 C188 78 168 70 140 70 C112 70 92 78 82 108 Z" />
      )}
      {config.hair === "curly" && (
        <>
          <circle cx="104" cy="66" r="18" />
          <circle cx="140" cy="54" r="20" />
          <circle cx="176" cy="66" r="18" />
          <circle cx="90" cy="96" r="15" />
          <circle cx="190" cy="96" r="15" />
        </>
      )}
      {config.hair === "afro" && null}
      {config.hair === "bun" && (
        <>
          <path d="M90 110 C92 62 114 50 140 50 C166 50 188 62 190 110 C180 84 164 78 140 78 C116 78 100 84 90 110 Z" />
          <circle cx="140" cy="40" r="18" />
        </>
      )}
      {config.hair === "long" && (
        <path d="M82 108 C78 56 110 40 140 40 C170 40 202 56 198 108 C188 78 168 70 140 70 C112 70 92 78 82 108 Z" />
      )}
    </g>
  );
}

function Hat({ type }: { type: string }) {
  if (type === "none") return null;

  if (type === "cap") {
    return (
      <g stroke={LINE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M88 86 C96 50 120 38 140 38 C160 38 184 50 192 86 Z" fill="#2A2A2A" />
        <path d="M192 86 H224 C214 96 200 98 192 96 Z" fill={GOLD} />
      </g>
    );
  }
  if (type === "beanie") {
    return (
      <path
        d="M90 92 C94 48 116 34 140 34 C164 34 186 48 190 92 Z"
        fill="#2A2A2A"
        stroke={LINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
    );
  }
  if (type === "bucket") {
    return (
      <g stroke={LINE} strokeWidth={SW} strokeLinejoin="round">
        <ellipse cx="140" cy="90" rx="70" ry="14" fill="#2A2A2A" />
        <path d="M100 90 C104 54 120 42 140 42 C160 42 176 54 180 90 Z" fill="#2A2A2A" />
      </g>
    );
  }
  if (type === "fez") {
    return (
      <g stroke={LINE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M110 78 H170 L164 40 H116 Z" fill="#8B1E1E" />
        <path d="M164 44 C176 40 186 52 178 62" fill="none" stroke={GOLD} strokeWidth="3" />
        <circle cx="176" cy="64" r="4" fill={GOLD} />
      </g>
    );
  }
  if (type === "top") {
    return (
      <g stroke={LINE} strokeWidth={SW} strokeLinejoin="round">
        <ellipse cx="140" cy="78" rx="58" ry="10" fill="#151515" />
        <rect x="112" y="28" width="56" height="50" rx="6" fill="#151515" />
        <rect x="112" y="66" width="56" height="8" fill={GOLD} stroke="none" />
      </g>
    );
  }
  return null;
}
