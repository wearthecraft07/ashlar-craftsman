import { Reveal } from "@/components/home/Reveal";

export function Philosophy() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-y border-[var(--gold)]/15 bg-[color-mix(in_srgb,var(--lodge-blue)_96%,black)] px-4 py-24 text-[var(--ivory)] sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">
            The philosophy
          </p>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-5xl md:text-6xl">
            Not everyone will understand the shirt.
          </h2>
          <p className="mt-4 font-[family-name:var(--font-display)] text-2xl text-[var(--gold)] sm:text-3xl">
            That&apos;s the point.
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[var(--ivory)]/72 sm:text-lg">
            Built around the symbols, tools, traditions, and philosophy of the
            Craft—designed for Brothers who carry those lessons beyond the Lodge.
          </p>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--gold)]/80">
            Look closer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
