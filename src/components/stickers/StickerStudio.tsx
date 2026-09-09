"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { DEFAULT_AVATAR } from "@/avatar/options";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { Button } from "@/components/ui/Button";
import { StickerCard } from "@/components/stickers/StickerCard";
import { StickerCategoryTabs } from "@/components/stickers/StickerCategoryTabs";
import { StickerPreview } from "@/components/stickers/StickerPreview";
import {
  STICKER_CATALOG,
  STICKER_CATEGORIES,
  filterStickers,
} from "@/lib/stickers/catalog";
import {
  loadActiveStickerAvatar,
  loadStickerFavorites,
  toggleStickerFavorite,
} from "@/lib/stickers/storage";
import type { AvatarConfig } from "@/types";
import type { StickerCategoryMeta, StickerDefinition } from "@/types/stickers";

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
    const list = raw ? (JSON.parse(raw) as Array<{ name: string; config: AvatarConfig }>) : [];
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

  const stickers = useMemo(
    () => filterStickers(category, favoriteSet),
    [category, favoriteSet],
  );

  const featured = useMemo(
    () => STICKER_CATALOG.filter((s) => s.featured).slice(0, 4),
    [],
  );

  function onToggleFavorite(id: string) {
    setFavorites(toggleStickerFavorite(id));
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm text-[var(--walnut)]">Loading your stickers…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/avatar"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--walnut)] hover:text-[var(--lodge-blue)]"
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
              These are <span className="text-[var(--gold)]">{avatarName}</span>
              &apos;s Masonic stickers — built from your avatar for lodge chats,
              brotherhood moments, and the journey between degrees.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/avatar" variant="gold" size="sm">
                Edit character
              </Button>
              <Button href="/shop" variant="ghost" size="sm" className="border-[var(--gold)]/40 bg-transparent text-[var(--ivory)] hover:bg-[var(--ivory)]/10 hover:text-[var(--ivory)]">
                Shop your avatar
              </Button>
            </div>
          </div>
          <div className="mx-auto w-36 sm:w-44">
            <div className="rounded-[1.25rem] bg-[var(--ivory)] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              <AvatarCanvas config={config} decorative />
            </div>
            <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              <Sparkles className="h-3 w-3" />
              Your character
            </p>
          </div>
        </div>
      </div>

      {category === "all" ? (
        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                Start here
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]">
                Featured for {avatarName}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {featured.map((sticker) => (
              <StickerCard
                key={`featured-${sticker.id}`}
                sticker={sticker}
                config={config}
                favorited={favoriteSet.has(sticker.id)}
                onOpen={() => setSelected(sticker)}
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
          onChange={setCategory}
        />

        {stickers.length === 0 ? (
          <div className="lodge-card rounded-[1.5rem] p-8 text-center">
            <p className="font-[family-name:var(--font-display)] text-xl text-[var(--lodge-blue)]">
              No stickers in this collection yet
            </p>
            <p className="mt-2 text-sm text-[var(--walnut)]">
              Favorite a few stickers to build your personal pack.
            </p>
            <Button
              className="mt-4"
              variant="ghost"
              onClick={() => setCategory("all")}
            >
              Browse all
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {stickers.map((sticker) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                config={config}
                favorited={favoriteSet.has(sticker.id)}
                onOpen={() => setSelected(sticker)}
                onToggleFavorite={() => onToggleFavorite(sticker.id)}
              />
            ))}
          </div>
        )}
      </div>

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
