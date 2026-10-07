import type { StickerExpressionId, StickerPoseId } from "@/types/stickers";

/** Maps sticker pose → AvatarCanvas pose id (production poses only). */
export const STICKER_POSE_TO_AVATAR: Record<StickerPoseId, string> = {
  standing: "idle",
  waving: "wave",
  thumbsUp: "power",
  pointing: "lean",
  celebrating: "wave",
  thinking: "idle",
  coffee: "idle",
  reading: "idle",
  walking: "lean",
  handsOnHips: "power",
  proud: "power",
  surprised: "idle",
  laughing: "idle",
  greeting: "wave",
  holdingGavel: "idle",
  holdingApron: "idle",
  holdingWorkingTool: "idle",
  prayingOrReflective: "idle",
  handOverHeart: "idle",
  armsCrossed: "power",
  leaningIn: "lean",
  lookingBackWave: "wave",
  handshake: "lean",
};

export type ExpressionPatch = {
  expression: string;
  mouth?: string;
};

/** Maps sticker expression → AvatarConfig expression/mouth (genuine options preferred). */
export const STICKER_EXPRESSION_TO_AVATAR: Record<
  StickerExpressionId,
  ExpressionPatch
> = {
  neutral: { expression: "smile", mouth: "smile" },
  happy: { expression: "friendly", mouth: "smile" },
  smiling: { expression: "smile", mouth: "smile" },
  laughing: { expression: "laugh", mouth: "smile" },
  proud: { expression: "confident", mouth: "smile" },
  surprised: { expression: "friendly", mouth: "smile" },
  confused: { expression: "smile", mouth: "smile" },
  thinking: { expression: "confident", mouth: "smile" },
  serious: { expression: "confident", mouth: "smile" },
  excited: { expression: "friendly", mouth: "smile" },
  sleepy: { expression: "smile", mouth: "smile" },
  wink: { expression: "wink", mouth: "smile" },
  peaceful: { expression: "friendly", mouth: "smile" },
  concerned: { expression: "friendly", mouth: "smile" },
  confident: { expression: "confident", mouth: "smile" },
};
