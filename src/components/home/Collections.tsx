import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { HOME_COLLECTIONS } from "@/data/home-collections";
import { cn } from "@/lib/utils";

export function Collections() {
  return (
    <section
      id="collections"
      className="scroll-mt-24 border-t border-[var(--stone)]/40 bg-[color-mix(in_srgb,var(--ivory)_88%,var(--stone))] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Collections
          </p>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-5xl">
            Chapters of the Craft.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--walnut)] sm:text-lg">
            Editorial collections mapped to the work you wear — each with a
            purpose, not a promotion.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {HOME_COLLECTIONS.map((collection, index) => {
            const spanClass =
              collection.id === "lodge-editions"
                ? "xl:col-span-6"
                : "xl:col-span-3";
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
                    {collection.eyebrow}
                  </p>
                  {collection.comingSoon && (
                    <span className="rounded-full border border-[var(--gold)]/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--ivory)] sm:text-3xl">
                  {collection.name}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--ivory)]/70">
                  {collection.philosophy}
                </p>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)] transition group-hover:tracking-[0.34em]">
                  {collection.cta} →
                </p>
              </>
            );

            const cardClass = cn(
              "group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[1.5rem] border border-[var(--gold)]/20 p-7 transition duration-300",
              "bg-[linear-gradient(165deg,#1E2A44_0%,#162033_55%,#121926_100%)]",
              !collection.comingSoon &&
                "hover:-translate-y-1 hover:border-[var(--gold)]/45 motion-reduce:hover:translate-y-0",
              collection.comingSoon && "cursor-default opacity-95",
            );

            return (
              <Reveal
                key={collection.id}
                delayMs={index * 60}
                className={spanClass}
              >
                <Link href={collection.href} className={cardClass}>
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                      background: `radial-gradient(circle at 85% 15%, ${collection.accent}55, transparent 45%)`,
                    }}
                    aria-hidden
                  />
                  <div className="relative">{inner}</div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
