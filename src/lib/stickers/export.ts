import { inlineSvgImages } from "@/lib/avatar/exportSvg";
import type { StickerDefinition } from "@/types/stickers";
import { slugify } from "@/lib/utils";

/**
 * Compose a flat export SVG from the live sticker stage:
 * backdrop SVG + avatar SVG (nested) + caption text.
 */
export async function exportStickerFromStage(
  stage: HTMLElement,
  sticker: StickerDefinition,
  format: "png" | "svg" = "png",
) {
  const backdrop = stage.querySelector("svg");
  const avatar = stage.querySelector(
    "[data-sticker-avatar] svg",
  ) as SVGElement | null;
  if (!backdrop || !avatar) {
    throw new Error("Sticker stage missing SVG layers");
  }

  const backdropClone = backdrop.cloneNode(true) as SVGElement;
  const avatarClone = avatar.cloneNode(true) as SVGElement;
  await inlineSvgImages(avatarClone);

  const caption = sticker.text
    ? sticker.text
        .split("\n")
        .map((line, index, lines) => {
          const y = lines.length === 1 ? 404 : index === 0 ? 394 : 414;
          return `<text x="180" y="${y}" text-anchor="middle" fill="#F7F4EE" font-family="Syne, sans-serif" font-size="13" font-weight="700" letter-spacing="0.08em">${escapeXml(line)}</text>`;
        })
        .join("")
    : "";

  const captionBg = sticker.text
    ? `<rect x="30" y="372" width="300" height="52" rx="16" fill="#0F1C2E" opacity="0.92"/><rect x="30" y="372" width="300" height="52" rx="16" fill="none" stroke="#C9A227" stroke-width="2"/>`
    : "";

  const avatarInner = avatarClone.innerHTML;
  const backdropInner = backdropClone.innerHTML;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 360 440" width="360" height="440">
  ${backdropInner}
  <svg x="40" y="12" width="280" height="360" viewBox="0 0 280 360">
    ${avatarInner}
  </svg>
  ${captionBg}
  ${caption}
</svg>`;

  const filename = slugify(sticker.name) || sticker.id;

  if (format === "svg") {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(blob, `${filename}.svg`);
    return;
  }

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 880;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!png) throw new Error("PNG export failed");
    triggerDownload(png, `${filename}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
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
