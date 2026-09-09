import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-5xl">
            What will you build?
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">
            Wear the Craft.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button href="/shop" size="lg">
              Shop the Collection
            </Button>
            <Button href="/avatar" size="lg" variant="ghost">
              Build Your Craftsman
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
