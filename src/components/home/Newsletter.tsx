"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscribe failed");
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscribe failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--gold)]/25 bg-[linear-gradient(135deg,#1E2A44_0%,#2A3A5C_55%,#5C4331_100%)] px-6 py-12 sm:px-10"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Newsletter
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--ivory)] sm:text-4xl">
              Get drops, studio tips, and early access.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--ivory)]/70 sm:text-base">
              Join the craft list. No spam — just new collections and avatar
              studio updates.
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-12 flex-1 rounded-full border border-[var(--gold)]/30 bg-white/5 px-5 text-sm text-[var(--ivory)] outline-none ring-[var(--gold)] placeholder:text-[var(--ivory)]/40 focus:ring-2"
            />
            <Button type="submit" variant="gold" disabled={loading}>
              {loading ? "Saving…" : "Subscribe"}
            </Button>
          </form>
        </div>
        {done && (
          <p className="mt-4 text-sm text-[var(--gold)]" role="status">
            You&apos;re on the list. Craft awaits.
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
      </motion.div>
    </section>
  );
}
