/** Sticker composition types — avatar config stays in @/types AvatarConfig. */

export type StickerCategoryId =
  | "greetings"
  | "masonic-life"
  | "degrees"
  | "humor"
  | "celebration";

export type StickerPackId =
  | "lodge-life"
  | "masonic-humor"
  | "degree-journey"
  | "holidays"
  | "traveling-mason"
  | "coffee-masonry"
  | "classic-masonic"
  | "everyday";

export type StickerPoseId =
  | "standing"
  | "waving"
  | "thumbsUp"
  | "pointing"
  | "celebrating"
  | "thinking"
  | "coffee"
  | "reading"
  | "walking"
  | "handsOnHips"
  | "proud"
  | "surprised"
  | "laughing"
  | "greeting"
  | "holdingGavel"
  | "holdingApron"
  | "holdingWorkingTool"
  | "prayingOrReflective";

export type StickerExpressionId =
  | "neutral"
  | "happy"
  | "smiling"
  | "laughing"
  | "proud"
  | "surprised"
  | "confused"
  | "thinking"
  | "serious"
  | "excited"
  | "sleepy"
  | "wink"
  | "peaceful";

export type StickerPropId =
  | "squareAndCompasses"
  | "gavel"
  | "masonicApron"
  | "coffeeCup"
  | "workingTools"
  | "trowel"
  | "level"
  | "plumb"
  | "lodgeBuilding"
  | "columns"
  | "tracingBoard"
  | "book"
  | "degreeCertificate"
  | "travelBag"
  | "sun"
  | "moon"
  | "spark";

export type StickerBackgroundId =
  | "transparent"
  | "sunrise"
  | "evening"
  | "lodge"
  | "parchment"
  | "goldRing"
  | "journey";

export type StickerTextStyle = "banner" | "badge" | "soft";

export type StickerComposition = {
  pose: StickerPoseId;
  expression: StickerExpressionId;
  props?: StickerPropId[];
  text?: string;
  textStyle?: StickerTextStyle;
  background?: StickerBackgroundId;
  /** Optional AvatarConfig field overrides (apron/tool/etc). */
  avatarOverrides?: Partial<{
    apron: string;
    tool: string;
    mouth: string;
  }>;
};

export type StickerDefinition = {
  id: string;
  name: string;
  category: StickerCategoryId;
  pack: StickerPackId;
  composition: StickerComposition;
  featured?: boolean;
};

export type StickerPack = {
  id: StickerPackId;
  name: string;
  description: string;
  stickers: StickerDefinition[];
};

export type StickerCategoryMeta = {
  id: StickerCategoryId | "all" | "favorites";
  label: string;
};
