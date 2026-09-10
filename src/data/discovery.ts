/**
 * Brother Test discoveries — publicly known working tools of the Craft.
 * Symbolic character metaphors only. No private ritual content.
 */

export type DiscoveryId =
  | "gauge"
  | "gavel"
  | "plumb"
  | "square"
  | "level"
  | "trowel";

export type DiscoveryItem = {
  id: DiscoveryId;
  label: string;
  title: string;
  description: string;
  /** Percent positions within the artwork frame */
  x: number;
  y: number;
  /** Existing product IDs only — never invent */
  relatedProductIds: string[];
  /** SVG group id for highlight */
  artworkId: string;
};

export const DISCOVERIES: DiscoveryItem[] = [
  {
    id: "gauge",
    label: "24-inch Gauge",
    title: "The 24-Inch Gauge",
    description:
      "The proper division of time — work, rest, and recreation in balance. Discipline that measures the day.",
    x: 28,
    y: 22,
    relatedProductIds: ["prod_journey", "prod_gold_edge"],
    artworkId: "art-gauge",
  },
  {
    id: "gavel",
    label: "Gavel",
    title: "The Common Gavel",
    description:
      "Removing the rough and unnecessary. Through discipline and self-improvement, the stone becomes fit for the work.",
    x: 78,
    y: 28,
    relatedProductIds: ["prod_ashlar_mark", "prod_stonework"],
    artworkId: "art-gavel",
  },
  {
    id: "plumb",
    label: "Plumb",
    title: "The Plumb",
    description:
      "Uprightness and rectitude — conducting oneself honestly and morally, hanging true.",
    x: 18,
    y: 52,
    relatedProductIds: ["prod_mason_line", "prod_gold_edge"],
    artworkId: "art-plumb",
  },
  {
    id: "square",
    label: "Square",
    title: "The Square",
    description:
      "Acting fairly and morally toward others — learning to square one's actions.",
    x: 48,
    y: 48,
    relatedProductIds: ["prod_mason_line"],
    artworkId: "art-square",
  },
  {
    id: "level",
    label: "Level",
    title: "The Level",
    description:
      "Equality within the fraternity. Regardless of worldly rank, Brothers meet upon the level.",
    x: 72,
    y: 68,
    relatedProductIds: ["prod_level"],
    artworkId: "art-level",
  },
  {
    id: "trowel",
    label: "Trowel",
    title: "The Trowel",
    description:
      "Spreading the cement of brotherly love and affection — joining individuals into a unified Craft.",
    x: 38,
    y: 78,
    relatedProductIds: ["prod_pillar", "prod_journey"],
    artworkId: "art-trowel",
  },
];

export const DISCOVERY_TOTAL = DISCOVERIES.length;

export const DISCOVERY_FEEDBACK = [
  "Good eye.",
  "You found one.",
  "Look closer.",
  "There's more.",
  "You noticed what others missed.",
  "One tool of the Craft.",
  "The work rewards attention.",
] as const;

/** Featured fallback product IDs if mappings miss */
export const DISCOVERY_FALLBACK_PRODUCT_IDS = [
  "prod_ashlar_mark",
  "prod_mason_line",
  "prod_level",
  "prod_journey",
] as const;
