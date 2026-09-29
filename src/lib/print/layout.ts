/**
 * Normalized T-shirt print layout — shared by admin editor and storefront.
 * All placement values are relative (0–1), not pixels.
 *
 * Coordinate system:
 *   mockup box (3:4 photographic tee) → printArea (chest zone) → design (x/y/width)
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
  /** Optional photo mockup; null uses built-in photographic tee */
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

/**
 * Print-safe chest zone for `/mockups/tshirt-front.png` (864×1152, 3:4).
 * Measured from the opaque torso: horizontally centered on the body,
 * below the collar, inside the side seams, above the hem.
 * Tall enough that typical saved placements remap without vertical clamping.
 */
export const DEFAULT_PRINT_AREA: PrintArea = {
  x: 0.31,
  y: 0.26,
  width: 0.38,
  height: 0.34,
};

/** Pre-photographic SVG-era zone — used only for migration detection. */
export const LEGACY_SVG_PRINT_AREA: PrintArea = {
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

export function printAreasEqual(a: PrintArea, b: PrintArea, eps = 1e-4) {
  return (
    Math.abs(a.x - b.x) < eps &&
    Math.abs(a.y - b.y) < eps &&
    Math.abs(a.width - b.width) < eps &&
    Math.abs(a.height - b.height) < eps
  );
}

/**
 * Remap design placement from one print-area template to another while
 * preserving absolute center + width within the mockup box. Keeps storefront
 * artwork from jumping when the chest zone is recalibrated.
 */
export function remapDesignToPrintArea(
  layout: PrintLayout,
  nextPrintArea: PrintArea,
): PrintLayout {
  const from = layout.printArea;
  if (printAreasEqual(from, nextPrintArea)) {
    return { ...layout, printArea: { ...nextPrintArea } };
  }
  if (from.width <= 0 || from.height <= 0) {
    return { ...layout, printArea: { ...nextPrintArea } };
  }

  const aspect = layout.designAspect > 0 ? layout.designAspect : 1;
  const fromHeight = heightFromWidth(layout.width, aspect, from);

  const absCx = from.x + (layout.x + layout.width / 2) * from.width;
  const absCy = from.y + (layout.y + fromHeight / 2) * from.height;
  const absW = layout.width * from.width;

  const width =
    nextPrintArea.width > 0 ? absW / nextPrintArea.width : layout.width;
  const height = heightFromWidth(width, aspect, nextPrintArea);

  return {
    ...layout,
    printArea: { ...nextPrintArea },
    width,
    height,
    x:
      nextPrintArea.width > 0
        ? (absCx - nextPrintArea.x) / nextPrintArea.width - width / 2
        : 0,
    y:
      nextPrintArea.height > 0
        ? (absCy - nextPrintArea.y) / nextPrintArea.height - height / 2
        : 0,
  };
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

/** Keep the design rectangle fully inside the current mockup print-safe zone. */
export function constrainLayout(layout: PrintLayout): PrintLayout {
  const aspect = layout.designAspect > 0 ? layout.designAspect : 1;
  const sourceArea =
    layout.printArea &&
    Number.isFinite(layout.printArea.width) &&
    layout.printArea.width > 0
      ? layout.printArea
      : DEFAULT_PRINT_AREA;

  // Normalize onto the photographic chest zone without moving artwork
  // in absolute mockup space (backward-compatible with saved layouts).
  const normalized = remapDesignToPrintArea(
    { ...layout, printArea: sourceArea, designAspect: aspect },
    DEFAULT_PRINT_AREA,
  );

  const printArea = normalized.printArea;
  let width = clamp(normalized.width, 0.08, 1);
  let height = heightFromWidth(width, aspect, printArea);
  if (height > 1) {
    height = 1;
    width = widthFromHeight(height, aspect, printArea);
  }
  const x = clamp(normalized.x, 0, Math.max(0, 1 - width));
  const y = clamp(normalized.y, 0, Math.max(0, 1 - height));
  return {
    ...normalized,
    x,
    y,
    width,
    height,
    rotation: ((normalized.rotation % 360) + 360) % 360,
    designAspect: aspect,
    printArea: { ...DEFAULT_PRINT_AREA },
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
  const printArea = DEFAULT_PRINT_AREA;
  let width = 0.72;
  let height = heightFromWidth(width, aspect, printArea);
  if (height > 0.85) {
    height = 0.85;
    width = widthFromHeight(height, aspect, printArea);
  }
  return constrainLayout({
    ...layout,
    printArea: { ...printArea },
    x: (1 - width) / 2,
    y: 0.06,
    width,
    height,
    rotation: 0,
  });
}

export function parsePrintLayout(raw: unknown): PrintLayout | null {
  let value: unknown = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
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
      : null;

  // Preserve saved printArea so remap can keep absolute artwork position.
  const printArea: PrintArea = printAreaRaw
    ? {
        x: num(printAreaRaw.x, DEFAULT_PRINT_AREA.x),
        y: num(printAreaRaw.y, DEFAULT_PRINT_AREA.y),
        width: num(printAreaRaw.width, DEFAULT_PRINT_AREA.width),
        height: num(printAreaRaw.height, DEFAULT_PRINT_AREA.height),
      }
    : { ...DEFAULT_PRINT_AREA };

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
