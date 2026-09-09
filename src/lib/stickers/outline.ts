/**
 * Expand opaque silhouette with a white outline (collectible sticker look).
 * Operates on ImageData in-place style: returns a new canvas.
 */
export function applyStickerOutline(
  source: HTMLCanvasElement,
  outlineWidth = 14,
  outlineColor = { r: 255, g: 252, b: 245, a: 255 },
): HTMLCanvasElement {
  const w = source.width;
  const h = source.height;
  const srcCtx = source.getContext("2d");
  if (!srcCtx) return source;

  const src = srcCtx.getImageData(0, 0, w, h);
  const mask = new Uint8Array(w * h);
  const alphaThreshold = 24;

  for (let i = 0; i < mask.length; i++) {
    mask[i] = src.data[i * 4 + 3] > alphaThreshold ? 1 : 0;
  }

  const outline = new Uint8Array(w * h);
  const radius = Math.max(1, Math.round(outlineWidth));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const ni = ny * w + nx;
          if (!mask[ni]) outline[ni] = 1;
        }
      }
    }
  }

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const outCtx = out.getContext("2d");
  if (!outCtx) return source;

  const image = outCtx.createImageData(w, h);
  for (let i = 0; i < outline.length; i++) {
    if (!outline[i]) continue;
    const p = i * 4;
    image.data[p] = outlineColor.r;
    image.data[p + 1] = outlineColor.g;
    image.data[p + 2] = outlineColor.b;
    image.data[p + 3] = outlineColor.a;
  }
  outCtx.putImageData(image, 0, 0);
  outCtx.drawImage(source, 0, 0);
  return out;
}

/** Tight crop to opaque content with padding. */
export function cropToContent(
  source: HTMLCanvasElement,
  padding = 24,
): HTMLCanvasElement {
  const ctx = source.getContext("2d");
  if (!ctx) return source;
  const { width: w, height: h } = source;
  const data = ctx.getImageData(0, 0, w, h).data;

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return source;

  const left = Math.max(0, minX - padding);
  const top = Math.max(0, minY - padding);
  const right = Math.min(w, maxX + padding + 1);
  const bottom = Math.min(h, maxY + padding + 1);
  const cw = right - left;
  const ch = bottom - top;

  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  const outCtx = out.getContext("2d");
  if (!outCtx) return source;
  outCtx.drawImage(source, left, top, cw, ch, 0, 0, cw, ch);
  return out;
}
