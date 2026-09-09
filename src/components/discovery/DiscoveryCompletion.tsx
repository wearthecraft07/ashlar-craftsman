"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  onExploreAgain: () => void;
  children: ReactNode;
};

export function DiscoveryCompletion({ onExploreAgain, children }: Props) {
  return (
    <div className="space-y-10 text-[var(--ivory)]">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Complete
        </p>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
          You saw it all.
        </h3>
        <p className="mt-3 text-base text-[var(--ivory)]/70">
          Most people stopped looking.
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-lg text-[var(--gold)]">
          You&apos;re paying attention, Brother.
        </p>
      </div>

      <div className="border-t border-[var(--gold)]/20 pt-10">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          The design doesn&apos;t end here
        </p>
        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-[var(--ivory)]/70">
          Each piece in The Ashlar Craftsman collection carries a story of its
          own.
        </p>
        <div className="mt-8">{children}</div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button href="/shop" variant="gold">
          Wear the Craft
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onExploreAgain}
          className="border-[var(--gold)]/40 bg-transparent text-[var(--ivory)] hover:bg-[var(--ivory)]/10 hover:text-[var(--ivory)]"
        >
          Explore again
        </Button>
      </div>
    </div>
  );
}
