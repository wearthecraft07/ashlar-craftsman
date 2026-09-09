import type {
  StickerCategoryMeta,
  StickerDefinition,
} from "@/types/stickers";
import { allPackStickers } from "@/lib/stickers/packs";

export const STICKER_CATEGORIES: StickerCategoryMeta[] = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "greetings", label: "Greetings" },
  { id: "masonic-life", label: "Masonic Life" },
  { id: "degrees", label: "Degrees" },
  { id: "humor", label: "Humor" },
  { id: "celebration", label: "Celebration" },
];

/** Flat catalog from registered packs (extensible). */
export const STICKER_CATALOG: StickerDefinition[] = allPackStickers();

export function getStickerById(id: string) {
  return STICKER_CATALOG.find((s) => s.id === id);
}

export function filterStickers(
  category: StickerCategoryMeta["id"],
  favoriteIds: Set<string>,
) {
  if (category === "all") return STICKER_CATALOG;
  if (category === "favorites") {
    return STICKER_CATALOG.filter((s) => favoriteIds.has(s.id));
  }
  return STICKER_CATALOG.filter((s) => s.category === category);
}

export { composeAvatarConfig } from "@/lib/stickers/compose";
