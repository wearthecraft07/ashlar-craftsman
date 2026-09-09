"use client";

import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { DEFAULT_AVATAR } from "@/avatar/options";
import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/Button";
import type { AvatarConfig } from "@/types";

const preview: AvatarConfig = {
  ...DEFAULT_AVATAR,
  clothing: "suit",
  clothingColor: "navy",
  apron: "mm",
  gloves: "white",
  expression: "confident",
  pose: "idle",
};

export function AvatarStudioFeature() {
  return (
    <section
      id="avatar-studio"
      className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Avatar Studio
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-5xl">
            Build Your Craftsman.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--walnut)] sm:text-lg">
            Your journey is your own. Build the character that represents it.
          </p>
          <div className="mt-9">
            <Button href="/avatar" size="lg" variant="dark">
              Enter Avatar Studio
            </Button>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-x-8 -bottom-1 h-12 rounded-[100%] bg-[var(--lodge-blue)]/20 blur-2xl" />
            <div className="rounded-[1.75rem] border border-[var(--gold)]/25 bg-[var(--panel)] p-3 shadow-[0_24px_50px_rgba(30,42,68,0.12)]">
              <AvatarCanvas config={preview} decorative />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
