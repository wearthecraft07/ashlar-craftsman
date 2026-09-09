import type { Metadata } from "next";
import { StickerStudio } from "@/components/stickers/StickerStudio";

export const metadata: Metadata = {
  title: "Craft Your Stickers",
  description:
    "Turn your Ashlar Craftsman avatar into a personalized Masonic sticker pack — greetings, lodge life, degrees, and more.",
};

export default function StickerStudioPage() {
  return <StickerStudio />;
}
