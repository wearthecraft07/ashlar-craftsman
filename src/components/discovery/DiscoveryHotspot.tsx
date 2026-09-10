"use client";

import { cn } from "@/lib/utils";
import type { DiscoveryItem } from "@/data/discovery";

type Props = {
  item: DiscoveryItem;
  discovered: boolean;
  active: boolean;
  onSelect: (id: DiscoveryItem["id"]) => void;
};

export function DiscoveryHotspot({
  item,
  discovered,
  active,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      aria-label={
        discovered
          ? `Discovered: ${item.title}. Activate to review.`
          : `Look closer: possible tool near ${item.label}`
      }
      aria-pressed={active}
      aria-describedby="discovery-progress"
      onClick={() => onSelect(item.id)}
      className={cn(
        "absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lodge-blue)]",
        "transition duration-300 motion-reduce:transition-none",
      )}
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
    >
      <span
        className={cn(
          "block rounded-full border transition duration-300 motion-reduce:transition-none",
          active
            ? "h-3.5 w-3.5 border-[var(--gold)] bg-[var(--gold)]"
            : discovered
              ? "h-2.5 w-2.5 border-[var(--gold)] bg-[var(--gold)]/80"
              : "h-2 w-2 border-[var(--gold)]/50 bg-[var(--gold)]/20 group-hover:border-[var(--gold)]/80",
        )}
        aria-hidden
      />
      {/* Larger invisible hit area already on button; pulse ring when undiscovered */}
      {!discovered && !active && (
        <span
          className="pointer-events-none absolute h-7 w-7 rounded-full border border-[var(--gold)]/10"
          aria-hidden
        />
      )}
      {(active || discovered) && (
        <span
          className="pointer-events-none absolute h-10 w-10 rounded-full border border-[var(--gold)]/35"
          aria-hidden
        />
      )}
    </button>
  );
}
