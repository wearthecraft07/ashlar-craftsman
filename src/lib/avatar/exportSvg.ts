/** Inline remote <image> hrefs so downloaded SVG/PNG stay self-contained. */
export async function inlineSvgImages(svg: SVGElement) {
  const images = Array.from(svg.querySelectorAll("image"));
  await Promise.all(
    images.map(async (image) => {
      const el = image as SVGImageElement;
      const href =
        el.getAttribute("href") ||
        el.getAttribute("xlink:href") ||
        el.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
        el.href?.baseVal ||
        "";
      if (!href || href.startsWith("data:")) return;
      try {
        const src = href.startsWith("http")
          ? href
          : new URL(href, window.location.origin).toString();
        const res = await fetch(src, { mode: "cors", credentials: "omit" });
        if (!res.ok) return;
        const blob = await res.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        el.removeAttribute("href");
        el.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
        el.setAttribute("href", dataUrl);
        el.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataUrl);
      } catch {
        // Keep original href.
      }
    }),
  );
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
