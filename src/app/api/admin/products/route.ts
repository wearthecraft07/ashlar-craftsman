import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { mapDbProduct, type DbProduct } from "@/lib/catalog/map-product";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  price: z.number().int().nonnegative(),
  sale_price: z.number().int().nonnegative().nullable().optional(),
  sku: z.string().nullable().optional(),
  category: z.string().min(1),
  category_id: z.string().uuid().nullable().optional(),
  colors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        hex: z.string(),
      }),
    )
    .default([]),
  sizes: z.array(z.string()).default(["S", "M", "L", "XL"]),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  best_seller: z.boolean().default(false),
  inventory: z.number().int().nonnegative().default(0),
  low_stock_threshold: z.number().int().nonnegative().default(5),
  status: z
    .enum(["draft", "published", "out_of_stock", "archived"])
    .default("draft"),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      products: [],
      mode: "demo",
      message: "Supabase not configured.",
    });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: ((data ?? []) as DbProduct[]).map(mapDbProduct),
    mode: "database",
  });
}

export async function POST(request: Request) {
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
    const body = productSchema.parse(await request.json());
    const { id, ...rest } = body;

    if (id) {
      const { data, error } = await supabase
        .from("products")
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ product: mapDbProduct(data as DbProduct) });
    }

    const { data, error } = await supabase
      .from("products")
      .insert(rest)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: mapDbProduct(data as DbProduct) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid product payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
