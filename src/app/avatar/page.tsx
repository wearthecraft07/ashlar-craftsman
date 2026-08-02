import type { Metadata } from "next";
import { AvatarStudio } from "@/components/avatar/AvatarStudio";

export const metadata: Metadata = {
  title: "Avatar Studio",
  description:
    "Build an original 2D cartoon avatar, preview on shirts, save, download, and add to cart.",
};

export default function AvatarPage() {
  return <AvatarStudio />;
}
