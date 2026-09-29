import { FeaturedProductCard } from "@/components/home/FeaturedProductCard";
import { Button } from "@/components/ui/Button";
import { listProducts } from "@/lib/catalog/products";

export async function FeaturedProducts() {
  const { products } = await listProducts({ bestSeller: true });
  let list = products.slice(0, 4);
  if (list.length < 4) {
    const all = await listProducts();
    const ids = new Set(list.map((p) => p.id));
    list = [
      ...list,
      ...all.products.filter((p) => !ids.has(p.id)).slice(0, 4 - list.length),
    ];
  }

  return (
    <section
      id="featured"
      className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Featured
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-5xl">
              Wear the Craft.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--walnut)] sm:text-lg">
              Designed with purpose. Made for Brothers who see more.
            </p>
          </div>
          <Button href="/shop" variant="ghost">
            Shop the Collection
          </Button>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((product, index) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
