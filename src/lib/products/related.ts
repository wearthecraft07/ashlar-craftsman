import { DISCOVERIES } from "@/data/discovery";
import { getProductStory } from "@/data/product-stories";
import type { Product } from "@/types";

const ID_TO_SLUG: Record<string, string> = {
  prod_ashlar_mark: "ashlar-mark-tee",
  prod_journey: "craft-your-journey",
  prod_mason_line: "square-line-tee",
  prod_avatar_custom: "custom-avatar-tee",
  prod_pillar: "twin-pillars-tee",
  prod_level: "true-level-tee",
  prod_gold_edge: "gold-edge-tee",
  prod_stonework: "stonework-tee",
};

function matchesIdOrSlug(product: Product, id: string) {
  return (
    product.id === id ||
    product.slug === id ||
    product.slug === ID_TO_SLUG[id]
  );
}

/** Related products: same category → shared symbolism → discovery → featured. */
export function getRelatedProducts(
  product: Product,
  catalog: Product[],
  limit = 4,
): Product[] {
  const story = getProductStory(product);
  const seen = new Set<string>([product.id]);
  const ordered: Product[] = [];

  const push = (candidate: Product | undefined) => {
    if (!candidate || seen.has(candidate.id) || ordered.length >= limit) return;
    seen.add(candidate.id);
    ordered.push(candidate);
  };

  // 1. Same collection / category
  for (const p of catalog) {
    if (p.category === product.category) push(p);
  }

  // 2. Shared discovery symbolism
  for (const discoveryId of story.relatedDiscoveryIds ?? []) {
    const discovery = DISCOVERIES.find((d) => d.id === discoveryId);
    for (const relatedId of discovery?.relatedProductIds ?? []) {
      push(catalog.find((p) => matchesIdOrSlug(p, relatedId)));
    }
  }

  // 3. Products that map back to this product via discovery
  for (const discovery of DISCOVERIES) {
    if (
      discovery.relatedProductIds.some((id) => matchesIdOrSlug(product, id))
    ) {
      for (const relatedId of discovery.relatedProductIds) {
        push(catalog.find((p) => matchesIdOrSlug(p, relatedId)));
      }
    }
  }

  // 4. Featured / best sellers (skip custom unless current is custom)
  for (const p of catalog) {
    if (product.category !== "custom" && p.category === "custom") continue;
    if (p.featured || p.bestSeller) push(p);
  }

  // 5. Remainder
  for (const p of catalog) {
    if (product.category !== "custom" && p.category === "custom") continue;
    push(p);
  }

  return ordered.slice(0, limit);
}
