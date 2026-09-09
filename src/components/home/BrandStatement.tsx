import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/Button";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden bg-[var(--lodge-blue)] px-4 py-24 text-[var(--ivory)] sm:px-6 lg:px-8 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,162,74,0.16),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-5xl md:text-6xl">
            The work is never finished.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[var(--ivory)]/72 sm:text-lg">
            Every stone can be refined. Every journey can be shaped. Every Brother
            has more work to do.
          </p>
          <div className="mt-10">
            <Button href="/shop" size="lg">
              Continue the Journey
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
