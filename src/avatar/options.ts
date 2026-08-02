import type { AvatarConfig } from "@/types";

export const AVATAR_OPTIONS = {
  face: [
    { id: "round", label: "Round" },
    { id: "oval", label: "Oval" },
    { id: "square", label: "Square" },
    { id: "heart", label: "Heart" },
  ],
  skin: [
    { id: "fair", label: "Fair", tone: "#F6D7C3", shade: "#E8BFA8" },
    { id: "light", label: "Light", tone: "#E8C2A0", shade: "#D4A882" },
    { id: "medium", label: "Medium", tone: "#C98A4E", shade: "#A86E38" },
    { id: "tan", label: "Tan", tone: "#A86B3C", shade: "#86522C" },
    { id: "deep", label: "Deep", tone: "#6E4028", shade: "#4E2C1A" },
    { id: "rich", label: "Rich", tone: "#3F2416", shade: "#2A160E" },
  ],
  eyes: [
    { id: "round", label: "Round" },
    { id: "wide", label: "Wide" },
    { id: "almond", label: "Almond" },
    { id: "lidded", label: "Lidded" },
  ],
  eyebrows: [
    { id: "soft", label: "Soft" },
    { id: "arched", label: "Arched" },
    { id: "thick", label: "Thick" },
    { id: "straight", label: "Straight" },
  ],
  nose: [
    { id: "button", label: "Button" },
    { id: "soft", label: "Soft" },
    { id: "broad", label: "Broad" },
  ],
  mouth: [
    { id: "smile", label: "Smile" },
    { id: "grin", label: "Grin" },
    { id: "neutral", label: "Neutral" },
    { id: "smirk", label: "Smirk" },
  ],
  hair: [
    { id: "short", label: "Short" },
    { id: "fade", label: "Fade" },
    { id: "wavy", label: "Wavy" },
    { id: "curly", label: "Curly" },
    { id: "afro", label: "Afro" },
    { id: "bun", label: "Bun" },
    { id: "long", label: "Long" },
    { id: "bald", label: "Bald" },
  ],
  hairColor: [
    { id: "ink", label: "Ink", tone: "#1B1612", shade: "#0D0A08" },
    { id: "brown", label: "Brown", tone: "#3B2F24", shade: "#241C16" },
    { id: "chestnut", label: "Chestnut", tone: "#6B3F22", shade: "#4A2A16" },
    { id: "blonde", label: "Blonde", tone: "#D2B07A", shade: "#B08C52" },
    { id: "copper", label: "Copper", tone: "#B8622E", shade: "#8A441C" },
    { id: "silver", label: "Silver", tone: "#C2C2C2", shade: "#8E8E8E" },
  ],
  beard: [
    { id: "none", label: "Clean" },
    { id: "stubble", label: "Stubble" },
    { id: "full", label: "Full" },
    { id: "goatee", label: "Goatee" },
    { id: "mustache", label: "Mustache" },
  ],
  glasses: [
    { id: "none", label: "None" },
    { id: "round", label: "Round" },
    { id: "square", label: "Square" },
    { id: "half", label: "Half-rim" },
  ],
  hat: [
    { id: "none", label: "None" },
    { id: "cap", label: "Cap" },
    { id: "beanie", label: "Beanie" },
    { id: "bucket", label: "Bucket" },
    { id: "fez", label: "Fez" },
    { id: "top", label: "Top Hat" },
  ],
  body: [
    { id: "slim", label: "Slim" },
    { id: "average", label: "Average" },
    { id: "broad", label: "Broad" },
  ],
  clothing: [
    { id: "suit", label: "Business Suit" },
    { id: "sports_coat", label: "Sports Coat" },
    { id: "tuxedo", label: "Tuxedo" },
    { id: "formal", label: "Formal Wear" },
    { id: "barong", label: "Barong Tagalog" },
  ],
  clothingColor: [
    { id: "black", label: "Black", tone: "#151515", shade: "#050505" },
    { id: "charcoal", label: "Charcoal", tone: "#2F2F2F", shade: "#1A1A1A" },
    { id: "navy", label: "Navy", tone: "#1E3A5F", shade: "#12243C" },
    { id: "ink", label: "Ink", tone: "#1A2233", shade: "#0D121C" },
    { id: "cream", label: "Cream", tone: "#F2E8D5", shade: "#D9CDB6" },
    { id: "white", label: "White", tone: "#F7F4EE", shade: "#E2DCCF" },
    { id: "gold", label: "Gold", tone: "#C9A227", shade: "#9A7A14" },
  ],
  shoes: [
    { id: "dress", label: "Dress Shoes" },
    { id: "boots", label: "Boots" },
    { id: "sneakers", label: "Sneakers" },
  ],
  expression: [
    { id: "smile", label: "Smile" },
    { id: "friendly", label: "Friendly" },
    { id: "confident", label: "Confident" },
    { id: "wink", label: "Wink" },
    { id: "laugh", label: "Laugh" },
  ],
  pose: [
    { id: "idle", label: "Idle" },
    { id: "wave", label: "Wave" },
    { id: "power", label: "Power" },
    { id: "lean", label: "Lean" },
  ],
  apron: [
    { id: "none", label: "None" },
    { id: "plain", label: "Plain White" },
    { id: "ea", label: "EA" },
    { id: "fc", label: "FC" },
    { id: "mm", label: "MM" },
  ],
  collar: [
    { id: "none", label: "None" },
    { id: "blue", label: "Blue" },
    { id: "red", label: "Red" },
    { id: "gold", label: "Gold" },
  ],
  gloves: [
    { id: "none", label: "None" },
    { id: "white", label: "White" },
    { id: "cream", label: "Cream" },
  ],
  ring: [
    { id: "none", label: "None" },
    { id: "gold", label: "Gold Band" },
    { id: "signet", label: "Signet" },
  ],
  tool: [
    { id: "none", label: "None" },
    { id: "gavel", label: "Gavel" },
    { id: "square-compass", label: "Square & Compasses" },
    { id: "trowel", label: "Trowel" },
    { id: "level", label: "Level" },
    { id: "plumb", label: "Plumb" },
  ],
} as const;

export const DEFAULT_AVATAR: AvatarConfig = {
  face: "round",
  skin: "medium",
  eyes: "round",
  eyebrows: "soft",
  nose: "button",
  mouth: "smile",
  hair: "short",
  hairColor: "ink",
  beard: "none",
  glasses: "none",
  hat: "none",
  body: "average",
  clothing: "suit",
  clothingColor: "navy",
  shoes: "dress",
  expression: "smile",
  pose: "idle",
  apron: "mm",
  collar: "none",
  gloves: "white",
  ring: "none",
  tool: "none",
};

export const AVATAR_CATEGORIES: {
  key: keyof typeof AVATAR_OPTIONS;
  label: string;
}[] = [
  { key: "face", label: "Face" },
  { key: "skin", label: "Skin" },
  { key: "eyes", label: "Eyes" },
  { key: "eyebrows", label: "Brows" },
  { key: "nose", label: "Nose" },
  { key: "mouth", label: "Mouth" },
  { key: "hair", label: "Hair" },
  { key: "hairColor", label: "Hair Color" },
  { key: "beard", label: "Beard" },
  { key: "expression", label: "Expression" },
  { key: "glasses", label: "Glasses" },
  { key: "hat", label: "Hats" },
  { key: "body", label: "Body" },
  { key: "clothing", label: "Clothing" },
  { key: "clothingColor", label: "Suit Color" },
  { key: "apron", label: "Apron" },
  { key: "collar", label: "Collar" },
  { key: "gloves", label: "Gloves" },
  { key: "ring", label: "Ring" },
  { key: "tool", label: "Tools" },
  { key: "shoes", label: "Shoes" },
  { key: "pose", label: "Pose" },
];

export function getTone(
  group: "skin" | "hairColor" | "clothingColor",
  id: string,
  kind: "tone" | "shade" = "tone",
) {
  const option = AVATAR_OPTIONS[group].find((item) => item.id === id) as
    | { tone?: string; shade?: string }
    | undefined;
  if (kind === "shade") return option?.shade ?? option?.tone ?? "#A86E38";
  return option?.tone ?? "#C98A4E";
}
