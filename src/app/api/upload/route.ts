import { NextResponse } from "next/server";
import { configureCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: Request) {
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

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "ashlar-craftsman/products",
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
