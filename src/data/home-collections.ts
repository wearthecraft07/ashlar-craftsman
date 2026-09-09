/**
 * Homepage editorial collections.
 * Links only to real shop categories / routes — no fake destinations.
 */
export const HOME_COLLECTIONS = [
  {
    id: "rough-ashlar",
    name: "The Rough Ashlar",
    philosophy: "For the Mason still doing the work.",
    href: "/shop?category=essentials",
    cta: "Explore",
    eyebrow: "Essentials",
    accent: "#C8A24A",
    comingSoon: false,
  },
  {
    id: "working-tools",
    name: "The Working Tools",
    philosophy: "Symbols of labor, worn with intention.",
    href: "/shop?category=premium",
    cta: "Explore",
    eyebrow: "Premium",
    accent: "#F7F2E7",
    comingSoon: false,
  },
  {
    id: "traveling",
    name: "The Traveling Craftsman",
    philosophy: "For Brothers who carry the Craft on the road.",
    href: "/shop?category=limited",
    cta: "Explore",
    eyebrow: "Limited",
    accent: "#9C6A3A",
    comingSoon: false,
  },
  {
    id: "masters",
    name: "The Master's Collection",
    philosophy: "Refined marks for those who have done the work.",
    href: "/shop?category=premium",
    cta: "Explore",
    eyebrow: "Featured",
    accent: "#C8A24A",
    comingSoon: false,
  },
  {
    id: "lodge-editions",
    name: "Lodge Editions",
    philosophy: "Your Lodge. Your history. Your mark.",
    href: "/lodge-edition",
    cta: "Make it your Lodge",
    eyebrow: "Personal",
    accent: "#5C4331",
    comingSoon: false,
  },
] as const;
