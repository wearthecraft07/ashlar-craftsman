import type { ProductStory } from "@/data/product-stories";

export function ProductStorySection({ story }: { story: ProductStory }) {
  return (
    <section className="border-t border-[var(--stone)]/40 py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
        The story
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-4xl">
        The story behind the piece
      </h2>
      <div className="mt-8 max-w-2xl space-y-5">
        {story.story.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-relaxed text-[var(--walnut)] sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export function ProductMeaning({ story }: { story: ProductStory }) {
  const { symbol, theme, idea } = story.represents;
  return (
    <section className="border-t border-[var(--stone)]/40 py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
        What it represents
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="border-l border-[var(--gold)]/35 pl-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--walnut)]/70">
            Symbol
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--lodge-blue)]">
            {symbol}
          </p>
        </div>
        <div className="border-l border-[var(--gold)]/35 pl-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--walnut)]/70">
            Theme
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--lodge-blue)]">
            {theme}
          </p>
        </div>
        <div className="border-l border-[var(--gold)]/35 pl-4 sm:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--walnut)]/70">
            Idea
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--walnut)]">
            {idea}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProductForThoseWhoKnow({ story }: { story: ProductStory }) {
  if (!story.forThoseWhoKnow) return null;
  const { intro, details } = story.forThoseWhoKnow;

  return (
    <section className="border-t border-[var(--stone)]/40 py-14">
      <div className="rounded-[1.5rem] border border-[var(--gold)]/20 bg-[color-mix(in_srgb,var(--lodge-blue)_96%,black)] px-6 py-10 text-[var(--ivory)] sm:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          For those who know
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
          {intro}
        </h2>
        <ul className="mt-6 max-w-2xl space-y-4">
          {details.map((detail) => (
            <li
              key={detail}
              className="text-sm leading-relaxed text-[var(--ivory)]/75 sm:text-base"
            >
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProductQuality({ story }: { story: ProductStory }) {
  if (!story.quality?.length) return null;

  return (
    <section className="border-t border-[var(--stone)]/40 py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
        The piece
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)]">
        Quality notes
      </h2>
      <p className="mt-3 max-w-lg text-sm text-[var(--walnut)]">
        Drawn only from confirmed product details — nothing invented.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {story.quality.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--stone)]/50 bg-[var(--panel)] px-5 py-4"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
              {item.label}
            </dt>
            <dd className="mt-2 text-sm text-[var(--lodge-blue)]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
