import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Order confirmed",
};

type Props = {
  searchParams: Promise<{ order?: string; session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const ref = params.order || params.session_id || "confirmed";

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-28 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
        Thank you
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
        Your craft is on the way.
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Order reference: <span className="text-[var(--ink)]">{ref}</span>
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/account/orders">View orders</Button>
        <Button href="/shop" variant="ghost">
          Keep shopping
        </Button>
      </div>
    </div>
  );
}
