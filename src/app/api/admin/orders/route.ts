import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "ready",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ orders: [], mode: "demo" });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status);
  if (q) query = query.ilike("email", `%${q}%`);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [], mode: "database" });
}

export async function PATCH(request: Request) {
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
    const body = statusSchema.parse(await request.json());
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: body.status,
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.notes) {
      await supabase.from("order_notes").insert({
        order_id: body.id,
        author_id: auth.userId,
        body: body.notes,
      });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid order update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
