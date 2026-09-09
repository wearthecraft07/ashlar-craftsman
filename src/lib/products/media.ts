/**
 * Product media resolution — future-proof photography convention.
 *
 * Expected asset layout (when photography is ready):
 *   public/products/{slug}/front.jpg
 *   public/products/{slug}/back.jpg
 *   public/products/{slug}/detail.jpg
 *   public/products/{slug}/worn.jpg
 *
 * Or via Product.images ordered as [front, back?, detail?, worn?].
 * Until real photos exist, the UI uses consistent mock presentation.
 */

import type { Product } from "@/types";

export type ProductMediaView = "front" | "back" | "detail" | "worn";

export type ProductMediaSlot = {
  view: ProductMediaView;
  label: string;
  /** Real photo URL when available */
  src: string | null;
  /** mock = SVG presentation; photo = real asset; placeholder = soft coming-soon */
  kind: "mock" | "photo" | "placeholder";
  available: boolean;
};

const VIEW_LABELS: Record<ProductMediaView, string> = {
  front: "Front",
  back: "Back",
  detail: "Detail",
  worn: "Worn",
};

const PHOTO_EXT = /\.(jpe?g|png|webp|avif)$/i;

function isUsablePhoto(src: string | undefined): src is string {
  if (!src) return false;
  if (src.includes("shirt-mark")) return false;
  if (src.includes("/products/") && src.endsWith(".svg")) return false;
  return PHOTO_EXT.test(src);
}

/**
 * Resolve which gallery views to show.
 * Never invent photography — only enable photo slots when assets exist.
 */
export function resolveProductMedia(product: Product): ProductMediaSlot[] {
  const images = product.images ?? [];
  const frontPhoto = isUsablePhoto(images[0]) ? images[0] : null;
  const backPhoto = isUsablePhoto(images[1]) ? images[1] : null;
  const detailPhoto = isUsablePhoto(images[2]) ? images[2] : null;
  const wornPhoto = isUsablePhoto(images[3]) ? images[3] : null;

  const slots: ProductMediaSlot[] = [
    {
      view: "front",
      label: VIEW_LABELS.front,
      src: frontPhoto,
      kind: frontPhoto ? "photo" : "mock",
      available: true,
    },
    {
      view: "back",
      label: VIEW_LABELS.back,
      src: backPhoto,
      kind: backPhoto ? "photo" : "placeholder",
      available: Boolean(backPhoto),
    },
    {
      view: "detail",
      label: VIEW_LABELS.detail,
      src: detailPhoto,
      // Detail always available as design close-up (mock) or real photo
      kind: detailPhoto ? "photo" : "mock",
      available: true,
    },
    {
      view: "worn",
      label: VIEW_LABELS.worn,
      src: wornPhoto,
      kind: wornPhoto ? "photo" : "placeholder",
      // Soft placeholder — available so architecture is ready, but UI treats kindly
      available: Boolean(wornPhoto),
    },
  ];

  return slots;
}

export function availableGalleryViews(product: Product): ProductMediaSlot[] {
  return resolveProductMedia(product).filter((s) => s.available);
}

export function supportsAvatarWear(product: Product): boolean {
  return (
    product.category === "custom" ||
    product.tags.includes("avatar") ||
    product.tags.includes("studio")
  );
}
