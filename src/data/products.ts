import type { Product } from "@/types";

export const SHIRT_COLORS = [
  { id: "black", name: "Black", hex: "#0A0A0A" },
  { id: "white", name: "White", hex: "#F7F7F5" },
  { id: "charcoal", name: "Charcoal", hex: "#2A2A2A" },
  { id: "gold", name: "Gold Mist", hex: "#C9A227" },
  { id: "stone", name: "Stone", hex: "#D6D1C7" },
  { id: "ink", name: "Ink Navy", hex: "#141820" },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod_ashlar_mark",
    slug: "ashlar-mark-tee",
    name: "Ashlar Mark Tee",
    description:
      "Heavyweight cotton with an embroidered gold mark. Clean silhouette, street-ready finish.",
    price: 4800,
    compareAtPrice: 5800,
    category: "essentials",
    colors: SHIRT_COLORS.slice(0, 4),
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/products/ashlar-mark.svg"],
    tags: ["cotton", "gold", "everyday"],
    featured: true,
    bestSeller: true,
    inventory: 120,
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "prod_journey",
    slug: "craft-your-journey",
    name: "Craft Your Journey Tee",
    description:
      "Signature tagline tee with bold outline artwork. Built for movement and lasting wear.",
    price: 5200,
    category: "premium",
    colors: SHIRT_COLORS.filter((c) => c.id !== "gold"),
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: ["/products/journey.svg"],
    tags: ["signature", "premium"],
    featured: true,
    bestSeller: true,
    inventory: 85,
    createdAt: "2026-05-12T00:00:00.000Z",
  },
  {
    id: "prod_mason_line",
    slug: "square-line-tee",
    name: "Square Line Tee",
    description:
      "Geometric craft motif on charcoal. Luxury streetwear with classic proportion.",
    price: 5000,
    category: "essentials",
    colors: [
      SHIRT_COLORS[0],
      SHIRT_COLORS[2],
      SHIRT_COLORS[5],
    ],
    sizes: ["S", "M", "L", "XL"],
    images: ["/products/square-line.svg"],
    tags: ["geometry", "charcoal"],
    featured: true,
    inventory: 64,
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "prod_avatar_custom",
    slug: "custom-avatar-tee",
    name: "Custom Avatar Tee",
    description:
      "Your avatar, your shirt. Design in the studio and print on premium blanks.",
    price: 6400,
    category: "custom",
    colors: SHIRT_COLORS,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/products/custom-avatar.svg"],
    tags: ["custom", "avatar", "studio"],
    featured: true,
    bestSeller: true,
    inventory: 999,
    createdAt: "2026-06-15T00:00:00.000Z",
  },
  {
    id: "prod_pillar",
    slug: "twin-pillars-tee",
    name: "Twin Pillars Tee",
    description:
      "Limited drop with twin-pillar illustration and gold ink accents.",
    price: 5800,
    category: "limited",
    colors: [SHIRT_COLORS[0], SHIRT_COLORS[1], SHIRT_COLORS[2]],
    sizes: ["S", "M", "L", "XL"],
    images: ["/products/pillars.svg"],
    tags: ["limited", "gold-ink"],
    bestSeller: true,
    inventory: 40,
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "prod_level",
    slug: "true-level-tee",
    name: "True Level Tee",
    description:
      "Minimal mark, maximum presence. Soft hand-feel with reinforced collar.",
    price: 4600,
    category: "essentials",
    colors: SHIRT_COLORS.slice(0, 3),
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/products/true-level.svg"],
    tags: ["minimal", "soft"],
    inventory: 110,
    createdAt: "2026-07-10T00:00:00.000Z",
  },
  {
    id: "prod_gold_edge",
    slug: "gold-edge-tee",
    name: "Gold Edge Tee",
    description:
      "Premium cut with gold edge detailing and tonal craftsmanship badge.",
    price: 6200,
    category: "premium",
    colors: [SHIRT_COLORS[0], SHIRT_COLORS[2], SHIRT_COLORS[5]],
    sizes: ["S", "M", "L", "XL"],
    images: ["/products/gold-edge.svg"],
    tags: ["premium", "detail"],
    featured: true,
    inventory: 55,
    createdAt: "2026-07-18T00:00:00.000Z",
  },
  {
    id: "prod_stonework",
    slug: "stonework-tee",
    name: "Stonework Tee",
    description:
      "Textured print inspired by cut ashlar. A wearable piece of craft.",
    price: 5400,
    category: "premium",
    colors: [SHIRT_COLORS[1], SHIRT_COLORS[2], SHIRT_COLORS[4]],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: ["/products/stonework.svg"],
    tags: ["texture", "craft"],
    inventory: 70,
    createdAt: "2026-07-22T00:00:00.000Z",
  },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((product) => product.featured);
}

export function getBestSellers() {
  return PRODUCTS.filter((product) => product.bestSeller);
}
