import type { Metadata } from "next";
import { AnnouncementBanner } from "@/components/home/AnnouncementBanner";
import { AvatarStudioFeature } from "@/components/home/AvatarStudioFeature";
import { BrandStatement } from "@/components/home/BrandStatement";
import { Collections } from "@/components/home/Collections";
import { CraftsmanQuizTeaser } from "@/components/home/CraftsmanQuizTeaser";
import { DiscoveryTeaser } from "@/components/home/DiscoveryTeaser";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { LodgeEditionTeaser } from "@/components/home/LodgeEditionTeaser";
import { MilestonesTeaser } from "@/components/home/MilestonesTeaser";
import { Newsletter } from "@/components/home/Newsletter";
import { Philosophy } from "@/components/home/Philosophy";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Craft Your Character",
  description:
    "Masonic-inspired apparel for Brothers who carry the Craft beyond the Lodge. Premium menswear rooted in craftsmanship, symbolism, and discovery.",
  openGraph: {
    title: "the ASHLAR CRAFTSMAN — Craft Your Character",
    description:
      "Masonic-inspired apparel for Brothers who carry the Craft beyond the Lodge.",
  },
};

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <Philosophy />
      <DiscoveryTeaser />
      <Collections />
      <FeaturedProducts />
      <CraftsmanQuizTeaser />
      <LodgeEditionTeaser />
      <MilestonesTeaser />
      <AvatarStudioFeature />
      <BrandStatement />
      <FinalCta />
      <Newsletter />
    </>
  );
}
