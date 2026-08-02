"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/data/content";

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Built for the journey. Loved on arrival."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[1.75rem] border border-black/8 bg-white p-7"
            >
              <div className="flex gap-1 text-[var(--gold)]" aria-label={`${item.rating} stars`}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-5 text-base leading-relaxed text-[var(--ink)]">
                “{item.quote}”
              </p>
              <footer className="mt-6">
                <p className="font-semibold text-[var(--ink)]">{item.name}</p>
                <p className="text-sm text-[var(--muted)]">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
