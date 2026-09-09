"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { DEFAULT_AVATAR } from "@/avatar/options";
import type { AvatarConfig } from "@/types";

const heroAvatars: AvatarConfig[] = [
  {
    ...DEFAULT_AVATAR,
    hair: "wavy",
    clothing: "suit",
    clothingColor: "navy",
    expression: "confident",
    pose: "idle",
    apron: "mm",
    gloves: "white",
    tool: "none",
  },
  {
    ...DEFAULT_AVATAR,
    skin: "deep",
    hair: "afro",
    glasses: "round",
    clothing: "formal",
    clothingColor: "charcoal",
    expression: "smile",
    pose: "idle",
    apron: "plain",
    collar: "gold",
    tool: "none",
  },
  {
    ...DEFAULT_AVATAR,
    skin: "fair",
    hair: "short",
    hairColor: "ink",
    clothing: "tuxedo",
    clothingColor: "black",
    pose: "lean",
    expression: "confident",
    apron: "none",
    gloves: "none",
    hat: "none",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--lodge-blue)] pt-24 text-[var(--ivory)] sm:pt-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(200,162,74,0.18),transparent_50%),linear-gradient(180deg,#1E2A44_0%,#162033_55%,#121926_100%)]" />
        <svg
          className="absolute inset-x-0 top-20 mx-auto h-[480px] w-full max-w-5xl opacity-[0.12]"
          viewBox="0 0 800 420"
          fill="none"
        >
          <g stroke="#C8A24A" strokeWidth="1.5">
            <rect x="90" y="80" width="120" height="120" />
            <line x1="90" y1="140" x2="210" y2="140" />
            <line x1="150" y1="80" x2="150" y2="200" />
            <path d="M520 90 L640 210 L520 210 Z" />
            <circle cx="580" cy="150" r="28" />
            <path d="M680 280 L720 340 L640 340 Z" opacity="0.7" />
          </g>
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-10">
        <div className="max-w-xl">
          <div className="flex justify-center lg:justify-start">
            <BrandLogo
              size="lg"
              priority
              className="relative z-10 h-28 w-28 sm:h-36 sm:w-36"
              onDark
            />
          </div>

          <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--gold)] lg:text-left">
            the ASHLAR CRAFTSMAN
          </p>

          <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight text-[var(--ivory)] sm:text-5xl md:text-6xl lg:text-left xl:text-7xl">
            CRAFT YOUR CHARACTER.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-center text-base leading-relaxed text-[var(--ivory)]/75 sm:text-lg lg:mx-0 lg:text-left">
            Masonic-inspired apparel for Brothers who carry the Craft beyond the
            Lodge.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <Button href="/shop" size="lg" className="w-full sm:w-auto">
              Explore the Craft
            </Button>
            <Button
              href="/avatar"
              variant="ghost"
              size="lg"
              className="w-full border-[var(--gold)]/45 bg-transparent text-[var(--ivory)] hover:bg-[var(--ivory)]/10 hover:text-[var(--ivory)] sm:w-auto"
            >
              Build Your Craftsman
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-x-10 -bottom-2 h-14 rounded-[100%] bg-black/35 blur-2xl" />
          <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
            {heroAvatars.map((avatar, index) => (
              <div
                key={index}
                className={
                  index === 1
                    ? "z-10 -mb-1 scale-110 motion-safe:animate-[float_5s_ease-in-out_infinite]"
                    : "opacity-90"
                }
              >
                <div className="rounded-[1.25rem] bg-[color-mix(in_srgb,var(--ivory)_92%,white)] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                  <AvatarCanvas config={avatar} decorative />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]/80">
            Look closer
          </p>
        </div>
      </div>
    </section>
  );
}
