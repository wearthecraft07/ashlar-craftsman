import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { mapDbProduct, type DbProduct } from "@/lib/catalog/map-product";
import {
  constrainLayout,
  DEFAULT_PRINT_LAYOUT,
  parsePrintLayout,
  type PrintLayout,
} from "@/lib/print/layout";
import { createClient } from "@/lib/supabase/server";

const printAreaSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const layoutSchema = z.object({
  designUrl: z.string().nullable(),
  mockupUrl: z.string().nullable(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number(),
  printArea: printAreaSchema,
  designAspect: z.number().positive(),
});

const bodySchema = z.object({
  productId: z.string().uuid(),
  layout: layoutSchema.nullable(),
});

function toStored(layout: PrintLayout | null) {
  if (!layout || !layout.designUrl) {
    return null;
  }
  const c = constrainLayout(layout);
  return {
    designUrl: c.designUrl,
    mockupUrl: c.mockupUrl,
    x: c.x,
    y: c.y,
    width: c.width,
    height: c.height,
    rotation: c.rotation,
    printArea: c.printArea,
    designAspect: c.designAspect,
  };
}

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    const raw = error.message || "Load failed";
    const missingColumn =
      /print_layout/i.test(raw) &&
      /(schema cache|does not exist|could not find)/i.test(raw);
    if (missingColumn) {
      return NextResponse.json(
        {
          error:
            "print_layout is missing from the API schema cache. In Supabase SQL Editor run: NOTIFY pgrst, 'reload schema';",
          code: "pending_schema",
          details: raw,
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: raw }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = mapDbProduct(data as DbProduct);
  return NextResponse.json({
    product,
    layout: product.printLayout ?? { ...DEFAULT_PRINT_LAYOUT },
  });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 503 },
    );
  }

  try {
    const body = bodySchema.parse(await request.json());
    const layout = body.layout
      ? constrainLayout({
          ...body.layout,
          designUrl: body.layout.designUrl?.trim() || null,
          mockupUrl: body.layout.mockupUrl?.trim() || null,
        })
      : null;

    // Allow explicit clear via null layout or empty designUrl
    const stored = toStored(layout);

    const { data, error } = await supabase
      .from("products")
      .update({
        print_layout: stored,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.productId)
      .select("*")
      .single();

    if (error) {
      const raw = error.message || "Update failed";
      const missingColumn =
        /print_layout/i.test(raw) &&
        /(schema cache|does not exist|could not find)/i.test(raw);
      if (missingColumn) {
        return NextResponse.json(
          {
            error:
              "print_layout is missing from the API schema cache. In Supabase SQL Editor run: NOTIFY pgrst, 'reload schema'; then retry Save. If that fails, run: alter table public.products add column if not exists print_layout jsonb;",
            code: "pending_schema",
            details: raw,
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: raw }, { status: 500 });
    }

    const product = mapDbProduct(data as DbProduct);

    // Product pages are statically generated — bust cache so storefront updates.
    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
    revalidatePath("/");

    return NextResponse.json({
      product,
      layout: product.printLayout ?? parsePrintLayout(stored) ?? DEFAULT_PRINT_LAYOUT,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid print layout payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
