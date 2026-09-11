"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ProductStage,
  ProductVisual,
} from "@/components/product/ProductVisual";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <ProductStage
          aspect="portrait"
          className="transition duration-500 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0"
        >
          <div className="w-full max-w-[200px] transition duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100">
            <ProductVisual product={product} size="md" decorative />
          </div>
          {product.bestSeller && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lodge-blue)]">
              Best Seller
            </span>
          )}
        </ProductStage>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {product.name}
            </h3>
            <p className="mt-1 text-sm capitalize text-[var(--muted)]">
              {product.category}
            </p>
          </div>
          <p className="text-sm font-semibold text-[var(--ink)]">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
