import type { Metadata } from "next";
import { AvatarStudio } from "@/components/avatar/AvatarStudio";
import { getAvatarCatalog } from "@/lib/avatar/catalog";

export const metadata: Metadata = {
  title: "Avatar Studio",
  description:
    "Build an original 2D cartoon avatar, preview on shirts, save, download, and add to cart.",
};

export default async function AvatarPage() {
  const { categories } = await getAvatarCatalog();
  return <AvatarStudio catalog={categories} />;
}
