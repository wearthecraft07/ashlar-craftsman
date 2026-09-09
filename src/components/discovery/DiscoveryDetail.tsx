"use client";

import type { DiscoveryItem } from "@/data/discovery";
import { Button } from "@/components/ui/Button";

type Props = {
  item: DiscoveryItem | null;
  onDismiss?: () => void;
};

export function DiscoveryDetail({ item, onDismiss }: Props) {
  if (!item) {
    return (
      <div
        className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--lodge-blue)]/90 p-5 text-[var(--ivory)]"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm leading-relaxed text-[var(--ivory)]/70">
          Inspect the plate. Marks reveal themselves to those who look closer.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--lodge-blue)]/95 p-5 text-[var(--ivory)] shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
        {item.label}
      </p>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl sm:text-2xl">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ivory)]/75">
        {item.description}
      </p>
      {onDismiss && (
        <div className="mt-4 sm:hidden">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="w-full border-[var(--gold)]/40 bg-transparent text-[var(--ivory)] hover:bg-[var(--ivory)]/10 hover:text-[var(--ivory)]"
          >
            Continue looking
          </Button>
        </div>
      )}
    </div>
  );
}
