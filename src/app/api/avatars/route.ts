import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const avatarSchema = z.object({
  name: z.string().min(1),
  config: z.record(z.string(), z.string()),
  shirtColor: z.string(),
});

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      avatars: [],
      mode: "local",
      message: "Supabase not configured — use localStorage in the studio.",
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ avatars: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      saved: true,
      mode: "local",
      message: "Supabase not configured — persist via localStorage client-side.",
    });
  }

  try {
    const body = avatarSchema.parse(await request.json());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("avatars")
      .upsert({
        user_id: user.id,
        name: body.name,
        config: body.config,
        shirt_color: body.shirtColor,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ avatar: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid avatar payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
