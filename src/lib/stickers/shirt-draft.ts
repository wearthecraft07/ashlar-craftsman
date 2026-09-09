import type { AvatarConfig } from "@/types";
import type { StickerComposition } from "@/types/stickers";

const DRAFT_KEY = "ashlar-shirt-design-draft";

export type ShirtDesignDraft = {
  stickerId: string;
  stickerName: string;
  composition: StickerComposition;
  avatarConfig: AvatarConfig;
  /** Optional preview artwork generated at handoff. */
  previewDataUrl?: string;
  createdAt: string;
};

export function saveShirtDesignDraft(draft: ShirtDesignDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadShirtDesignDraft(): ShirtDesignDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ShirtDesignDraft;
  } catch {
    return null;
  }
}

export function clearShirtDesignDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DRAFT_KEY);
}
