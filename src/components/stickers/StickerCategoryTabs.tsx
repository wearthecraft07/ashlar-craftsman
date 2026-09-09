"use client";

import { cn } from "@/lib/utils";
import type { StickerCategoryMeta } from "@/types/stickers";

type Props = {
  categories: StickerCategoryMeta[];
  active: StickerCategoryMeta["id"];
  onChange: (id: StickerCategoryMeta["id"]) => void;
};

export function StickerCategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="sticky top-[4.5rem] z-20 -mx-4 border-b border-[var(--stone)]/70 bg-[color-mix(in_srgb,var(--ivory)_92%,white)]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const selected = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition",
                selected
                  ? "bg-[var(--lodge-blue)] text-[var(--ivory)] shadow-[0_8px_20px_rgba(15,28,46,0.18)]"
                  : "bg-[var(--panel)] text-[var(--walnut)] ring-1 ring-[var(--stone)] hover:ring-[var(--gold)]",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
