import { AnnouncementBanner } from "@/components/home/AnnouncementBanner";
import { BestSellers } from "@/components/home/BestSellers";
import { Collections } from "@/components/home/Collections";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { Testimonials } from "@/components/home/Testimonials";
import { getHeroContent } from "@/lib/content/site";

export default async function HomePage() {
  const hero = await getHeroContent();

  return (
    <>
      <AnnouncementBanner />
      <Hero
        content={{
          title: hero.title,
          subtitle: hero.subtitle,
          buttonText: hero.buttonText,
          buttonHref: hero.buttonHref,
        }}
      />
      <Collections />
      <BestSellers />
      <Gallery />
      <Testimonials />
      <Newsletter />
    </>
  );
}
