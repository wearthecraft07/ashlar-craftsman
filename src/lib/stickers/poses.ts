import type { StickerExpressionId, StickerPoseId } from "@/types/stickers";

/** Maps sticker pose → AvatarCanvas pose id (extended set). */
export const STICKER_POSE_TO_AVATAR: Record<StickerPoseId, string> = {
  standing: "idle",
  waving: "wave",
  thumbsUp: "thumbsUp",
  pointing: "pointing",
  celebrating: "celebrate",
  thinking: "think",
  coffee: "idle",
  reading: "idle",
  walking: "lean",
  handsOnHips: "hips",
  proud: "power",
  surprised: "idle",
  laughing: "idle",
  greeting: "wave",
  holdingGavel: "idle",
  holdingApron: "idle",
  holdingWorkingTool: "idle",
  prayingOrReflective: "pray",
};

export type ExpressionPatch = {
  expression: string;
  mouth?: string;
};

/** Maps sticker expression → AvatarConfig expression/mouth. */
export const STICKER_EXPRESSION_TO_AVATAR: Record<
  StickerExpressionId,
  ExpressionPatch
> = {
  neutral: { expression: "serious", mouth: "neutral" },
  happy: { expression: "friendly", mouth: "smile" },
  smiling: { expression: "smile", mouth: "smile" },
  laughing: { expression: "laugh", mouth: "grin" },
  proud: { expression: "confident", mouth: "smirk" },
  surprised: { expression: "surprised", mouth: "open" },
  confused: { expression: "confused", mouth: "neutral" },
  thinking: { expression: "thinking", mouth: "neutral" },
  serious: { expression: "serious", mouth: "neutral" },
  excited: { expression: "laugh", mouth: "grin" },
  sleepy: { expression: "sleepy", mouth: "neutral" },
  wink: { expression: "wink", mouth: "smile" },
  peaceful: { expression: "friendly", mouth: "smile" },
};
