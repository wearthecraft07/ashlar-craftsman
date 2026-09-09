const FAVORITES_KEY = "ashlar-sticker-favorites";
const ACTIVE_AVATAR_KEY = "ashlar-sticker-active-avatar";

export function loadStickerFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveStickerFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleStickerFavorite(id: string): string[] {
  const current = loadStickerFavorites();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  saveStickerFavorites(next);
  return next;
}

export type StickerActiveAvatar = {
  id: string;
  name: string;
  config: Record<string, string>;
  shirtColor: string;
};

export function saveActiveStickerAvatar(avatar: StickerActiveAvatar) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_AVATAR_KEY, JSON.stringify(avatar));
}

export function loadActiveStickerAvatar(): StickerActiveAvatar | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_AVATAR_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StickerActiveAvatar;
  } catch {
    return null;
  }
}
