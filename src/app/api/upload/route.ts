import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { configureCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024;
const PNG_MAX_BYTES = 5 * 1024 * 1024;
const PNG_MIN_DIM = 64;
const PNG_MAX_DIM = 4000;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function readPngDimensions(buffer: Buffer): { width: number; height: number } | null {
  // PNG signature + IHDR chunk
  if (buffer.length < 24) return null;
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== sig[i]) return null;
  }
  // IHDR length at 8, type "IHDR" at 12
  if (buffer.toString("ascii", 12, 16) !== "IHDR") return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add cloud name and API credentials.",
      },
      { status: 501 },
    );
  }

  const cloudinary = configureCloudinary();
  if (!cloudinary) {
    return NextResponse.json(
      { error: "Cloudinary unavailable" },
      { status: 500 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = form.get("folder");
    const pngOnly =
      form.get("pngOnly") === "1" ||
      form.get("pngOnly") === "true" ||
      form.get("purpose") === "print-design";
    const folder =
      typeof folderRaw === "string" && folderRaw.trim()
        ? folderRaw.trim().replace(/[^a-zA-Z0-9/_-]/g, "")
        : pngOnly
          ? "ashlar-craftsman/print-designs"
          : "ashlar-craftsman/products";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (pngOnly) {
      const nameOk = file.name.toLowerCase().endsWith(".png");
      if (file.type !== "image/png" && !nameOk) {
        return NextResponse.json(
          {
            error:
              "Only transparent PNG files are allowed for print designs. Please upload a .png.",
          },
          { status: 400 },
        );
      }
      if (file.size > PNG_MAX_BYTES) {
        return NextResponse.json(
          { error: "Print design PNG must be 5MB or smaller." },
          { status: 400 },
        );
      }
    } else {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "Only JPEG, PNG, WebP, or GIF images are allowed." },
          { status: 400 },
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "Image must be 8MB or smaller." },
          { status: 400 },
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let width: number | undefined;
    let height: number | undefined;

    if (pngOnly || file.type === "image/png") {
      const dims = readPngDimensions(buffer);
      if (pngOnly) {
        if (!dims) {
          return NextResponse.json(
            {
              error:
                "That file does not look like a valid PNG. Export a PNG with transparency and try again.",
            },
            { status: 400 },
          );
        }
        if (
          dims.width < PNG_MIN_DIM ||
          dims.height < PNG_MIN_DIM ||
          dims.width > PNG_MAX_DIM ||
          dims.height > PNG_MAX_DIM
        ) {
          return NextResponse.json(
            {
              error: `PNG dimensions must be between ${PNG_MIN_DIM}×${PNG_MIN_DIM} and ${PNG_MAX_DIM}×${PNG_MAX_DIM}px (got ${dims.width}×${dims.height}).`,
            },
            { status: 400 },
          );
        }
        width = dims.width;
        height = dims.height;
      } else if (dims) {
        width = dims.width;
        height = dims.height;
      }
    }

    const mime = pngOnly ? "image/png" : file.type;
    const base64 = `data:${mime};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      // Keep alpha channel for print designs
      ...(pngOnly ? { resource_type: "image" as const } : {}),
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: width ?? result.width,
      height: height ?? result.height,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
