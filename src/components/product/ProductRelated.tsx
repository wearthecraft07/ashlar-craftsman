import Link from "next/link";
import {
  ProductStage,
  ProductVisual,
} from "@/components/product/ProductVisual";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductRelated({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="border-t border-[var(--stone)]/40 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
        Continue
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-4xl">
        The Craft continues.
      </h2>
      <p className="mt-3 max-w-lg text-sm text-[var(--walnut)]">
        Related pieces from the same collection and shared symbolism.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <article className="group">
              <Link href={`/shop/${product.slug}`} className="block">
                <ProductStage
                  aspect="portrait"
                  className="rounded-[1.25rem]"
                >
                  <div className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
                    <ProductVisual product={product} size="sm" decorative />
                  </div>
                </ProductStage>
                <div className="mt-4 flex items-start justify-between gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--lodge-blue)]">
                    {product.name}
                  </h3>
                  <p className="shrink-0 text-sm font-semibold text-[var(--lodge-blue)]">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                  Explore the piece →
                </p>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
