import { inlineSvgImages } from "@/lib/avatar/exportSvg";
import {
  applyStickerOutline,
  cropToContent,
} from "@/lib/stickers/outline";
import { slugify } from "@/lib/utils";
import type { StickerDefinition } from "@/types/stickers";

const EXPORT_SIZE = 1024;

/**
 * Export sticker from live stage:
 * 1) compose SVG layers
 * 2) rasterize
 * 3) expand silhouette outline
 * 4) crop + download PNG (or raw SVG without outline)
 */
export async function exportStickerFromStage(
  stage: HTMLElement,
  sticker: StickerDefinition,
  format: "png" | "svg" = "png",
) {
  const svgMarkup = await buildComposedSvg(stage, sticker);
  const filename = slugify(sticker.name) || sticker.id;

  if (format === "svg") {
    const blob = new Blob([svgMarkup], {
      type: "image/svg+xml;charset=utf-8",
    });
    triggerDownload(blob, `${filename}.svg`);
    return;
  }

  const blob = new Blob([svgMarkup], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_SIZE;
    canvas.height = EXPORT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.clearRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
    ctx.drawImage(img, 0, 0, EXPORT_SIZE, EXPORT_SIZE);

    const outlined = applyStickerOutline(canvas, Math.round(EXPORT_SIZE * 0.028));
    const cropped = cropToContent(outlined, Math.round(EXPORT_SIZE * 0.04));

    // Fit into square export canvas with transparent padding
    const square = document.createElement("canvas");
    square.width = EXPORT_SIZE;
    square.height = EXPORT_SIZE;
    const sq = square.getContext("2d");
    if (!sq) throw new Error("Canvas unavailable");
    const scale = Math.min(
      (EXPORT_SIZE * 0.92) / cropped.width,
      (EXPORT_SIZE * 0.92) / cropped.height,
    );
    const dw = cropped.width * scale;
    const dh = cropped.height * scale;
    sq.clearRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
    sq.drawImage(
      cropped,
      (EXPORT_SIZE - dw) / 2,
      (EXPORT_SIZE - dh) / 2,
      dw,
      dh,
    );

    const png = await new Promise<Blob | null>((resolve) =>
      square.toBlob(resolve, "image/png"),
    );
    if (!png) throw new Error("PNG export failed");
    triggerDownload(png, `${filename}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function buildComposedSvg(
  stage: HTMLElement,
  sticker: StickerDefinition,
) {
  const decor = stage.querySelector(
    "[data-sticker-decor]",
  ) as SVGElement | null;
  const foreground = stage.querySelector(
    "[data-sticker-foreground]",
  ) as SVGElement | null;
  const avatar = stage.querySelector(
    "[data-sticker-avatar] svg",
  ) as SVGElement | null;

  if (!avatar) throw new Error("Sticker avatar SVG missing");

  const avatarClone = avatar.cloneNode(true) as SVGElement;
  await inlineSvgImages(avatarClone);

  const decorInner = decor ? (decor.cloneNode(true) as SVGElement).innerHTML : "";
  const foregroundInner = foreground
    ? (foreground.cloneNode(true) as SVGElement).innerHTML
    : "";
  const avatarInner = avatarClone.innerHTML;
  const text = sticker.composition.text;
  const caption = text
    ? text
        .split("\n")
        .map((line, index, lines) => {
          const y = lines.length === 1 ? 328 : index === 0 ? 318 : 338;
          return `<text x="180" y="${y}" text-anchor="middle" fill="#F7F4EE" font-family="Syne, sans-serif" font-size="14" font-weight="700" letter-spacing="0.1em">${escapeXml(line)}</text>`;
        })
        .join("")
    : "";
  const captionBg = text
    ? `<rect x="28" y="298" width="304" height="52" rx="16" fill="#0F1C2E" opacity="0.94"/><rect x="28" y="298" width="304" height="52" rx="16" fill="none" stroke="#C9A227" stroke-width="2"/>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 360 360" width="360" height="360">
  ${decorInner}
  <svg x="36" y="8" width="288" height="300" viewBox="0 0 280 360">
    ${avatarInner}
  </svg>
  ${foregroundInner}
  ${captionBg}
  ${caption}
</svg>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to rasterize sticker"));
    img.src = url;
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
