"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  RotateCcw,
  Save,
  ShoppingBag,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import {
  AVATAR_CATEGORIES,
  AVATAR_OPTIONS,
  DEFAULT_AVATAR,
} from "@/avatar/options";
import { Button } from "@/components/ui/Button";
import { SHIRT_COLORS } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import type { AvatarConfig, SavedAvatar } from "@/types";

const STORAGE_KEY = "ashlar-avatars";

function loadAvatars(): SavedAvatar[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function AvatarStudio() {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [category, setCategory] =
    useState<(typeof AVATAR_CATEGORIES)[number]["key"]>("face");
  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0].hex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [name, setName] = useState("My Avatar");
  const [saved, setSaved] = useState<SavedAvatar[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setSaved(loadAvatars());
  }, []);

  const options = AVATAR_OPTIONS[category];

  const previewConfig = useMemo(
    () => ({
      ...config,
      clothingColor:
        SHIRT_COLORS.find((c) => c.hex === shirtColor)?.id ??
        config.clothingColor,
    }),
    [config, shirtColor],
  );

  function update<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function persist(next: SavedAvatar[]) {
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function saveAvatar() {
    const entry: SavedAvatar = {
      id: activeId ?? `avatar-${Date.now()}`,
      name: name.trim() || "My Avatar",
      config,
      shirtColor,
      updatedAt: new Date().toISOString(),
    };
    const next = [
      entry,
      ...saved.filter((item) => item.id !== entry.id),
    ].slice(0, 12);
    persist(next);
    setActiveId(entry.id);
    setStatus("Avatar saved. You can edit it anytime.");
  }

  function loadAvatar(avatar: SavedAvatar) {
    setActiveId(avatar.id);
    setName(avatar.name);
    setConfig({ ...DEFAULT_AVATAR, ...avatar.config });
    setShirtColor(avatar.shirtColor);
    setStatus(`Editing “${avatar.name}”.`);
  }

  async function downloadPreview() {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const blob = new Blob(
      [`<?xml version="1.0" encoding="UTF-8"?>${clone.outerHTML}`],
      { type: "image/svg+xml;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugSafe(name)}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Preview downloaded.");
  }

  function addToCart() {
    addItem({
      productId: "prod_avatar_custom",
      slug: "custom-avatar-tee",
      name: `Custom Avatar Tee — ${name}`,
      price: 6400,
      color: {
        id: SHIRT_COLORS.find((c) => c.hex === shirtColor)?.id ?? "black",
        name: SHIRT_COLORS.find((c) => c.hex === shirtColor)?.name ?? "Black",
        hex: shirtColor,
      },
      size: "M",
      quantity: 1,
      image: "/products/custom-avatar.svg",
      avatarConfig: config,
      custom: true,
    });
    setStatus("Custom shirt added to cart.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Avatar Studio
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)] sm:text-5xl">
          Craft your character.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Clean 2D vector avatars with bold outlines, modular layers, and
          Masonic regalia — aprons, collars, gloves, rings, and working tools.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-black/8 bg-white p-4 sm:p-6">
            <div
              ref={previewRef}
              className="relative mx-auto flex aspect-square max-w-md items-center justify-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#F4F1EA,#FFFFFF)]"
            >
              <motion.div
                style={{ scale: zoom, rotate: rotation }}
                className="w-[88%]"
              >
                <AvatarCanvas config={config} />
              </motion.div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <IconButton
                label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </IconButton>
              <IconButton
                label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </IconButton>
              <IconButton
                label="Rotate"
                onClick={() => setRotation((r) => r + 15)}
              >
                <RotateCcw className="h-4 w-4" />
              </IconButton>
              <Button variant="ghost" size="sm" onClick={downloadPreview}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Shirt preview
              </p>
              <div className="flex flex-wrap gap-3">
                {SHIRT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    onClick={() => setShirtColor(color.hex)}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition",
                      shirtColor === color.hex
                        ? "border-[var(--gold)] scale-110"
                        : "border-black/10",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-[var(--ink)] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                Live tee mockup
              </p>
              <div className="mx-auto mt-4 max-w-[220px]">
                <svg viewBox="0 0 320 380" className="w-full">
                  <path
                    d="M60 95 L110 70 L140 95 L180 95 L210 70 L260 95 L245 140 L230 135 L230 350 L90 350 L90 135 L75 140 Z"
                    fill={shirtColor}
                    stroke="#111"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <g transform="translate(100,118) scale(0.43)">
                    <AvatarCanvas config={previewConfig} decorative />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-black/8 bg-white p-4 sm:p-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {AVATAR_CATEGORIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                    category === item.key
                      ? "bg-[var(--ink)] text-white"
                      : "bg-black/5 text-[var(--muted)] hover:bg-black/10",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {options.map((option) => {
                const selected =
                  config[category as keyof AvatarConfig] === option.id;
                const tone =
                  "tone" in option
                    ? (option as { tone?: string }).tone
                    : undefined;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      update(
                        category as keyof AvatarConfig,
                        option.id as AvatarConfig[keyof AvatarConfig],
                      )
                    }
                    className={cn(
                      "rounded-2xl border px-3 py-3 text-left text-sm transition",
                      selected
                        ? "border-[var(--gold)] bg-[var(--gold)]/10"
                        : "border-black/8 hover:border-black/20",
                    )}
                  >
                    {tone && (
                      <span
                        className="mb-2 block h-6 w-6 rounded-full border border-black/10"
                        style={{ backgroundColor: tone }}
                      />
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white p-4 sm:p-6">
            <label className="block text-sm font-medium text-[var(--ink)]">
              Avatar name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-12 w-full rounded-full border border-black/10 px-4 outline-none ring-[var(--gold)] focus:ring-2"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={saveAvatar}>
                <Save className="h-4 w-4" />
                Save avatar
              </Button>
              <Button variant="dark" onClick={addToCart}>
                <ShoppingBag className="h-4 w-4" />
                Add shirt to cart
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setConfig(DEFAULT_AVATAR);
                  setActiveId(null);
                  setStatus("Reset to defaults.");
                }}
              >
                Reset
              </Button>
            </div>
            {status && (
              <p className="mt-4 text-sm text-[var(--gold)]" role="status">
                {status}
              </p>
            )}
          </div>

          {saved.length > 0 && (
            <div className="rounded-[2rem] border border-black/8 bg-white p-4 sm:p-6">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Saved avatars
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {saved.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => loadAvatar(avatar)}
                    className={cn(
                      "rounded-2xl border p-3 text-left transition hover:border-[var(--gold)]",
                      activeId === avatar.id
                        ? "border-[var(--gold)]"
                        : "border-black/8",
                    )}
                  >
                    <div className="mx-auto w-24">
                      <AvatarCanvas config={avatar.config} decorative />
                    </div>
                    <p className="mt-2 text-sm font-medium">{avatar.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[var(--ink)] transition hover:border-[var(--gold)]"
    >
      {children}
    </button>
  );
}

function slugSafe(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "ashlar-avatar";
}
