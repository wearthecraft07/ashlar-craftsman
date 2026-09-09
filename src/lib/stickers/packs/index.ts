import type { StickerPack, StickerPackId } from "@/types/stickers";
import { LODGE_LIFE_PACK } from "@/lib/stickers/packs/lodge-life";

/**
 * Registered sticker packs. Add Pack 02+ here without touching the UI.
 */
export const STICKER_PACKS: StickerPack[] = [LODGE_LIFE_PACK];

export function getPack(id: StickerPackId) {
  return STICKER_PACKS.find((pack) => pack.id === id);
}

export function allPackStickers() {
  return STICKER_PACKS.flatMap((pack) => pack.stickers);
}
