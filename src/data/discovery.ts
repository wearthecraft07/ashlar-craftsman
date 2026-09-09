/**
 * Brother Test discoveries — publicly known symbols, tools, architecture,
 * and philosophy only. No private ritual content.
 */

export type DiscoveryId =
  | "square"
  | "compasses"
  | "ashlar"
  | "gavel"
  | "pillars"
  | "level"
  | "plumb"
  | "keystone"
  | "celestial";

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
    id: "square",
    label: "Square",
    title: "The Square",
    description:
      "An enduring symbol of acting with integrity — keeping our actions true.",
    x: 34,
    y: 48,
    relatedProductIds: ["prod_mason_line"],
    artworkId: "art-square",
  },
  {
    id: "compasses",
    label: "Compasses",
    title: "The Compasses",
    description:
      "A call to keep desire within due bounds. Discipline that shapes character.",
    x: 52,
    y: 28,
    relatedProductIds: ["prod_journey", "prod_gold_edge"],
    artworkId: "art-compasses",
  },
  {
    id: "ashlar",
    label: "Ashlar",
    title: "The Rough Ashlar",
    description:
      "The unfinished stone. Progress through deliberate work — always refining.",
    x: 72,
    y: 72,
    relatedProductIds: ["prod_ashlar_mark", "prod_stonework"],
    artworkId: "art-ashlar",
  },
  {
    id: "gavel",
    label: "Gavel",
    title: "The Gavel",
    description:
      "A working tool of order. Used to shape the work and keep harmony in the Craft.",
    x: 82,
    y: 38,
    relatedProductIds: ["prod_level", "prod_journey"],
    artworkId: "art-gavel",
  },
  {
    id: "pillars",
    label: "Pillars",
    title: "The Twin Pillars",
    description:
      "Architectural markers of strength and establishment — a public emblem of the Craft's foundations.",
    x: 18,
    y: 58,
    relatedProductIds: ["prod_pillar"],
    artworkId: "art-pillars",
  },
  {
    id: "level",
    label: "Level",
    title: "The Level",
    description:
      "Equality among Brothers. A reminder that the Craft meets on the level.",
    x: 44,
    y: 78,
    relatedProductIds: ["prod_level"],
    artworkId: "art-level",
  },
  {
    id: "plumb",
    label: "Plumb",
    title: "The Plumb",
    description:
      "Upright conduct. A working tool that asks whether our lives hang true.",
    x: 22,
    y: 32,
    relatedProductIds: ["prod_mason_line", "prod_gold_edge"],
    artworkId: "art-plumb",
  },
  {
    id: "keystone",
    label: "Keystone",
    title: "The Keystone",
    description:
      "The stone that locks the arch. Architecture teaching that each piece bears weight for the whole.",
    x: 58,
    y: 52,
    relatedProductIds: ["prod_stonework", "prod_ashlar_mark"],
    artworkId: "art-keystone",
  },
  {
    id: "celestial",
    label: "Celestial",
    title: "The Celestial Canopy",
    description:
      "A public architectural allusion to the heavens above — the Craft framed by something larger than itself.",
    x: 68,
    y: 16,
    relatedProductIds: ["prod_journey", "prod_gold_edge"],
    artworkId: "art-celestial",
  },
];

export const DISCOVERY_TOTAL = DISCOVERIES.length;

export const DISCOVERY_FEEDBACK = [
  "Good eye.",
  "You found one.",
  "Look closer.",
  "There's more.",
  "You noticed what others missed.",
  "One piece of the Craft.",
  "The work rewards attention.",
] as const;

/** Featured fallback product IDs if mappings miss */
export const DISCOVERY_FALLBACK_PRODUCT_IDS = [
  "prod_ashlar_mark",
  "prod_mason_line",
  "prod_pillar",
  "prod_journey",
] as const;
