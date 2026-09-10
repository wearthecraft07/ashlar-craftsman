"use client";

import { DISCOVERY_TOTAL } from "@/data/discovery";

type Props = {
  found: number;
  feedback?: string | null;
};

export function DiscoveryProgress({ found, feedback }: Props) {
  return (
    <div
      id="discovery-progress"
      className="flex flex-wrap items-baseline justify-between gap-3"
      aria-live="polite"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Tools discovered
        </p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ivory)]">
          {found}{" "}
          <span className="text-base text-[var(--ivory)]/50">
            / {DISCOVERY_TOTAL}
          </span>
        </p>
      </div>
      {feedback && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]/85">
          {feedback}
        </p>
      )}
    </div>
  );
}
