/**
 * Lodge Edition configuration — public brand styles only.
 * No private ritual content. No invented product SKUs.
 */

export const LODGE_STYLES = [
  {
    id: "classic",
    name: "Classic",
    description:
      "Clean Masonic geometry with an understated Lodge identity.",
  },
  {
    id: "architectural",
    name: "Architectural",
    description:
      "Built around lines, proportion, and the language of the Lodge.",
  },
  {
    id: "craftsman",
    name: "Craftsman",
    description: "Designed around the Ashlar philosophy.",
  },
  {
    id: "heritage",
    name: "Heritage",
    description:
      "A timeless treatment inspired by traditional Lodge craftsmanship.",
  },
] as const;

export type LodgeStyleId = (typeof LODGE_STYLES)[number]["id"];

export const LODGE_QUANTITY_RANGES = [
  { id: "1-5", label: "1–5" },
  { id: "6-12", label: "6–12" },
  { id: "13-24", label: "13–24" },
  { id: "25-49", label: "25–49" },
  { id: "50+", label: "50+" },
  { id: "unsure", label: "I'm not sure yet" },
] as const;

export type LodgeQuantityId = (typeof LODGE_QUANTITY_RANGES)[number]["id"];

export const LODGE_EMBLEM_OPTIONS = [
  {
    id: "none",
    label: "No emblem",
    hint: "Typography and geometry only.",
  },
  {
    id: "have",
    label: "Yes — I have an approved Lodge emblem",
    hint: "We'll coordinate artwork with you. Uploads are not required yet.",
  },
  {
    id: "help",
    label: "I need help",
    hint: "We'll provide guidance on a respectful public mark.",
  },
] as const;

export type LodgeEmblemId = (typeof LODGE_EMBLEM_OPTIONS)[number]["id"];

/** Products eligible for Lodge Edition foundation (existing apparel only). */
export function isLodgeCompatibleProduct(product: {
  category: string;
  tags: string[];
}): boolean {
  if (product.category === "custom") return false;
  if (product.tags.includes("avatar") || product.tags.includes("studio")) {
    return false;
  }
  return true;
}

/**
 * Proposed Supabase table (NOT applied in Phase 6):
 *
 * create table public.lodge_design_requests (
 *   id uuid primary key default gen_random_uuid(),
 *   lodge_name text not null,
 *   lodge_number text,
 *   city text,
 *   region text,
 *   year_established text,
 *   lodge_colors text,
 *   product_id text,
 *   product_slug text,
 *   style text,
 *   emblem_intent text,
 *   quantity_range text,
 *   target_date date,
 *   contact_email text,
 *   notes text,
 *   authorized boolean not null default false,
 *   status text not null default 'submitted',
 *   created_at timestamptz not null default now()
 * );
 *
 * statuses: draft | submitted | reviewing | concept_ready |
 *           awaiting_approval | approved | rejected | ordered | completed
 */
