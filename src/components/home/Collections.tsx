"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COLLECTIONS } from "@/data/content";

export function Collections() {
  return (
    <section id="collections" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Featured Collections"
          title="Wear the craft in every chapter."
          description="From everyday essentials to limited drops and custom avatar tees."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={collection.href}
                className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[2rem] border border-[var(--gold)]/20 p-6 transition duration-500 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(160deg, ${collection.accent}33, #1E2A44)`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,217,138,0.18),transparent_45%)]" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                    Collection
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--ivory)]">
                    {collection.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ivory)]/70">
                    {collection.blurb}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
