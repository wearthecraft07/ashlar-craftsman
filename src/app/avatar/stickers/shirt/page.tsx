import type { Metadata } from "next";
import { ShirtCustomizer } from "@/components/stickers/ShirtCustomizer";

export const metadata: Metadata = {
  title: "Put Your Sticker on a Shirt",
  description:
    "Turn your Ashlar Craftsman sticker into a wearable shirt design — your character, your placement, your shirt.",
};

/** Separate route already code-splits this from Sticker Studio. */
export default function ShirtCustomizerPage() {
  return <ShirtCustomizer />;
}
