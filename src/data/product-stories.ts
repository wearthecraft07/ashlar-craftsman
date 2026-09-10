/**
 * Product storytelling — separate from ecommerce Product records.
 * Public symbolism only. No invented manufacturing claims.
 */

import type { DiscoveryId } from "@/data/discovery";

export type ProductStorySymbol = {
  name: string;
  meaning: string;
};

export type ProductStoryQuality = {
  label: string;
  /** Must come from existing product copy or confirmed site facts */
  value: string;
};

export type ProductStory = {
  /** Match against product.id or product.slug */
  productId: string;
  slug: string;
  collectionLabel: string;
  philosophy: string;
  story: string[];
  represents: {
    symbol: string;
    theme: string;
    idea: string;
  };
  lookCloser: ProductStorySymbol[];
  forThoseWhoKnow?: {
    intro: string;
    details: string[];
  };
  quality?: ProductStoryQuality[];
  /** Link back to Brother Test — use sparingly */
  showBrotherTestLink?: boolean;
  relatedDiscoveryIds?: DiscoveryId[];
};

const CATEGORY_COLLECTION: Record<string, string> = {
  essentials: "The Rough Ashlar",
  premium: "The Working Tools",
  limited: "The Traveling Craftsman",
  custom: "Avatar Studio",
};

export function collectionLabelForCategory(category: string): string {
  return CATEGORY_COLLECTION[category] ?? "The Ashlar Craftsman";
}

export const PRODUCT_STORIES: ProductStory[] = [
  {
    productId: "prod_ashlar_mark",
    slug: "ashlar-mark-tee",
    collectionLabel: "The Rough Ashlar",
    philosophy: "For the Mason still doing the work.",
    story: [
      "Built around the idea of the Rough Ashlar—the stone is not finished when it is found. It is shaped through deliberate work.",
      "The mark translates that idea into a piece meant to be worn beyond the Lodge.",
    ],
    represents: {
      symbol: "The Ashlar",
      theme: "Refinement",
      idea: "Progress through deliberate work — never finished, always refining.",
    },
    lookCloser: [
      {
        name: "The Mark",
        meaning: "A quiet emblem of craft — present without demanding explanation.",
      },
      {
        name: "The Ashlar",
        meaning: "A reminder that refinement is a process.",
      },
      {
        name: "Gold accent",
        meaning: "Restraint over spectacle — the Craft carried lightly.",
      },
    ],
    forThoseWhoKnow: {
      intro: "Some details reveal themselves slowly.",
      details: [
        "The ashlar is unfinished by design — the work continues after the Lodge closes.",
        "The mark sits where attention naturally falls, then rewards a second look.",
      ],
    },
    quality: [
      { label: "Fabric", value: "Heavyweight cotton" },
      { label: "Finish", value: "Embroidered gold mark · clean silhouette" },
    ],
    showBrotherTestLink: true,
    relatedDiscoveryIds: ["gavel"],
  },
  {
    productId: "prod_journey",
    slug: "craft-your-journey",
    collectionLabel: "The Working Tools",
    philosophy: "Carry the Craft beyond the Lodge.",
    story: [
      "Craft Your Journey is the house tagline made wearable — a reminder that character is built over time, not declared once.",
      "The outline artwork keeps the idea bold without becoming a costume.",
    ],
    represents: {
      symbol: "The Journey",
      theme: "Path",
      idea: "Every Brother walks a different road — this piece marks the commitment to keep walking.",
    },
    lookCloser: [
      {
        name: "The line",
        meaning: "A path drawn with intention — clear, continuous, unfinished.",
      },
      {
        name: "The words",
        meaning: "Not a slogan for strangers. A note to yourself.",
      },
    ],
    forThoseWhoKnow: {
      intro: "Some details reveal themselves slowly.",
      details: [
        "The journey is the Craft applied to daily life — not a destination on a map.",
      ],
    },
    quality: [
      { label: "Intent", value: "Built for movement and lasting wear" },
    ],
    showBrotherTestLink: true,
    relatedDiscoveryIds: ["gauge", "trowel"],
  },
  {
    productId: "prod_mason_line",
    slug: "square-line-tee",
    collectionLabel: "The Rough Ashlar",
    philosophy: "Made for Brothers who see more.",
    story: [
      "Geometry as character. The Square Line Tee uses proportion and angle — publicly known language of the Craft — without shouting.",
      "Designed for those who recognize the line work, and for those who simply prefer clean form.",
    ],
    represents: {
      symbol: "The Square",
      theme: "Integrity",
      idea: "Acting with integrity — keeping our actions true.",
    },
    lookCloser: [
      {
        name: "The Square",
        meaning: "An enduring symbol of acting with integrity.",
      },
      {
        name: "Proportion",
        meaning: "Measured lines — the Craft as architecture, not ornament.",
      },
      {
        name: "Negative space",
        meaning: "What is left unsaid matters as much as what is drawn.",
      },
    ],
    forThoseWhoKnow: {
      intro: "Some details reveal themselves slowly.",
      details: [
        "Right angles do more than decorate — they ask whether conduct hangs true.",
        "The charcoal field lets the geometry speak first.",
      ],
    },
    quality: [
      { label: "Motif", value: "Geometric craft motif" },
    ],
    showBrotherTestLink: true,
    relatedDiscoveryIds: ["square", "plumb"],
  },
  {
    productId: "prod_avatar_custom",
    slug: "custom-avatar-tee",
    collectionLabel: "Avatar Studio",
    philosophy: "Your journey is your own.",
    story: [
      "The Custom Avatar Tee begins in the studio — you build the character that represents your path, then wear it.",
      "It is personal without becoming a costume. The Craft remains in the details you choose.",
    ],
    represents: {
      symbol: "The Character",
      theme: "Identity",
      idea: "Build the mark that represents your journey — then carry it beyond the Lodge.",
    },
    lookCloser: [
      {
        name: "Your mark",
        meaning: "No two Craftsmen are identical — neither are these.",
      },
      {
        name: "The studio",
        meaning: "Formalwear, regalia accents, and expression — chosen with intent.",
      },
    ],
    quality: [
      { label: "Blank", value: "Printed on premium blanks" },
      { label: "Process", value: "Designed in Avatar Studio" },
    ],
    showBrotherTestLink: false,
  },
  {
    productId: "prod_pillar",
    slug: "twin-pillars-tee",
    collectionLabel: "The Traveling Craftsman",
    philosophy: "Strength and establishment — worn lightly.",
    story: [
      "Twin pillars are among the Craft’s most recognizable public architectural emblems — strength and establishment rendered as form.",
      "This limited piece keeps the illustration intentional: presence without spectacle.",
    ],
    represents: {
      symbol: "The Twin Pillars",
      theme: "Foundation",
      idea: "Architecture teaching that a Craft needs both strength and establishment.",
    },
    lookCloser: [
      {
        name: "The pillars",
        meaning: "Public architectural markers of strength and establishment.",
      },
      {
        name: "Gold ink",
        meaning: "Accent, not excess — the Craft in restrained contrast.",
      },
      {
        name: "Spacing",
        meaning: "Two uprights, one idea — balance held in the gap between.",
      },
    ],
    forThoseWhoKnow: {
      intro: "Some details reveal themselves slowly.",
      details: [
        "Pillars mark a threshold — what you carry in, and what you carry out.",
      ],
    },
    quality: [
      { label: "Edition", value: "Limited drop" },
      { label: "Detail", value: "Gold ink accents" },
    ],
    showBrotherTestLink: true,
    relatedDiscoveryIds: ["level", "plumb"],
  },
  {
    productId: "prod_level",
    slug: "true-level-tee",
    collectionLabel: "The Rough Ashlar",
    philosophy: "Meet on the level.",
    story: [
      "The Level is a working tool of equality — Brothers meet without rank on the tiled floor of daily life.",
      "This piece keeps the mark minimal so the idea can breathe.",
    ],
    represents: {
      symbol: "The Level",
      theme: "Equality",
      idea: "A reminder that the Craft meets on the level.",
    },
    lookCloser: [
      {
        name: "The Level",
        meaning: "Equality among Brothers — presence without hierarchy.",
      },
      {
        name: "Minimal mark",
        meaning: "Maximum presence through restraint.",
      },
    ],
    forThoseWhoKnow: {
      intro: "Some details reveal themselves slowly.",
      details: [
        "A true level asks a quiet question: are we standing as equals in the work?",
      ],
    },
    quality: [
      { label: "Feel", value: "Soft hand-feel" },
      { label: "Construction", value: "Reinforced collar" },
    ],
    showBrotherTestLink: true,
    relatedDiscoveryIds: ["level"],
  },
  {
    productId: "prod_gold_edge",
    slug: "gold-edge-tee",
    collectionLabel: "The Working Tools",
    philosophy: "Built with purpose.",
    story: [
      "Gold Edge is about finish — the last careful pass on a piece of work.",
      "Tonal craftsmanship detailing keeps the luxury quiet and the mark intentional.",
    ],
    represents: {
      symbol: "The Edge",
      theme: "Finish",
      idea: "Craftsmanship is often found at the margin — where attention meets restraint.",
    },
    lookCloser: [
      {
        name: "Gold edge",
        meaning: "Detailing that rewards attention, not distance.",
      },
      {
        name: "Craft badge",
        meaning: "A tonal mark — present for those who look closer.",
      },
    ],
    forThoseWhoKnow: {
      intro: "Some details reveal themselves slowly.",
      details: [
        "The edge is where rough work becomes true — a public metaphor of the Craft.",
      ],
    },
    quality: [
      { label: "Cut", value: "Premium cut" },
      { label: "Detail", value: "Gold edge detailing · tonal craftsmanship badge" },
    ],
    showBrotherTestLink: false,
    relatedDiscoveryIds: ["square", "gauge"],
  },
  {
    productId: "prod_stonework",
    slug: "stonework-tee",
    collectionLabel: "The Working Tools",
    philosophy: "The work continues.",
    story: [
      "Stonework takes its cue from cut ashlar — texture as philosophy. The stone improves under the tool.",
      "A wearable reminder that character, like masonry, is shaped over time.",
    ],
    represents: {
      symbol: "Cut Ashlar",
      theme: "Labor",
      idea: "Texture inspired by stone that has been worked — not left rough, not yet perfect.",
    },
    lookCloser: [
      {
        name: "Texture",
        meaning: "Print inspired by cut ashlar — labor made visible.",
      },
      {
        name: "The stone",
        meaning: "Every surface records the tool that shaped it.",
      },
      {
        name: "The field",
        meaning: "Quiet background so the craft can speak.",
      },
    ],
    forThoseWhoKnow: {
      intro: "Some details reveal themselves slowly.",
      details: [
        "Cut ashlar is public language for progress — the stone after the work has begun.",
      ],
    },
    quality: [
      { label: "Print", value: "Textured print inspired by cut ashlar" },
    ],
    showBrotherTestLink: true,
    relatedDiscoveryIds: ["gavel", "trowel"],
  },
];

export function getProductStory(
  product: { id: string; slug: string; category: string; description: string },
): ProductStory {
  const found =
    PRODUCT_STORIES.find(
      (s) => s.productId === product.id || s.slug === product.slug,
    ) ?? null;

  if (found) return found;

  // Safe fallback — no invented manufacturing claims
  return {
    productId: product.id,
    slug: product.slug,
    collectionLabel: collectionLabelForCategory(product.category),
    philosophy: "Built with purpose.",
    story: [
      product.description,
      "Designed for Brothers who carry the Craft beyond the Lodge.",
    ],
    represents: {
      symbol: "The Craft",
      theme: "Intention",
      idea: "A piece made to be worn with meaning — not costume.",
    },
    lookCloser: [
      {
        name: "The design",
        meaning: "Details reward attention. Look closer.",
      },
    ],
    showBrotherTestLink: false,
  };
}
