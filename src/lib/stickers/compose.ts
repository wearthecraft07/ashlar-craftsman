import type { AvatarConfig } from "@/types";
import type { StickerComposition, StickerPoseId } from "@/types/stickers";
import {
  STICKER_EXPRESSION_TO_AVATAR,
  STICKER_POSE_TO_AVATAR,
} from "@/lib/stickers/poses";

/**
 * Apply sticker composition onto the user's AvatarConfig.
 * Never replaces identity fields (skin, hair, clothing, etc.).
 *
 * Important: production apron overlays (`/apron/ea|fc|mm.webp`) are
 * full-frame centered emblems. When composed as avatar layers they paint
 * over the craftsman's face. Character plates already bake apron geometry
 * (including Square & Compass on the apron), so stickers always use
 * `apron: "plain"` — keep plate apron, skip the overlay layer.
 *
 * Stickers also force `beard: "none"`. Beard overlays are misaligned in
 * sticker card crops; Avatar Studio / production library keep the user's
 * beard selection unchanged.
 */
export function composeAvatarConfig(
  base: AvatarConfig,
  composition: StickerComposition,
): AvatarConfig {
  const pose = STICKER_POSE_TO_AVATAR[composition.pose];
  const expressionPatch =
    STICKER_EXPRESSION_TO_AVATAR[composition.expression];

  const toolFromPose = toolForPose(composition.pose);

  return {
    ...base,
    pose,
    expression: expressionPatch.expression,
    mouth: expressionPatch.mouth ?? base.mouth,
    tool: composition.avatarOverrides?.tool ?? toolFromPose ?? base.tool,
    apron: "plain",
    beard: "none",
    clothing: composition.avatarOverrides?.clothing ?? base.clothing,
    clothingColor:
      composition.avatarOverrides?.clothingColor ?? base.clothingColor,
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
