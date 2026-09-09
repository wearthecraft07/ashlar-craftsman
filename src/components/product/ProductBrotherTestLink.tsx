import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ProductBrotherTestLink() {
  return (
    <section className="border-t border-[var(--stone)]/40 py-14">
      <div className="flex flex-col gap-6 rounded-[1.5rem] border border-[var(--gold)]/25 bg-[var(--panel)] px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Did you see this one?
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--walnut)]">
            Return to the Brother Test and see what else is hidden in the plate.
          </p>
        </div>
        <Button href="/#look-closer" variant="dark">
          Look closer
        </Button>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--walnut)]/60">
        Or{" "}
        <Link href="/shop" className="underline underline-offset-2">
          shop the collection
        </Link>
        .
      </p>
    </section>
  );
}
