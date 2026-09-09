import { Reveal } from "@/components/home/Reveal";

const MILESTONES = [
  {
    name: "Master Mason",
    line: "The work continues — marked with quiet pride.",
  },
  {
    name: "Past Master",
    line: "Service remembered. Leadership honored.",
  },
  {
    name: "25 Years",
    line: "A quarter-century of light and labor.",
  },
  {
    name: "50 Years",
    line: "A lifetime shaped by the Craft.",
  },
  {
    name: "Masonic Veteran",
    line: "Brotherhood that served beyond the Lodge.",
  },
] as const;

/** Brand / story section — not purchasable until products exist. */
export function MilestonesTeaser() {
  return (
    <section
      id="milestones"
      className="scroll-mt-24 border-y border-[var(--stone)]/50 bg-[color-mix(in_srgb,var(--ivory)_92%,var(--stone))] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Milestones
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-5xl">
            Mark the milestone.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--walnut)] sm:text-lg">
            Some moments deserve to be remembered.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MILESTONES.map((item, index) => (
            <Reveal key={item.name} delayMs={index * 40}>
              <div className="flex h-full min-h-[180px] flex-col justify-between border border-[var(--gold)]/20 bg-[var(--panel)] p-5">
                <p className="font-[family-name:var(--font-display)] text-lg text-[var(--lodge-blue)]">
                  {item.name}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-[var(--walnut)]">
                  {item.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--walnut)]/60">
          Concept preview — apparel forthcoming
        </p>
      </div>
    </section>
  );
}
