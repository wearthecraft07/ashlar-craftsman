import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/Button";

export function LodgeEditionTeaser() {
  return (
    <section
      id="lodge"
      className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--gold)]/25 bg-[linear-gradient(135deg,#1E2A44_0%,#2a1f14_100%)] px-6 py-16 text-[var(--ivory)] sm:px-12 lg:px-16 lg:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Lodge Editions
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-5xl">
              Make it your Lodge.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--ivory)]/75 sm:text-lg">
              Your Lodge has a history. Your Lodge has a personality. Give it a
              piece of your own.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/lodge-edition" size="lg">
                Make It Your Lodge
              </Button>
            </div>
            <p className="mt-6 text-sm text-[var(--ivory)]/55">
              Start a Lodge Edition request — concept first, order after
              approval.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
