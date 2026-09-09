export type StickerCategoryId =
  | "greetings"
  | "masonic-life"
  | "degrees"
  | "tools"
  | "humor"
  | "celebration"
  | "expressions"
  | "daily";

export type StickerBackground =
  | "none"
  | "parchment"
  | "gold-ring"
  | "columns"
  | "lodge-night"
  | "coffee"
  | "journey";

export type StickerPropId =
  | "coffee"
  | "gavel-float"
  | "apron-fold"
  | "columns-pair"
  | "ashlar"
  | "spark"
  | "moon"
  | "sun";

export type StickerDefinition = {
  id: string;
  name: string;
  category: StickerCategoryId;
  text?: string;
  pose?: string;
  expression?: string;
  mouth?: string;
  apron?: string;
  tool?: string;
  props?: StickerPropId[];
  background?: StickerBackground;
  featured?: boolean;
};

export type StickerCategoryMeta = {
  id: StickerCategoryId | "all" | "favorites";
  label: string;
};
