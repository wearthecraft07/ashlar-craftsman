import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { getBestSellers } from "@/data/products";
import { Button } from "@/components/ui/Button";

export function BestSellers() {
  const products = getBestSellers();

  return (
    <section className="bg-[var(--lodge-blue)] px-4 py-20 text-[var(--ivory)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Best Sellers"
            title="Pieces brothers of the craft keep reordering."
            description="Formal marks, gold accents, and custom avatar garments."
            className="[&_h2]:text-[var(--ivory)] [&_p]:text-[var(--ivory)]/65"
          />
          <Button href="/shop" variant="gold">
            View all
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="[&_h3]:text-[var(--ivory)] [&_p]:text-[var(--ivory)]/60"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
