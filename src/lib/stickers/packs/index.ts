import type { StickerPack, StickerPackId } from "@/types/stickers";
import { COLLECTIBLE_SERIES_PACK } from "@/lib/stickers/packs/collectible-series";

/**
 * Registered sticker packs. Collectible Series is the active Craft Your Stickers set.
 */
export const STICKER_PACKS: StickerPack[] = [COLLECTIBLE_SERIES_PACK];

export function getPack(id: StickerPackId) {
  return STICKER_PACKS.find((pack) => pack.id === id);
}

export function allPackStickers() {
  return STICKER_PACKS.flatMap((pack) =>
    [...pack.stickers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  );
}
