"use client";

import { Heart } from "lucide-react";
import { StickerRenderer } from "@/components/stickers/StickerRenderer";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/types";
import type { StickerDefinition } from "@/types/stickers";

type Props = {
  sticker: StickerDefinition;
  config: AvatarConfig;
  favorited: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
};

export function StickerCard({
  sticker,
  config,
  favorited,
  onOpen,
  onToggleFavorite,
}: Props) {
  return (
    <article className="group relative flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="lodge-card overflow-hidden rounded-[1.25rem] border border-[var(--stone)] bg-[color-mix(in_srgb,var(--ivory)_88%,white)] p-2 text-left transition hover:border-[var(--gold)] hover:shadow-[0_12px_32px_rgba(15,28,46,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        <div className="pointer-events-none">
          <StickerRenderer sticker={sticker} config={config} />
        </div>
        <div className="mt-2 flex items-start justify-between gap-2 px-1 pb-1">
          <div>
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold leading-snug text-[var(--lodge-blue)]">
              {sticker.name}
            </p>
            {sticker.featured ? (
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                Featured
              </p>
            ) : null}
          </div>
        </div>
      </button>

      <button
        type="button"
        aria-label={favorited ? "Remove favorite" : "Favorite sticker"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite();
        }}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--ivory)]/95 shadow-sm transition",
          favorited
            ? "border-[var(--gold)] text-[var(--copper)]"
            : "border-[var(--stone)] text-[var(--walnut)] hover:border-[var(--gold)]",
        )}
      >
        <Heart
          className={cn("h-4 w-4", favorited && "fill-current")}
        />
      </button>
    </article>
  );
}
