import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

const itemSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid(),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  asset_url: z.string().nullable().optional(),
  meta: z.record(z.string(), z.unknown()).default({}),
  layer_order: z.number().int().nullable().optional(),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  price: z.number().int().nonnegative().nullable().optional(),
  product_id: z.string().uuid().nullable().optional(),
});

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(1),
  name: z.string().min(1),
  layer_order: z.number().int().default(0),
  sort_order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      categories: [],
      items: [],
      mode: "demo",
    });
  }

  const [categories, items] = await Promise.all([
    supabase
      .from("avatar_categories")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("avatar_items")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  if (categories.error || items.error) {
    return NextResponse.json(
      { error: categories.error?.message || items.error?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    categories: categories.data ?? [],
    items: items.data ?? [],
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
    const json = await request.json();
    if (json.entity === "category") {
      const body = categorySchema.parse(json.data);
      const { id, ...rest } = body;
      if (id) {
        const { data, error } = await supabase
          .from("avatar_categories")
          .update(rest)
          .eq("id", id)
          .select("*")
          .single();
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ category: data });
      }
      const { data, error } = await supabase
        .from("avatar_categories")
        .insert(rest)
        .select("*")
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ category: data });
    }

    const body = itemSchema.parse(json.data ?? json);
    const { id, ...rest } = body;
    if (id) {
      const { data, error } = await supabase
        .from("avatar_items")
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ item: data });
    }

    const { data, error } = await supabase
      .from("avatar_items")
      .insert(rest)
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ item: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid avatar payload";
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
  const entity = searchParams.get("entity") || "item";
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const table = entity === "category" ? "avatar_categories" : "avatar_items";
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
