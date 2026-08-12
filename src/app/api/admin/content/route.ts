import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  key: z.string().min(1),
  value: z.record(z.string(), z.unknown()),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ content: [], mode: "demo" });
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("key");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: data ?? [], mode: "database" });
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
    const body = schema.parse(await request.json());
    const { data, error } = await supabase
      .from("site_content")
      .upsert({
        key: body.key,
        value: body.value,
        updated_at: new Date().toISOString(),
        updated_by: auth.userId,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid content payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
