"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-[var(--stone)] bg-[linear-gradient(160deg,#1E2A44,#2D2D2D)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(242,217,138,0.22),transparent_45%)]" />
          <div className="absolute inset-0 flex items-center justify-center p-8 transition duration-500 group-hover:scale-105">
            <svg viewBox="0 0 200 220" className="h-full w-full max-w-[220px]">
              <path
                d="M40 70 L70 48 L90 68 L110 68 L130 48 L160 70 L150 100 L140 96 L140 190 L60 190 L60 96 L50 100 Z"
                fill={product.colors[0]?.hex ?? "#0A0A0A"}
                stroke="#F7F7F5"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <image
                href="/shirt-mark.png"
                x="70"
                y="90"
                width="60"
                height="60"
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </div>
          {product.bestSeller && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
              Best Seller
            </span>
          )}
        </div>
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
