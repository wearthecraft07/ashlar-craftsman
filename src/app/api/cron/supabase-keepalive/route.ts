import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Supabase free-tier keep-alive.
 *
 * Free projects pause after ~7 days without database activity. Visiting the
 * storefront alone may not hit PostgREST every day (ISR/static caching).
 * This route issues a tiny read-only SELECT so Supabase sees real DB usage.
 *
 * Invoked daily by Vercel Cron (see vercel.json). Protected by CRON_SECRET.
 * No writes — does not create users, orders, or analytics events.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

function authorize(request: Request) {
  const secret = process.env.CRON_SECRET;
  // Fail closed if secret is unset — never allow unauthenticated pings.
  if (!secret) return false;

  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
  // Query-string secrets are intentionally rejected (log/referrer leakage).
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503, headers: NO_STORE },
    );
  }

  // Read-only PostgREST request via anon key (RLS applies).
  // Empty result is still a successful DB round-trip and counts as activity.
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        at: new Date().toISOString(),
      },
      { status: 500, headers: NO_STORE },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      // Confirms a PostgREST round-trip completed (counts as DB activity).
      activity: "products.select.id.limit(1)",
      rows: data?.length ?? 0,
      at: new Date().toISOString(),
    },
    { headers: NO_STORE },
  );
}
