import { DiscoveryExperience } from "@/components/discovery/DiscoveryExperience";
import { listProducts } from "@/lib/catalog/products";

/** Homepage Brother Test — loads real catalog products for completion CTAs. */
export async function DiscoveryTeaser() {
  const { products } = await listProducts();
  return <DiscoveryExperience products={products} />;
}
