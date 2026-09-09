"use client";

import Link from "next/link";
import {
  ProductStage,
  ProductVisual,
} from "@/components/product/ProductVisual";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export function DiscoveryProducts({ products }: Props) {
  if (!products.length) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <article className="group h-full rounded-2xl border border-[var(--gold)]/20 bg-[color-mix(in_srgb,var(--lodge-blue)_55%,black)] p-3 transition hover:border-[var(--gold)]/45">
            <Link href={`/shop/${product.slug}`} className="block">
              <ProductStage
                aspect="portrait"
                className="rounded-xl border-[var(--gold)]/15"
              >
                <div className="transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
                  <ProductVisual product={product} size="sm" decorative />
                </div>
              </ProductStage>
              <div className="mt-3 flex items-start justify-between gap-2 px-1">
                <h4 className="font-[family-name:var(--font-display)] text-base text-[var(--ivory)]">
                  {product.name}
                </h4>
                <p className="shrink-0 text-sm text-[var(--gold)]">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <p className="mt-3 px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                Explore the piece →
              </p>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
