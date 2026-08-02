"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { DEFAULT_AVATAR } from "@/avatar/options";
import type { AvatarConfig } from "@/types";

const heroAvatars: AvatarConfig[] = [
  {
    ...DEFAULT_AVATAR,
    hair: "wavy",
    clothingColor: "black",
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
    clothingColor: "navy",
    clothing: "lodge",
    expression: "smile",
    pose: "wave",
    apron: "plain",
    collar: "gold",
    tool: "gavel",
  },
  {
    ...DEFAULT_AVATAR,
    skin: "fair",
    hair: "bun",
    hairColor: "chestnut",
    clothing: "hoodie",
    clothingColor: "charcoal",
    pose: "lean",
    expression: "wink",
    apron: "none",
    gloves: "none",
    hat: "cap",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.16),_transparent_55%),linear-gradient(180deg,#F4F1EA_0%,#FAFAF8_45%,#FFFFFF_100%)]" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[var(--gold)]/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
        <svg
          className="absolute inset-x-0 top-16 mx-auto h-[420px] w-full max-w-5xl opacity-[0.12]"
          viewBox="0 0 800 400"
          aria-hidden="true"
        >
          <g fill="none" stroke="#C9A227" strokeWidth="2.5">
            <rect x="80" y="70" width="70" height="70" transform="rotate(12 115 105)" />
            <circle cx="115" cy="105" r="20" />
            <path d="M620 80 L690 160 L620 160 Z" />
            <line x1="655" y1="60" x2="655" y2="180" />
          </g>
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center lg:justify-start"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.18)_0%,rgba(247,244,238,0)_70%)] blur-2xl lg:left-[36%]"
            />
            <BrandLogo size="hero" priority className="relative z-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 max-w-xl text-center font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl lg:text-left"
          >
            Craft Your Journey.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-lg text-center text-base leading-relaxed text-[var(--muted)] sm:text-lg lg:mx-0 lg:text-left"
          >
            Premium cartoon streetwear with classic craftsmanship. Build an
            original avatar, preview it on luxury tees, and wear the mark.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <Button href="/avatar" size="lg">
              Build Your Avatar
            </Button>
            <Button href="/shop" variant="ghost" size="lg">
              Shop Collections
            </Button>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute inset-x-8 -bottom-4 h-16 rounded-[100%] bg-black/10 blur-2xl" />
            <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
              {heroAvatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  animate={{ y: [0, index === 1 ? -10 : -6, 0] }}
                  transition={{
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={index === 1 ? "z-10 -mb-2 scale-110" : "opacity-95"}
                >
                  <AvatarCanvas config={avatar} decorative />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
