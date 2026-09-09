import type { AvatarConfig } from "@/types";
import type { StickerComposition, StickerPoseId } from "@/types/stickers";
import {
  STICKER_EXPRESSION_TO_AVATAR,
  STICKER_POSE_TO_AVATAR,
} from "@/lib/stickers/poses";

/**
 * Apply sticker composition onto the user's AvatarConfig.
 * Never replaces identity fields (skin, hair, clothing, etc.).
 */
export function composeAvatarConfig(
  base: AvatarConfig,
  composition: StickerComposition,
): AvatarConfig {
  const pose = STICKER_POSE_TO_AVATAR[composition.pose];
  const expressionPatch =
    STICKER_EXPRESSION_TO_AVATAR[composition.expression];

  const toolFromPose = toolForPose(composition.pose);
  const apronFromPose =
    composition.pose === "holdingApron" ? base.apron || "mm" : undefined;

  return {
    ...base,
    pose,
    expression: expressionPatch.expression,
    mouth: expressionPatch.mouth ?? base.mouth,
    tool: composition.avatarOverrides?.tool ?? toolFromPose ?? base.tool,
    apron:
      composition.avatarOverrides?.apron ??
      apronFromPose ??
      base.apron,
    ...(composition.avatarOverrides?.mouth
      ? { mouth: composition.avatarOverrides.mouth }
      : {}),
  };
}

function toolForPose(pose: StickerPoseId): string | undefined {
  if (pose === "holdingGavel") return "gavel";
  if (pose === "holdingWorkingTool") return "trowel";
  return undefined;
}
