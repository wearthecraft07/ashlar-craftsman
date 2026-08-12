import {
  AVATAR_CATEGORIES,
  AVATAR_OPTIONS,
} from "@/avatar/options";
import { createClient } from "@/lib/supabase/server";

export type StudioOption = {
  id: string;
  label: string;
  tone?: string;
  shade?: string;
  assetUrl?: string | null;
  featured?: boolean;
  price?: number | null;
};

export type StudioCategory = {
  key: string;
  label: string;
  layerOrder: number;
  options: StudioOption[];
};

export async function getAvatarCatalog(): Promise<{
  categories: StudioCategory[];
  source: "database" | "static";
}> {
  const staticCategories: StudioCategory[] = AVATAR_CATEGORIES.map(
    (category, index) => ({
      key: category.key,
      label: category.label,
      layerOrder: index * 10,
      options: (
        AVATAR_OPTIONS[category.key] as unknown as Array<{
          id: string;
          label: string;
          tone?: string;
          shade?: string;
        }>
      ).map((option) => ({
        id: option.id,
        label: option.label,
        tone: option.tone,
        shade: option.shade,
      })),
    }),
  );

  const supabase = await createClient();
  if (!supabase) {
    return { categories: staticCategories, source: "static" };
  }

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("avatar_categories")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("avatar_items")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (!categories?.length) {
    return { categories: staticCategories, source: "static" };
  }

  const mapped: StudioCategory[] = categories.map((category) => {
    const staticMatch = staticCategories.find((c) => c.key === category.key);
    const dbOptions = (items ?? [])
      .filter((item) => item.category_id === category.id)
      .map((item) => ({
        id: item.key,
        label: item.name,
        tone: (item.meta as { tone?: string } | null)?.tone,
        shade: (item.meta as { shade?: string } | null)?.shade,
        assetUrl: item.asset_url,
        featured: item.featured,
        price: item.price,
      }));

    // Prefer DB options when present; fall back to built-in SVG options.
    const options =
      dbOptions.length > 0 ? dbOptions : staticMatch?.options ?? [];

    return {
      key: category.key,
      label: category.name,
      layerOrder: category.layer_order,
      options,
    };
  });

  // Ensure built-in categories missing from DB still appear
  for (const staticCategory of staticCategories) {
    if (!mapped.some((c) => c.key === staticCategory.key)) {
      mapped.push(staticCategory);
    }
  }

  return { categories: mapped, source: "database" };
}
