"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
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
  /** Eager-render first viewport cards without waiting for IO. */
  eager?: boolean;
};

export const StickerCard = memo(function StickerCard({
  sticker,
  config,
  favorited,
  onOpen,
  onToggleFavorite,
  eager = false,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager || visible) return;
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, visible]);

  const onFavoriteClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onToggleFavorite();
    },
    [onToggleFavorite],
  );

  return (
    <article ref={rootRef} className="group relative flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="lodge-card overflow-hidden rounded-[1.25rem] border border-[var(--stone)] bg-[color-mix(in_srgb,var(--ivory)_88%,white)] p-2 text-left transition duration-200 hover:border-[var(--gold)] hover:shadow-[0_12px_32px_rgba(15,28,46,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        <div className="pointer-events-none aspect-square w-full">
          {visible ? (
            <StickerRenderer
              sticker={sticker}
              config={config}
              showOutline={false}
              quality="grid"
            />
          ) : (
            <div className="h-full w-full animate-pulse rounded-[1rem] bg-[color-mix(in_srgb,var(--stone)_45%,white)]" />
          )}
        </div>
        <div className="mt-2 min-h-[2.75rem] px-1 pb-1">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold leading-snug text-[var(--lodge-blue)]">
            {sticker.name}
          </p>
          {sticker.featured ? (
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Featured
            </p>
          ) : null}
        </div>
      </button>

      <button
        type="button"
        aria-label={favorited ? "Remove favorite" : "Favorite sticker"}
        onClick={onFavoriteClick}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--ivory)]/95 shadow-sm transition duration-150",
          favorited
            ? "border-[var(--gold)] text-[var(--copper)]"
            : "border-[var(--stone)] text-[var(--walnut)] hover:border-[var(--gold)]",
        )}
      >
        <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
      </button>
    </article>
  );
});
