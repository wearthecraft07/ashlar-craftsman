import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import {
  ProductStage,
  ProductVisual,
} from "@/components/product/ProductVisual";
import { Button } from "@/components/ui/Button";
import { listProducts } from "@/lib/catalog/products";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

function FeaturedCard({ product, index }: { product: Product; index: number }) {
  const isCustom =
    product.category === "custom" || product.tags.includes("avatar");
  const line =
    product.description.length > 90
      ? `${product.description.slice(0, 87).trim()}…`
      : product.description;

  return (
    <Reveal delayMs={index * 50}>
      <article className="group flex h-full flex-col">
        <Link href={`/shop/${product.slug}`} className="block">
          <ProductStage aspect="portrait">
          <div className="w-full max-w-[200px] transition duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100">
            <ProductVisual product={product} size="md" decorative />
          </div>
          </ProductStage>
        </Link>
        <div className="mt-5 flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--lodge-blue)]">
              <Link
                href={`/shop/${product.slug}`}
                className="transition hover:text-[var(--copper)]"
              >
                {product.name}
              </Link>
            </h3>
            <p className="shrink-0 text-sm font-semibold text-[var(--lodge-blue)]">
              {formatCurrency(product.price)}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--walnut)]">
            {line}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button href={`/shop/${product.slug}`} size="sm" variant="dark">
              Wear the Craft
            </Button>
            {isCustom && (
              <Button href="/avatar" size="sm" variant="ghost">
                Build Your Craftsman
              </Button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export async function FeaturedProducts() {
  const { products } = await listProducts({ bestSeller: true });
  let list = products.slice(0, 4);
  if (list.length < 4) {
    const all = await listProducts();
    const ids = new Set(list.map((p) => p.id));
    list = [
      ...list,
      ...all.products.filter((p) => !ids.has(p.id)).slice(0, 4 - list.length),
    ];
  }

  return (
    <section
      id="featured"
      className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Featured
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-5xl">
              Wear the Craft.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--walnut)] sm:text-lg">
              Designed with purpose. Made for Brothers who see more.
            </p>
          </div>
          <Button href="/shop" variant="ghost">
            Shop the Collection
          </Button>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((product, index) => (
            <FeaturedCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
