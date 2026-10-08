/** Inline remote <image> hrefs so downloaded SVG/PNG stay self-contained. */

const XLINK_NS = "http://www.w3.org/1999/xlink";

export class SvgImageEmbedError extends Error {
  readonly asset: string;

  constructor(asset: string, cause?: unknown) {
    super(`Failed to embed image asset: ${asset}`);
    this.name = "SvgImageEmbedError";
    this.asset = asset;
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

export function getSvgImageHref(el: SVGImageElement): string {
  return (
    el.getAttribute("href") ||
    el.getAttribute("xlink:href") ||
    el.getAttributeNS(XLINK_NS, "href") ||
    el.href?.baseVal ||
    ""
  );
}

function setSvgImageHref(el: SVGImageElement, href: string) {
  el.removeAttribute("href");
  el.removeAttribute("xlink:href");
  el.removeAttributeNS(XLINK_NS, "href");
  el.setAttribute("href", href);
  el.setAttributeNS(XLINK_NS, "href", href);
}

/** Prefer same-origin public paths so export works even when SITE_URL differs. */
function candidateImageUrls(href: string): string[] {
  if (!href || href.startsWith("data:")) return [];

  const urls: string[] = [];
  const push = (value: string) => {
    if (value && !urls.includes(value)) urls.push(value);
  };

  if (typeof window === "undefined") {
    push(href);
    return urls;
  }

  try {
    if (href.startsWith("//")) {
      push(`${window.location.protocol}${href}`);
    }

    const absolute = href.startsWith("http")
      ? new URL(href)
      : new URL(href, window.location.origin);

    // Same-origin first: AvatarCanvas may stamp NEXT_PUBLIC_SITE_URL absolute
    // hrefs that fail CORS from preview hosts; local /public assets still work.
    push(`${window.location.origin}${absolute.pathname}${absolute.search}`);
    push(absolute.toString());
    push(href);
  } catch {
    push(href);
  }

  return urls;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(src: string): Promise<string> {
  const res = await fetch(src, { mode: "cors", credentials: "omit" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${src}`);
  return blobToDataUrl(await res.blob());
}

/** Canvas fallback when fetch is blocked but the image can still decode. */
function decodeImageAsDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        if (!canvas.width || !canvas.height) {
          reject(new Error(`Empty image dimensions for ${src}`));
          return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`Image decode failed for ${src}`));
    img.src = src;
  });
}

async function embedHrefAsDataUrl(href: string): Promise<string> {
  const candidates = candidateImageUrls(href);
  let lastError: unknown;

  for (const src of candidates) {
    try {
      return await fetchAsDataUrl(src);
    } catch (err) {
      lastError = err;
    }
  }

  for (const src of candidates) {
    try {
      return await decodeImageAsDataUrl(src);
    } catch (err) {
      lastError = err;
    }
  }

  throw new SvgImageEmbedError(href, lastError);
}

/**
 * Convert every non-data <image> href/xlink:href into an embedded data URL.
 * Throws SvgImageEmbedError if any asset cannot be embedded — never leaves
 * external / absolute URLs that break offline or file:// viewers.
 */
export async function inlineSvgImages(svg: SVGElement) {
  const images = Array.from(svg.querySelectorAll("image")) as SVGImageElement[];

  for (const el of images) {
    const href = getSvgImageHref(el);
    if (!href || href.startsWith("data:")) continue;
    const dataUrl = await embedHrefAsDataUrl(href);
    setSvgImageHref(el, dataUrl);
  }

  assertSvgImagesEmbedded(svg);
}

export function assertSvgImagesEmbedded(svg: SVGElement) {
  const images = Array.from(svg.querySelectorAll("image")) as SVGImageElement[];
  for (const el of images) {
    const href = getSvgImageHref(el);
    if (!href) {
      throw new SvgImageEmbedError("(empty image href)");
    }
    if (!href.startsWith("data:")) {
      throw new SvgImageEmbedError(href);
    }
  }
}

export async function downloadSvgElement(svg: SVGElement, filename: string) {
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  await inlineSvgImages(clone);
  const blob = new Blob(
    [`<?xml version="1.0" encoding="UTF-8"?>${clone.outerHTML}`],
    { type: "image/svg+xml;charset=utf-8" },
  );
  triggerDownload(blob, filename.endsWith(".svg") ? filename : `${filename}.svg`);
}

/** Rasterize an SVG element to a transparent PNG. */
export async function downloadSvgAsPng(
  svg: SVGElement,
  filename: string,
  scale = 2,
) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  await inlineSvgImages(clone);

  const viewBox = clone.viewBox.baseVal;
  const width = viewBox.width || Number(clone.getAttribute("width")) || 360;
  const height = viewBox.height || Number(clone.getAttribute("height")) || 420;

  const blob = new Blob(
    [`<?xml version="1.0" encoding="UTF-8"?>${clone.outerHTML}`],
    { type: "image/svg+xml;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!png) throw new Error("PNG export failed");
    triggerDownload(
      png,
      filename.endsWith(".png") ? filename : `${filename}.png`,
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load SVG for export"));
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
