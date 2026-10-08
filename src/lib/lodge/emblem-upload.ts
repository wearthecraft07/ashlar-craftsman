/** Client-side Lodge emblem upload validation (Concept Preview only). */

export const EMBLEM_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const EMBLEM_ACCEPT =
  "image/png,image/svg+xml,image/jpeg,.png,.svg,.jpg,.jpeg";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/svg+xml",
  "image/jpeg",
  "image/jpg",
]);

const ALLOWED_EXT = new Set([".png", ".svg", ".jpg", ".jpeg"]);

function extensionOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

/** Returns an error message, or null when the file is acceptable. */
export function validateEmblemFile(file: File): string | null {
  if (!file || file.size <= 0) {
    return "Choose a Lodge emblem file to upload.";
  }
  if (file.size > EMBLEM_MAX_BYTES) {
    return "Emblem file is too large. Please use an image under 5 MB.";
  }

  const ext = extensionOf(file.name);
  const mimeOk = file.type ? ALLOWED_MIME.has(file.type.toLowerCase()) : false;
  const extOk = ALLOWED_EXT.has(ext);

  if (!mimeOk && !extOk) {
    return "Unsupported file type. Use PNG, SVG, or JPG.";
  }

  return null;
}
