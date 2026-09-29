"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/home/Reveal";
import {
  ProductStage,
  ProductVisual,
} from "@/components/product/ProductVisual";
import { ShirtColorSwatches } from "@/components/product/ShirtColorSwatches";
import { Button } from "@/components/ui/Button";
import {
  defaultShirtColor,
  resolveShirtColors,
} from "@/lib/products/shirt-colors";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function FeaturedProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const isCustom =
    product.category === "custom" || product.tags.includes("avatar");
  const line =
    product.description.length > 90
      ? `${product.description.slice(0, 87).trim()}…`
      : product.description;
  const colors = resolveShirtColors(product);
  const [color, setColor] = useState(() => defaultShirtColor(product));

  return (
    <Reveal delayMs={index * 50}>
      <article className="group flex h-full flex-col">
        <Link href={`/shop/${product.slug}`} className="block">
          <ProductStage aspect="portrait">
            <div className="w-full max-w-[200px] transition duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100">
              <ProductVisual
                product={product}
                color={color}
                size="md"
                decorative
              />
            </div>
          </ProductStage>
        </Link>
        <div className="mt-3">
          <ShirtColorSwatches
            colors={colors}
            value={color}
            onChange={setColor}
            size="sm"
          />
        </div>
        <div className="mt-4 flex flex-1 flex-col">
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
