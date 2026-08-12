import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const supabase = createServiceClient() ?? (await createClient());

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        mode: "demo",
        message: "Subscribed locally (Supabase not configured).",
      });
    }

    const { error } = await supabase.from("newsletter_subscribers").upsert(
      { email: body.email.toLowerCase() },
      { onConflict: "email" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, mode: "database" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid email";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
