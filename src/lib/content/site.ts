import { createPublicClient } from "@/lib/supabase/public";
import type { Announcement } from "@/types";

const DEFAULT_HERO = {
  title: "Craft your character.",
  subtitle:
    "Traditional craftsmanship meets modern character. Build your avatar, craft your journey, wear the mark.",
  image: "/logo-mark.png",
  buttonText: "Enter Avatar Studio",
  buttonHref: "/avatar",
};

const DEFAULT_FOOTER = {
  copyright: "the ASHLAR CRAFTSMAN. All rights reserved.",
  email: "theashlar357@gmail.com",
  social: { instagram: "", facebook: "", x: "" },
};

const DEFAULT_ABOUT = {
  heading: "Built on the level.",
  text: "Ashlar Craftsman blends lodge tradition with modern streetwear — avatars, aprons, and marks made to be worn with pride.",
};

export async function getSiteContent<T extends Record<string, unknown>>(
  key: string,
  fallback: T,
): Promise<T> {
  const supabase = createPublicClient();
  if (!supabase) return fallback;

  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (!data?.value || typeof data.value !== "object") return fallback;
  return { ...fallback, ...(data.value as T) };
}

export async function getHeroContent() {
  return getSiteContent("homepage.hero", DEFAULT_HERO);
}

export async function getFooterContent() {
  return getSiteContent("footer", DEFAULT_FOOTER);
}

export async function getAboutContent() {
  return getSiteContent("about", DEFAULT_ABOUT);
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(10);

  const now = Date.now();
  return ((data as Announcement[]) ?? []).filter((item) => {
    const starts = item.starts_at ? new Date(item.starts_at).getTime() : null;
    const ends = item.ends_at ? new Date(item.ends_at).getTime() : null;
    if (starts && starts > now) return false;
    if (ends && ends < now) return false;
    return true;
  }).slice(0, 5);
}
