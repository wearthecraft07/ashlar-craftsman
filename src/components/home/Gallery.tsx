"use client";

import { motion } from "framer-motion";
import { AvatarCanvas } from "@/avatar/AvatarCanvas";
import { DEFAULT_AVATAR } from "@/avatar/options";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GALLERY } from "@/data/content";

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Customer Gallery"
          title="Avatars in the wild."
          description="Original cartoon characters built in the studio and worn on the street."
          align="center"
        />
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {GALLERY.map((item, index) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white p-3 shadow-[0_20px_50px_rgba(10,10,10,0.06)]"
            >
              <AvatarCanvas
                config={{ ...DEFAULT_AVATAR, ...item.avatarSeed }}
                decorative
              />
              <figcaption className="mt-2 px-1 pb-1 text-sm text-[var(--muted)]">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
