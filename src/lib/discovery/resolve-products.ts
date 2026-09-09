import {
  DISCOVERIES,
  DISCOVERY_FALLBACK_PRODUCT_IDS,
  type DiscoveryId,
} from "@/data/discovery";
import type { Product } from "@/types";

/** Static catalog IDs → slugs for DB catalogs that use different UUIDs. */
const PRODUCT_ID_TO_SLUG: Record<string, string> = {
  prod_ashlar_mark: "ashlar-mark-tee",
  prod_journey: "craft-your-journey",
  prod_mason_line: "square-line-tee",
  prod_avatar_custom: "custom-avatar-tee",
  prod_pillar: "twin-pillars-tee",
  prod_level: "true-level-tee",
  prod_gold_edge: "gold-edge-tee",
  prod_stonework: "stonework-tee",
};

function findInCatalog(
  id: string,
  byId: Map<string, Product>,
  bySlug: Map<string, Product>,
): Product | undefined {
  return byId.get(id) ?? bySlug.get(PRODUCT_ID_TO_SLUG[id] ?? "");
}

/** Resolve 2–4 existing products from discovered symbols; never invent IDs. */
export function resolveDiscoveryProducts(
  discoveredIds: DiscoveryId[],
  catalog: Product[],
  limit = 4,
): Product[] {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const ordered: Product[] = [];
  const seen = new Set<string>();

  const push = (id: string) => {
    if (ordered.length >= limit) return;
    const product = findInCatalog(id, byId, bySlug);
    if (!product || seen.has(product.id)) return;
    seen.add(product.id);
    ordered.push(product);
  };

  for (const discoveryId of discoveredIds) {
    const item = DISCOVERIES.find((d) => d.id === discoveryId);
    item?.relatedProductIds.forEach(push);
  }

  for (const id of DISCOVERY_FALLBACK_PRODUCT_IDS) {
    push(id);
  }

  if (ordered.length < 2) {
    for (const product of catalog) {
      if (!(product.featured || product.bestSeller)) continue;
      if (seen.has(product.id) || ordered.length >= limit) continue;
      // Prefer apparel marks over custom avatar in discovery fallback
      if (product.category === "custom") continue;
      seen.add(product.id);
      ordered.push(product);
    }
  }

  if (ordered.length < 2) {
    for (const product of catalog) {
      if (seen.has(product.id) || ordered.length >= limit) continue;
      seen.add(product.id);
      ordered.push(product);
    }
  }

  return ordered.slice(0, limit);
}
