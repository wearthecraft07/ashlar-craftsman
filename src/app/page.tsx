import { BestSellers } from "@/components/home/BestSellers";
import { Collections } from "@/components/home/Collections";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Collections />
      <BestSellers />
      <Gallery />
      <Testimonials />
      <Newsletter />
    </>
  );
}
