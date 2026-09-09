import { NextResponse } from "next/server";
import { lodgeEditionRequestSchema } from "@/lib/lodge/schema";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Lodge Edition request intake.
 * Does not create orders or modify checkout.
 * Persists only if `lodge_design_requests` exists; otherwise accepts in demo mode.
 */
export async function POST(request: Request) {
  try {
    const body = lodgeEditionRequestSchema.parse(await request.json());
    const supabase = createServiceClient() ?? (await createClient());

    const row = {
      lodge_name: body.lodgeName,
      lodge_number: body.lodgeNumber || null,
      city: body.city,
      region: body.region,
      year_established: body.yearEstablished || null,
      lodge_colors: body.lodgeColors || null,
      product_id: body.productId,
      product_slug: body.productSlug,
      style: body.style,
      emblem_intent: body.emblemIntent,
      quantity_range: body.quantityRange,
      target_date: body.targetDate || null,
      contact_email: body.contactEmail.toLowerCase(),
      notes: body.notes || null,
      authorized: body.authorized,
      status: "submitted",
    };

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        mode: "demo",
        message:
          "Request received locally (Supabase not configured). Apply the proposed lodge_design_requests table to persist requests.",
      });
    }

    const { error } = await supabase.from("lodge_design_requests").insert(row);

    if (error) {
      const missing =
        error.code === "42P01" ||
        /does not exist|relation|schema cache/i.test(error.message);

      if (missing) {
        // Safe fallback — do not invent a migration automatically
        console.info(
          "[lodge-edition] Schema not present; request accepted pending migration.",
          { product: body.productSlug },
        );
        return NextResponse.json({
          ok: true,
          mode: "pending_schema",
          message:
            "Request received. Persistence will activate once lodge_design_requests is created.",
        });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, mode: "database" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid lodge edition request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
