import { PRODUCTS, SHIRT_COLORS } from "@/data/products";
import type { Product, ProductColor } from "@/types";

export type ApparelStyleId = "tee" | "long-sleeve" | "hoodie";

export type ApparelStyle = {
  id: ApparelStyleId;
  label: string;
  /** Maps to an existing catalog product when available. */
  productId: string;
  enabled: boolean;
};

/**
 * Apparel applications for sticker designs.
 * Only styles with a live catalog product are enabled.
 */
export const APPAREL_STYLES: ApparelStyle[] = [
  {
    id: "tee",
    label: "T-Shirt",
    productId: "prod_avatar_custom",
    enabled: true,
  },
  {
    id: "long-sleeve",
    label: "Long Sleeve",
    productId: "prod_avatar_custom",
    enabled: false,
  },
  {
    id: "hoodie",
    label: "Hoodie",
    productId: "prod_avatar_custom",
    enabled: false,
  },
];

export type DesignPlacementId =
  | "center-chest"
  | "left-chest"
  | "upper-back"
  | "full-back";

export type DesignSizeId = "small" | "medium" | "large";

export const DESIGN_PLACEMENTS: {
  id: DesignPlacementId;
  label: string;
  side: "front" | "back";
}[] = [
  { id: "center-chest", label: "Center Chest", side: "front" },
  { id: "left-chest", label: "Left Chest", side: "front" },
  { id: "upper-back", label: "Upper Back", side: "back" },
  { id: "full-back", label: "Full Back", side: "back" },
];

export const DESIGN_SIZES: {
  id: DesignSizeId;
  label: string;
  /** Relative print scale on mockup (0–1 of garment width). */
  scale: number;
  /** Approx print width in inches for fulfillment notes. */
  printWidthIn: number;
}[] = [
  { id: "small", label: "Small", scale: 0.22, printWidthIn: 4 },
  { id: "medium", label: "Medium", scale: 0.34, printWidthIn: 8 },
  { id: "large", label: "Large", scale: 0.46, printWidthIn: 11 },
];

export function enabledApparelStyles() {
  return APPAREL_STYLES.filter((s) => s.enabled);
}

export function getApparelProduct(styleId: ApparelStyleId): Product | null {
  const style = APPAREL_STYLES.find((s) => s.id === styleId && s.enabled);
  if (!style) return null;
  return PRODUCTS.find((p) => p.id === style.productId) ?? null;
}

export function colorsForApparel(styleId: ApparelStyleId): ProductColor[] {
  const product = getApparelProduct(styleId);
  return product?.colors?.length ? product.colors : SHIRT_COLORS;
}

export function sizesForApparel(styleId: ApparelStyleId): string[] {
  const product = getApparelProduct(styleId);
  return product?.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
}

/** Mockup layout for placing the design on the garment SVG. */
export function placementLayout(
  placement: DesignPlacementId,
  designSize: DesignSizeId,
) {
  const size = DESIGN_SIZES.find((s) => s.id === designSize) ?? DESIGN_SIZES[1];
  const base = {
    width: 320 * size.scale,
    height: 320 * size.scale,
  };

  switch (placement) {
    case "left-chest":
      return { ...base, x: 168, y: 118, width: base.width * 0.72, height: base.height * 0.72 };
    case "upper-back":
      return { ...base, x: 160 - base.width / 2, y: 100 };
    case "full-back":
      return {
        x: 160 - (base.width * 1.15) / 2,
        y: 108,
        width: base.width * 1.15,
        height: base.height * 1.15,
      };
    case "center-chest":
    default:
      return { ...base, x: 160 - base.width / 2, y: 130 };
  }
}
