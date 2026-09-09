"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { DEFAULT_AVATAR } from "@/avatar/options";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { Button } from "@/components/ui/Button";
import { StickerCard } from "@/components/stickers/StickerCard";
import { StickerCategoryTabs } from "@/components/stickers/StickerCategoryTabs";
import {
  STICKER_CATALOG,
  STICKER_CATEGORIES,
  filterStickers,
} from "@/lib/stickers/catalog";
import { STICKER_PACKS } from "@/lib/stickers/packs";
import {
  loadActiveStickerAvatar,
  loadStickerFavorites,
  toggleStickerFavorite,
} from "@/lib/stickers/storage";
import type { AvatarConfig } from "@/types";
import type { StickerCategoryMeta, StickerDefinition } from "@/types/stickers";

const StickerPreview = dynamic(
  () =>
    import("@/components/stickers/StickerPreview").then((m) => m.StickerPreview),
  { ssr: false },
);

const AVATARS_KEY = "ashlar-avatars";

function loadStudioAvatar(): { name: string; config: AvatarConfig } {
  const active = loadActiveStickerAvatar();
  if (active?.config) {
    return {
      name: active.name || "My Character",
      config: { ...DEFAULT_AVATAR, ...active.config } as AvatarConfig,
    };
  }

  try {
    const raw = localStorage.getItem(AVATARS_KEY);
    const list = raw
      ? (JSON.parse(raw) as Array<{ name: string; config: AvatarConfig }>)
      : [];
    if (Array.isArray(list) && list[0]?.config) {
      return {
        name: list[0].name || "My Character",
        config: { ...DEFAULT_AVATAR, ...list[0].config },
      };
    }
  } catch {
    // fall through
  }

  return { name: "My Character", config: DEFAULT_AVATAR };
}

function StickerSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="lodge-card overflow-hidden rounded-[1.25rem] p-2"
        >
          <div className="aspect-square animate-pulse rounded-[1rem] bg-[color-mix(in_srgb,var(--stone)_45%,white)]" />
          <div className="mt-3 h-3 w-[75%] animate-pulse rounded bg-[color-mix(in_srgb,var(--stone)_45%,white)]" />
          <div className="mt-2 h-2 w-1/2 animate-pulse rounded bg-[color-mix(in_srgb,var(--stone)_35%,white)]" />
        </div>
      ))}
    </div>
  );
}

export function StickerStudio() {
  const [ready, setReady] = useState(false);
  const [avatarName, setAvatarName] = useState("My Character");
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [category, setCategory] =
    useState<StickerCategoryMeta["id"]>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<StickerDefinition | null>(null);

  useEffect(() => {
    const loaded = loadStudioAvatar();
    setAvatarName(loaded.name);
    setConfig(loaded.config);
    setFavorites(loadStickerFavorites());
    setReady(true);
  }, []);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const featured = useMemo(
    () => STICKER_CATALOG.filter((s) => s.featured).slice(0, 4),
    [],
  );

  const featuredIds = useMemo(
    () => new Set(featured.map((s) => s.id)),
    [featured],
  );

  const stickers = useMemo(() => {
    const list = filterStickers(category, favoriteSet);
    // Avoid double-mounting the same sticker as featured + grid.
    if (category === "all") {
      return list.filter((s) => !featuredIds.has(s.id));
    }
    return list;
  }, [category, favoriteSet, featuredIds]);

  const onToggleFavorite = useCallback((id: string) => {
    setFavorites(toggleStickerFavorite(id));
  }, []);

  const onOpenSticker = useCallback((sticker: StickerDefinition) => {
    setSelected(sticker);
  }, []);

  const onCategoryChange = useCallback((id: StickerCategoryMeta["id"]) => {
    setCategory(id);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/avatar"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--walnut)] transition duration-150 hover:text-[var(--lodge-blue)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Avatar Studio
        </Link>
      </div>

      <div className="lodge-card overflow-hidden rounded-[1.75rem]">
        <div className="grid gap-6 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--lodge-blue)_92%,black),var(--lodge-blue))] p-5 text-[var(--ivory)] sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Craft Your Stickers
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              Your character. Your journey. Your expressions.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ivory)]/85 sm:text-base">
              These are{" "}
              <span className="text-[var(--gold)]">
                {ready ? avatarName : "your character"}
              </span>
              &apos;s Masonic stickers — the same character you crafted, in poses
              built for lodge chats and the journey between degrees.
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]/80">
              Pack · {STICKER_PACKS[0]?.name ?? "Lodge Life"}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/avatar" variant="gold" size="sm">
                Edit character
              </Button>
              <Button
                href="/shop"
                variant="ghost"
                size="sm"
                className="border-[var(--gold)]/40 bg-transparent text-[var(--ivory)] hover:bg-[var(--ivory)]/10 hover:text-[var(--ivory)]"
              >
                Shop your avatar
              </Button>
            </div>
          </div>
          <div className="mx-auto w-36 sm:w-44">
            <div className="rounded-[1.25rem] bg-[var(--ivory)] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              {ready ? (
                <AvatarCanvas config={config} decorative />
              ) : (
                <div className="aspect-[280/360] animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--stone)_40%,white)]" />
              )}
            </div>
            <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              <Sparkles className="h-3 w-3" />
              Your character
            </p>
          </div>
        </div>
      </div>

      {!ready ? (
        <div className="mt-8 space-y-5">
          <div className="h-12 animate-pulse rounded-2xl bg-[color-mix(in_srgb,var(--stone)_40%,white)]" />
          <StickerSkeletonGrid count={8} />
        </div>
      ) : (
        <>
          {category === "all" ? (
            <section className="mt-8">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                  Start here
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]">
                  Featured for {avatarName}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {featured.map((sticker, index) => (
                  <StickerCard
                    key={`featured-${sticker.id}`}
                    sticker={sticker}
                    config={config}
                    favorited={favoriteSet.has(sticker.id)}
                    eager={index < 4}
                    onOpen={() => onOpenSticker(sticker)}
                    onToggleFavorite={() => onToggleFavorite(sticker.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-8 space-y-5">
            <StickerCategoryTabs
              categories={STICKER_CATEGORIES}
              active={category}
              onChange={onCategoryChange}
            />

            {stickers.length === 0 ? (
              <div className="lodge-card rounded-[1.5rem] p-8 text-center">
                <p className="font-[family-name:var(--font-display)] text-xl text-[var(--lodge-blue)]">
                  {category === "favorites"
                    ? "Favorite a sticker and it’ll appear here."
                    : "Your sticker collection starts here."}
                </p>
                <p className="mt-2 text-sm text-[var(--walnut)]">
                  {category === "favorites"
                    ? "Tap the heart on any sticker to build your personal pack."
                    : "Browse a category or start with the featured set above."}
                </p>
                <Button
                  className="mt-4"
                  variant="ghost"
                  onClick={() => onCategoryChange("all")}
                >
                  Browse all
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {stickers.map((sticker, index) => (
                  <StickerCard
                    key={sticker.id}
                    sticker={sticker}
                    config={config}
                    favorited={favoriteSet.has(sticker.id)}
                    eager={category !== "all" && index < 6}
                    onOpen={() => onOpenSticker(sticker)}
                    onToggleFavorite={() => onToggleFavorite(sticker.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selected ? (
        <StickerPreview
          sticker={selected}
          config={config}
          favorited={favoriteSet.has(selected.id)}
          onClose={() => setSelected(null)}
          onToggleFavorite={() => onToggleFavorite(selected.id)}
        />
      ) : null}
    </div>
  );
}
