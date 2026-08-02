import type { GalleryItem, Testimonial } from "@/types";

export const COLLECTIONS = [
  {
    id: "essentials",
    title: "Essentials",
    blurb: "Everyday blanks with gold marks and clean lines.",
    href: "/shop?category=essentials",
    accent: "#C9A227",
  },
  {
    id: "premium",
    title: "Premium Craft",
    blurb: "Heavier fabrics, sharper prints, lasting silhouette.",
    href: "/shop?category=premium",
    accent: "#F7F7F5",
  },
  {
    id: "limited",
    title: "Limited Drops",
    blurb: "Small-run artwork for collectors of the craft.",
    href: "/shop?category=limited",
    accent: "#2A2A2A",
  },
  {
    id: "custom",
    title: "Avatar Studio",
    blurb: "Build your character. Wear your journey.",
    href: "/avatar",
    accent: "#C9A227",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Marcus R.",
    role: "Collector",
    quote:
      "The avatar tee feels personal without looking gimmicky. Premium weight, sharp print, and the gold details hit.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Aisha K.",
    role: "Street stylist",
    quote:
      "Clean black and gold palette that layers with everything. The cartoon style is expressive and original.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Devon L.",
    role: "Craft enthusiast",
    quote:
      "Built my avatar in minutes, previewed on three shirt colors, and checked out. Smooth from studio to doorstep.",
    rating: 5,
  },
];

export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    caption: "MM apron energy",
    avatarSeed: {
      hair: "wavy",
      clothing: "suit",
      clothingColor: "navy",
      apron: "mm",
      gloves: "white",
      expression: "confident",
    },
  },
  {
    id: "g2",
    caption: "Charcoal classic",
    avatarSeed: {
      hair: "fade",
      beard: "full",
      glasses: "round",
      clothing: "sports_coat",
      clothingColor: "charcoal",
      apron: "plain",
      collar: "blue",
    },
  },
  {
    id: "g3",
    caption: "Journey mode",
    avatarSeed: {
      hat: "cap",
      pose: "wave",
      expression: "smile",
      clothing: "suit",
      clothingColor: "black",
      tool: "gavel",
      apron: "ea",
    },
  },
  {
    id: "g4",
    caption: "Barong evening",
    avatarSeed: {
      hair: "curly",
      skin: "deep",
      glasses: "square",
      clothing: "barong",
      clothingColor: "cream",
      apron: "none",
      gloves: "none",
      shoes: "dress",
    },
  },
  {
    id: "g5",
    caption: "Black tie",
    avatarSeed: {
      hair: "bun",
      clothing: "tuxedo",
      clothingColor: "black",
      expression: "wink",
      collar: "gold",
      apron: "fc",
    },
  },
  {
    id: "g6",
    caption: "Formal craft",
    avatarSeed: {
      hair: "afro",
      beard: "goatee",
      pose: "power",
      clothing: "formal",
      clothingColor: "ink",
      hat: "top",
      tool: "square-compass",
      apron: "mm",
    },
  },
];
