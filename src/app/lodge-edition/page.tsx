import type { Metadata } from "next";
import { Suspense } from "react";
import { LodgeEditionExperience } from "@/components/lodge/LodgeEditionExperience";
import { isLodgeCompatibleProduct } from "@/data/lodge-edition";
import { listProducts } from "@/lib/catalog/products";

export const metadata: Metadata = {
  title: "Make It Your Lodge",
  description:
    "Request a Lodge Edition from The Ashlar Craftsman — personalized apparel concepts for your Lodge, prepared with care and reviewed before ordering.",
};

export default async function LodgeEditionPage() {
  const { products } = await listProducts();
  const compatible = products.filter(isLodgeCompatibleProduct);

  return (
    <Suspense
      fallback={
        <div className="px-4 pt-32 text-center text-[var(--walnut)]">
          Loading Lodge Edition…
        </div>
      }
    >
      <LodgeEditionExperience products={compatible} />
    </Suspense>
  );
}
