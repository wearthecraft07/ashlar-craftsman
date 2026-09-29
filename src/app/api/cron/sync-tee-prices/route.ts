import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";
import { createServiceClient } from "@/lib/supabase/admin";

/**
 * Sync catalog tee prices from `src/data/products.ts` into Supabase.
 * Protected by CRON_SECRET (Bearer). Safe to re-run.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

function authorize(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
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

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service client unavailable." },
      { status: 503, headers: NO_STORE },
    );
  }

  const results: Array<{
    slug: string;
    price: number;
    ok: boolean;
    error?: string;
  }> = [];

  for (const product of PRODUCTS) {
    const { error } = await supabase
      .from("products")
      .update({
        price: product.price,
        sale_price: null,
        compare_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", product.slug);

    results.push({
      slug: product.slug,
      price: product.price,
      ok: !error,
      error: error?.message,
    });
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    {
      ok: failed.length === 0,
      updated: results.filter((r) => r.ok).length,
      failed: failed.length,
      results,
    },
    { status: failed.length ? 500 : 200, headers: NO_STORE },
  );
}
