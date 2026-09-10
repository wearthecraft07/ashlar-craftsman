"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DISCOVERIES,
  DISCOVERY_FEEDBACK,
  DISCOVERY_TOTAL,
  type DiscoveryId,
} from "@/data/discovery";
import { resolveDiscoveryProducts } from "@/lib/discovery/resolve-products";
import { DiscoveryArtwork } from "@/components/discovery/DiscoveryArtwork";
import { DiscoveryHotspot } from "@/components/discovery/DiscoveryHotspot";
import { DiscoveryProgress } from "@/components/discovery/DiscoveryProgress";
import { DiscoveryDetail } from "@/components/discovery/DiscoveryDetail";
import { DiscoveryCompletion } from "@/components/discovery/DiscoveryCompletion";
import { DiscoveryProducts } from "@/components/discovery/DiscoveryProducts";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/home/Reveal";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export function DiscoveryExperience({ products }: Props) {
  const [discovered, setDiscovered] = useState<Set<DiscoveryId>>(
    () => new Set(),
  );
  const [activeId, setActiveId] = useState<DiscoveryId | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const complete = discovered.size >= DISCOVERY_TOTAL;
  const activeItem =
    DISCOVERIES.find((d) => d.id === activeId) ?? null;

  const recommended = useMemo(
    () =>
      resolveDiscoveryProducts(
        Array.from(discovered),
        products,
        4,
      ),
    [discovered, products],
  );

  const select = useCallback((id: DiscoveryId) => {
    setActiveId(id);
    setDiscovered((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      setFeedback(
        DISCOVERY_FEEDBACK[(next.size - 1) % DISCOVERY_FEEDBACK.length],
      );
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setDiscovered(new Set());
    setActiveId(null);
    setFeedback(null);
  }, []);

  return (
    <section
      id="look-closer"
      className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      aria-labelledby="brother-test-heading"
    >
      <div className="mx-auto max-w-7xl">
        {!complete ? (
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
                The Brother Test
              </p>
              <h2
                id="brother-test-heading"
                className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-5xl"
              >
                How much do you see?
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--walnut)] sm:text-lg">
                There are details in this design that most people will never
                notice.
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">
                Look closer.
              </p>
              <div className="mt-8">
                <Button href="#look-closer-board" variant="dark">
                  Look closer
                </Button>
              </div>
              <p className="mt-6 max-w-sm text-sm text-[var(--walnut)]/75">
                Working tools of the Craft — measure, refine, stand upright, act
                fairly, meet as equals, and unite. Nothing private. Everything
                intentional.
              </p>

              <div className="mt-10 hidden lg:block">
                <DiscoveryDetail
                  item={activeItem}
                  onDismiss={() => setActiveId(null)}
                />
              </div>
            </Reveal>

            <Reveal delayMs={70}>
              <div className="rounded-[1.75rem] border border-[var(--gold)]/25 bg-[linear-gradient(160deg,#1E2A44,#121926)] p-4 shadow-[0_24px_60px_rgba(30,42,68,0.18)] sm:p-5">
                <div className="mb-4 px-1">
                  <DiscoveryProgress
                    found={discovered.size}
                    feedback={feedback}
                  />
                </div>

                <div
                  id="look-closer-board"
                  className="relative aspect-square overflow-hidden rounded-[1.25rem]"
                >
                  <DiscoveryArtwork
                    discovered={discovered}
                    activeId={activeId}
                  />
                  {DISCOVERIES.map((item) => (
                    <DiscoveryHotspot
                      key={item.id}
                      item={item}
                      discovered={discovered.has(item.id)}
                      active={activeId === item.id}
                      onSelect={select}
                    />
                  ))}
                </div>

                {/* Screen-reader list of all marks */}
                <ul className="sr-only">
                  {DISCOVERIES.map((item) => (
                    <li key={`sr-${item.id}`}>
                      {discovered.has(item.id)
                        ? `Found: ${item.title}. ${item.description}`
                        : `Undiscovered tool: ${item.label}`}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 lg:hidden">
                  <DiscoveryDetail
                    item={activeItem}
                    onDismiss={() => setActiveId(null)}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        ) : (
          <Reveal>
            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--gold)]/25 bg-[linear-gradient(160deg,#1E2A44,#121926)] px-5 py-12 sm:px-10 sm:py-16">
              <h2 id="brother-test-heading" className="sr-only">
                How much do you see? — complete
              </h2>
              <DiscoveryCompletion onExploreAgain={reset}>
                <DiscoveryProducts products={recommended} />
              </DiscoveryCompletion>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
