"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Heart, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StickerRenderer } from "@/components/stickers/StickerRenderer";
import { exportStickerFromStage } from "@/lib/stickers/export";
import { STICKER_CATEGORIES } from "@/lib/stickers/catalog";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/types";
import type { StickerDefinition } from "@/types/stickers";

type Props = {
  sticker: StickerDefinition;
  config: AvatarConfig;
  favorited: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
};

export function StickerPreview({
  sticker,
  config,
  favorited,
  onClose,
  onToggleFavorite,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const categoryLabel =
    STICKER_CATEGORIES.find((c) => c.id === sticker.category)?.label ??
    sticker.category;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save(format: "png" | "svg") {
    if (!stageRef.current) return;
    setBusy(true);
    setStatus(
      format === "png" ? "Crafting your sticker…" : "Preparing SVG…",
    );
    try {
      await exportStickerFromStage(stageRef.current, sticker, format);
      setStatus(format === "png" ? "Sticker saved." : "SVG saved.");
    } catch {
      setStatus("Could not export this sticker. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    if (!stageRef.current) return;
    setBusy(true);
    setStatus("Crafting your sticker…");
    try {
      await exportStickerFromStage(stageRef.current, sticker, "png");
      if (typeof navigator.share === "function") {
        setStatus("Saved — share from your downloads or Photos.");
      } else {
        setStatus("PNG saved — ready to send.");
      }
    } catch {
      setStatus("Could not prepare share file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--lodge-blue)]/60 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={sticker.name}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-[var(--ivory)] shadow-2xl sm:rounded-[1.75rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--stone)] px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
              {categoryLabel}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--lodge-blue)]">
              {sticker.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--stone)] text-[var(--walnut)] hover:border-[var(--gold)]"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-sm rounded-[1.5rem] bg-[color-mix(in_srgb,var(--stone)_35%,white)] p-3">
            <StickerRenderer
              sticker={sticker}
              config={config}
              stageRef={stageRef}
              showOutline
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button
              onClick={() => save("png")}
              disabled={busy}
              className="w-full"
            >
              <Download className="h-4 w-4" />
              Save Sticker
            </Button>
            <Button
              variant={favorited ? "dark" : "white"}
              onClick={onToggleFavorite}
              className="w-full"
            >
              <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
              {favorited ? "Favorited" : "Favorite"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => save("svg")}
              disabled={busy}
              className="w-full"
            >
              <Download className="h-4 w-4" />
              Save SVG
            </Button>
            <Button
              variant="white"
              onClick={share}
              disabled={busy}
              className="w-full"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {status ? (
            <p className="mt-4 text-center text-sm text-[var(--copper)]" role="status">
              {status}
            </p>
          ) : (
            <p className="mt-4 text-center text-xs text-[var(--walnut)]/80">
              Transparent PNG with sticker outline — ready for texts and lodge chats.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
