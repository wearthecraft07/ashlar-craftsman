import { Button } from "@/components/ui/Button";
import { supportsAvatarWear } from "@/lib/products/media";
import type { Product } from "@/types";

/** Strong Avatar Studio connection — custom / studio products only. */
export function ProductAvatarWearCta({ product }: { product: Product }) {
  if (!supportsAvatarWear(product)) return null;

  return (
    <div className="mt-6 rounded-[1.25rem] border border-[var(--gold)]/25 bg-[color-mix(in_srgb,var(--lodge-blue)_96%,black)] px-5 py-5 text-[var(--ivory)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
        See your Craftsman wearing it
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ivory)]/75">
        Build the character that represents your journey — then wear it on this
        piece.
      </p>
      <div className="mt-4">
        <Button href="/avatar" size="sm">
          Build Your Craftsman
        </Button>
      </div>
    </div>
  );
}
