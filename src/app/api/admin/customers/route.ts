import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ customers: [], mode: "demo" });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim();

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, role, disabled, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
  }

  const { data: profiles, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const emails = (profiles ?? [])
    .map((p) => p.email)
    .filter(Boolean) as string[];

  const { data: orders } = emails.length
    ? await supabase.from("orders").select("id, email, total, status, user_id")
    : { data: [] };

  const customers = (profiles ?? []).map((profile) => {
    const related = (orders ?? []).filter(
      (order) =>
        order.user_id === profile.id ||
        (profile.email && order.email === profile.email),
    );
    return {
      ...profile,
      orderCount: related.length,
      lifetimeValue: related.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0,
      ),
    };
  });

  return NextResponse.json({ customers, mode: "database" });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  disabled: z.boolean(),
});

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Only super admins should disable accounts (or admins for customers only)
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 503 },
    );
  }

  try {
    const body = patchSchema.parse(await request.json());

    const { data: target } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", body.id)
      .maybeSingle();

    if (!target) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }

    if (
      (target.role === "admin" || target.role === "super_admin") &&
      auth.profile.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "Only super admins can modify admin accounts." },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ disabled: body.disabled, updated_at: new Date().toISOString() })
      .eq("id", body.id)
      .select("id, email, full_name, role, disabled, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ customer: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid customer update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
