/**
 * Normalized T-shirt print layout — shared by admin editor and storefront.
 * All placement values are relative (0–1), not pixels.
 */

export type PrintArea = {
  /** Left of print area as fraction of mockup width */
  x: number;
  /** Top of print area as fraction of mockup height */
  y: number;
  width: number;
  height: number;
};

export type PrintLayout = {
  /** Transparent PNG design URL (Cloudinary or local) */
  designUrl: string | null;
  /** Optional photo mockup; null uses built-in SVG tee */
  mockupUrl: string | null;
  /** Design top-left within the print area (0–1) */
  x: number;
  y: number;
  /** Design width as fraction of print-area width */
  width: number;
  /** Design height as fraction of print-area height */
  height: number;
  /** Degrees clockwise */
  rotation: number;
  printArea: PrintArea;
  /** Natural image width / height */
  designAspect: number;
};

export const DEFAULT_PRINT_AREA: PrintArea = {
  x: 0.3,
  y: 0.436,
  width: 0.4,
  height: 0.382,
};

export const DEFAULT_PRINT_LAYOUT: PrintLayout = {
  designUrl: null,
  mockupUrl: null,
  x: 0.12,
  y: 0.08,
  width: 0.76,
  height: 0.76,
  rotation: 0,
  printArea: { ...DEFAULT_PRINT_AREA },
  designAspect: 1,
};

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Height in print-area units for a given width + natural aspect. */
export function heightFromWidth(
  width: number,
  designAspect: number,
  printArea: PrintArea,
) {
  if (!designAspect || designAspect <= 0) return width;
  // Convert: width is frac of print W; need height as frac of print H
  // pixelAspect = (width * printW) / (height * printH) = designAspect
  // height = (width * printW) / (designAspect * printH)
  const printAspect = printArea.width / printArea.height;
  return (width * printAspect) / designAspect;
}

export function widthFromHeight(
  height: number,
  designAspect: number,
  printArea: PrintArea,
) {
  if (!designAspect || designAspect <= 0) return height;
  const printAspect = printArea.width / printArea.height;
  return (height * designAspect) / printAspect;
}

/** Keep the design rectangle fully inside the print area. */
export function constrainLayout(layout: PrintLayout): PrintLayout {
  const aspect = layout.designAspect > 0 ? layout.designAspect : 1;
  let width = clamp(layout.width, 0.08, 1);
  let height = heightFromWidth(width, aspect, layout.printArea);
  if (height > 1) {
    height = 1;
    width = widthFromHeight(height, aspect, layout.printArea);
  }
  const x = clamp(layout.x, 0, Math.max(0, 1 - width));
  const y = clamp(layout.y, 0, Math.max(0, 1 - height));
  return {
    ...layout,
    x,
    y,
    width,
    height,
    rotation: ((layout.rotation % 360) + 360) % 360,
    designAspect: aspect,
    printArea: { ...DEFAULT_PRINT_AREA, ...layout.printArea },
  };
}

export function layoutWithAspect(
  layout: PrintLayout,
  designAspect: number,
): PrintLayout {
  return constrainLayout({ ...layout, designAspect });
}

export function resetPlacement(layout: PrintLayout): PrintLayout {
  const aspect = layout.designAspect > 0 ? layout.designAspect : 1;
  let width = 0.72;
  let height = heightFromWidth(width, aspect, layout.printArea);
  if (height > 0.85) {
    height = 0.85;
    width = widthFromHeight(height, aspect, layout.printArea);
  }
  return constrainLayout({
    ...layout,
    x: (1 - width) / 2,
    y: 0.06,
    width,
    height,
    rotation: 0,
  });
}

export function parsePrintLayout(raw: unknown): PrintLayout | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const designUrl =
    typeof o.designUrl === "string" && o.designUrl.trim()
      ? o.designUrl.trim()
      : null;
  if (!designUrl) {
    // Empty layout is valid (cleared design)
    if (o.designUrl === null || o.designUrl === "") {
      return { ...DEFAULT_PRINT_LAYOUT, designUrl: null };
    }
    return null;
  }

  const printAreaRaw =
    o.printArea && typeof o.printArea === "object"
      ? (o.printArea as Record<string, unknown>)
      : {};

  const printArea: PrintArea = {
    x: num(printAreaRaw.x, DEFAULT_PRINT_AREA.x),
    y: num(printAreaRaw.y, DEFAULT_PRINT_AREA.y),
    width: num(printAreaRaw.width, DEFAULT_PRINT_AREA.width),
    height: num(printAreaRaw.height, DEFAULT_PRINT_AREA.height),
  };

  return constrainLayout({
    designUrl,
    mockupUrl:
      typeof o.mockupUrl === "string" && o.mockupUrl.trim()
        ? o.mockupUrl.trim()
        : null,
    x: num(o.x, DEFAULT_PRINT_LAYOUT.x),
    y: num(o.y, DEFAULT_PRINT_LAYOUT.y),
    width: num(o.width, DEFAULT_PRINT_LAYOUT.width),
    height: num(o.height, DEFAULT_PRINT_LAYOUT.height),
    rotation: num(o.rotation, 0),
    printArea,
    designAspect: num(o.designAspect, 1),
  });
}

function num(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** CSS % boxes relative to the mockup container. */
export function designBoxStyle(layout: PrintLayout): {
  left: string;
  top: string;
  width: string;
  height: string;
  transform: string;
} {
  const pa = layout.printArea;
  return {
    left: `${(pa.x + layout.x * pa.width) * 100}%`,
    top: `${(pa.y + layout.y * pa.height) * 100}%`,
    width: `${layout.width * pa.width * 100}%`,
    height: `${layout.height * pa.height * 100}%`,
    transform: `rotate(${layout.rotation}deg)`,
  };
}

export function printAreaStyle(area: PrintArea): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: `${area.x * 100}%`,
    top: `${area.y * 100}%`,
    width: `${area.width * 100}%`,
    height: `${area.height * 100}%`,
  };
}
