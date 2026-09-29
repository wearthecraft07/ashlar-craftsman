import type { Product, ProductColor } from "@/types";

/**
 * Storefront T-shirt color palette.
 * White is always first — default selection for every product.
 */
export const TSHIRT_COLORS: ProductColor[] = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1A1A1A" },
  { id: "navy", name: "Navy", hex: "#1E2A44" },
  { id: "gray", name: "Gray", hex: "#8B8B8B" },
  { id: "red", name: "Red", hex: "#8B2E2E" },
  { id: "blue", name: "Blue", hex: "#2F4A6E" },
  { id: "green", name: "Green", hex: "#3D5A45" },
  { id: "beige", name: "Beige", hex: "#D6D1C7" },
];

/** @deprecated Prefer TSHIRT_COLORS — kept for Avatar Studio / legacy imports. */
export const SHIRT_COLORS = TSHIRT_COLORS;

const LIGHT_HEXES = new Set([
  "#ffffff",
  "#f7f7f5",
  "#f7f2e7",
  "#d6d1c7",
  "#8b8b8b",
]);

export function isLightShirtColor(hex: string): boolean {
  const h = hex.toLowerCase();
  if (LIGHT_HEXES.has(h)) return true;
  const m = /^#?([a-f0-9]{6})$/i.exec(h);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  // Relative luminance
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.62;
}

/** Colors shown on product cards / detail selectors. */
export function resolveShirtColors(product?: Product): ProductColor[] {
  void product; // reserved for future per-product palettes
  return TSHIRT_COLORS;
}

/** White-first default for any product. */
export function defaultShirtColor(product?: Product): ProductColor {
  const palette = resolveShirtColors(product);
  const white =
    palette.find(
      (c) =>
        c.id === "white" ||
        c.hex.toLowerCase() === "#ffffff" ||
        c.hex.toLowerCase() === "#f7f7f5",
    ) ?? palette[0];
  return white;
}
