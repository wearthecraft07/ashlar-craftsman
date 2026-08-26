-- Seed catalog from the current Ashlar Craftsman static data.
-- Run AFTER schema.sql. Safe to re-run (upserts by slug/key).

insert into public.categories (slug, name, description, sort_order, enabled)
values
  ('essentials', 'Essentials', 'Everyday blanks with gold marks and clean lines.', 0, true),
  ('premium', 'Premium Craft', 'Heavier fabrics, sharper prints, lasting silhouette.', 1, true),
  ('limited', 'Limited Drops', 'Small-run artwork for collectors of the craft.', 2, true),
  ('custom', 'Avatar Studio', 'Build your character. Wear your journey.', 3, true),
  ('t-shirts', 'T-Shirts', 'Crafted tees for everyday wear.', 4, true),
  ('aprons', 'Aprons', 'Lodge and workshop aprons.', 5, true),
  ('hats', 'Hats', 'Caps and formal headwear.', 6, true),
  ('accessories', 'Accessories', 'Rings, gloves, and finishing pieces.', 7, true),
  ('masonic-collection', 'Masonic Collection', 'Regalia-inspired garments and marks.', 8, true),
  ('wear-the-craft', 'Wear the Craft', 'Signature Ashlar Craftsman drops.', 9, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  enabled = excluded.enabled;

insert into public.products (
  slug, name, description, price, sale_price, sku, category, colors, sizes,
  images, tags, featured, best_seller, inventory, low_stock_threshold, status
)
values
  (
    'ashlar-mark-tee', 'Ashlar Mark Tee',
    'Heavyweight cotton with an embroidered gold mark. Clean silhouette, street-ready finish.',
    5800, 4800, 'AC-MARK-TEE', 'essentials',
    '[{"id":"black","name":"Black","hex":"#0A0A0A"},{"id":"white","name":"White","hex":"#F7F7F5"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"},{"id":"gold","name":"Gold Mist","hex":"#C9A227"}]'::jsonb,
    array['XS','S','M','L','XL','XXL'],
    array['/shirt-mark.png'],
    array['cotton','gold','everyday'],
    true, true, 120, 10, 'published'
  ),
  (
    'craft-your-journey', 'Craft Your Journey Tee',
    'Signature tagline tee with bold outline artwork. Built for movement and lasting wear.',
    5200, null, 'AC-JOURNEY', 'premium',
    '[{"id":"black","name":"Black","hex":"#0A0A0A"},{"id":"white","name":"White","hex":"#F7F7F5"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"},{"id":"stone","name":"Stone","hex":"#D6D1C7"},{"id":"ink","name":"Ink Navy","hex":"#141820"}]'::jsonb,
    array['S','M','L','XL','XXL'],
    array['/shirt-mark.png'],
    array['signature','premium'],
    true, true, 85, 8, 'published'
  ),
  (
    'square-line-tee', 'Square Line Tee',
    'Geometric craft motif on charcoal. Luxury streetwear with classic proportion.',
    5000, null, 'AC-SQUARE', 'essentials',
    '[{"id":"black","name":"Black","hex":"#0A0A0A"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"},{"id":"ink","name":"Ink Navy","hex":"#141820"}]'::jsonb,
    array['S','M','L','XL'],
    array['/shirt-mark.png'],
    array['geometry','charcoal'],
    true, false, 64, 5, 'published'
  ),
  (
    'custom-avatar-tee', 'Custom Avatar Tee',
    'Your avatar, your shirt. Design in the studio and print on premium blanks.',
    6400, null, 'AC-AVATAR', 'custom',
    '[{"id":"black","name":"Black","hex":"#0A0A0A"},{"id":"white","name":"White","hex":"#F7F7F5"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"},{"id":"gold","name":"Gold Mist","hex":"#C9A227"},{"id":"stone","name":"Stone","hex":"#D6D1C7"},{"id":"ink","name":"Ink Navy","hex":"#141820"}]'::jsonb,
    array['XS','S','M','L','XL','XXL'],
    array['/shirt-mark.png'],
    array['custom','avatar','studio'],
    true, true, 999, 5, 'published'
  ),
  (
    'twin-pillars-tee', 'Twin Pillars Tee',
    'Limited drop with twin-pillar illustration and gold ink accents.',
    5800, null, 'AC-PILLARS', 'limited',
    '[{"id":"black","name":"Black","hex":"#0A0A0A"},{"id":"white","name":"White","hex":"#F7F7F5"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"}]'::jsonb,
    array['S','M','L','XL'],
    array['/shirt-mark.png'],
    array['limited','gold-ink'],
    false, true, 40, 5, 'published'
  ),
  (
    'true-level-tee', 'True Level Tee',
    'Minimal mark, maximum presence. Soft hand-feel with reinforced collar.',
    4600, null, 'AC-LEVEL', 'essentials',
    '[{"id":"black","name":"Black","hex":"#0A0A0A"},{"id":"white","name":"White","hex":"#F7F7F5"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"}]'::jsonb,
    array['XS','S','M','L','XL','XXL'],
    array['/shirt-mark.png'],
    array['minimal','soft'],
    false, false, 110, 10, 'published'
  ),
  (
    'gold-edge-tee', 'Gold Edge Tee',
    'Premium cut with gold edge detailing and tonal craftsmanship badge.',
    6200, null, 'AC-GOLD-EDGE', 'premium',
    '[{"id":"black","name":"Black","hex":"#0A0A0A"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"},{"id":"ink","name":"Ink Navy","hex":"#141820"}]'::jsonb,
    array['S','M','L','XL'],
    array['/shirt-mark.png'],
    array['premium','detail'],
    true, false, 55, 5, 'published'
  ),
  (
    'stonework-tee', 'Stonework Tee',
    'Textured print inspired by cut ashlar. A wearable piece of craft.',
    5400, null, 'AC-STONE', 'premium',
    '[{"id":"white","name":"White","hex":"#F7F7F5"},{"id":"charcoal","name":"Charcoal","hex":"#2A2A2A"},{"id":"stone","name":"Stone","hex":"#D6D1C7"}]'::jsonb,
    array['S','M','L','XL','XXL'],
    array['/shirt-mark.png'],
    array['texture','craft'],
    false, false, 70, 5, 'published'
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  sale_price = excluded.sale_price,
  sku = excluded.sku,
  category = excluded.category,
  colors = excluded.colors,
  sizes = excluded.sizes,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  best_seller = excluded.best_seller,
  inventory = excluded.inventory,
  low_stock_threshold = excluded.low_stock_threshold,
  status = excluded.status,
  updated_at = now();

-- Link products to category ids
update public.products p
set category_id = c.id
from public.categories c
where p.category = c.slug and p.category_id is distinct from c.id;

-- Avatar categories (layer_order used by compositor stacking)
insert into public.avatar_categories (key, name, layer_order, sort_order, enabled)
values
  ('background', 'Background', 0, 0, true),
  ('body', 'Body', 10, 1, true),
  ('shoes', 'Shoes', 20, 2, true),
  ('clothing', 'Clothing', 30, 3, true),
  ('clothingColor', 'Suit Color', 31, 4, true),
  ('apron', 'Apron', 40, 5, true),
  ('collar', 'Collar', 45, 6, true),
  ('gloves', 'Gloves', 50, 7, true),
  ('face', 'Face', 60, 8, true),
  ('skin', 'Skin', 61, 9, true),
  ('eyes', 'Eyes', 70, 10, true),
  ('eyebrows', 'Brows', 71, 11, true),
  ('nose', 'Nose', 72, 12, true),
  ('mouth', 'Mouth', 73, 13, true),
  ('beard', 'Beard', 74, 14, true),
  ('hair', 'Hair', 80, 15, true),
  ('hairColor', 'Hair Color', 81, 16, true),
  ('expression', 'Expression', 82, 17, true),
  ('glasses', 'Glasses', 90, 18, true),
  ('hat', 'Hats', 100, 19, true),
  ('ring', 'Ring', 110, 20, true),
  ('tool', 'Tools', 120, 21, true),
  ('pose', 'Pose', 130, 22, true)
on conflict (key) do update set
  name = excluded.name,
  layer_order = excluded.layer_order,
  sort_order = excluded.sort_order,
  enabled = excluded.enabled;

-- Seed modular SVG option keys as avatar_items (asset_url null = use built-in renderer)
insert into public.avatar_items (category_id, key, name, meta, sort_order, active)
select c.id, i.key, i.name, i.meta::jsonb, i.sort_order, true
from public.avatar_categories c
join (
  values
    ('face', 'round', 'Round', '{}', 0),
    ('face', 'oval', 'Oval', '{}', 1),
    ('face', 'square', 'Square', '{}', 2),
    ('face', 'heart', 'Heart', '{}', 3),
    ('skin', 'fair', 'Fair', '{"tone":"#F6D7C3","shade":"#E8BFA8"}', 0),
    ('skin', 'light', 'Light', '{"tone":"#E8C2A0","shade":"#D4A882"}', 1),
    ('skin', 'medium', 'Medium', '{"tone":"#C98A4E","shade":"#A86E38"}', 2),
    ('skin', 'tan', 'Tan', '{"tone":"#A86B3C","shade":"#86522C"}', 3),
    ('skin', 'deep', 'Deep', '{"tone":"#6E4028","shade":"#4E2C1A"}', 4),
    ('skin', 'rich', 'Rich', '{"tone":"#3F2416","shade":"#2A160E"}', 5),
    ('clothing', 'suit', 'Business Suit', '{}', 0),
    ('clothing', 'sports_coat', 'Sports Coat', '{}', 1),
    ('clothing', 'tuxedo', 'Tuxedo', '{}', 2),
    ('clothing', 'formal', 'Formal Wear', '{}', 3),
    ('clothing', 'barong', 'Barong Tagalog', '{}', 4),
    ('apron', 'none', 'None', '{}', 0),
    ('apron', 'plain', 'Plain White', '{}', 1),
    ('apron', 'ea', 'EA', '{}', 2),
    ('apron', 'fc', 'FC', '{}', 3),
    ('apron', 'mm', 'MM', '{}', 4),
    ('hat', 'none', 'None', '{}', 0),
    ('hat', 'cap', 'Cap', '{}', 1),
    ('hat', 'beanie', 'Beanie', '{}', 2),
    ('hat', 'bucket', 'Bucket', '{}', 3),
    ('hat', 'fez', 'Fez', '{}', 4),
    ('hat', 'top', 'Top Hat', '{}', 5),
    ('tool', 'none', 'None', '{}', 0),
    ('tool', 'gavel', 'Gavel', '{}', 1),
    ('tool', 'square-compass', 'Square & Compasses', '{}', 2),
    ('tool', 'trowel', 'Trowel', '{}', 3),
    ('tool', 'level', 'Level', '{}', 4),
    ('tool', 'plumb', 'Plumb', '{}', 5)
) as i(category_key, key, name, meta, sort_order)
  on c.key = i.category_key
on conflict (category_id, key) do update set
  name = excluded.name,
  meta = excluded.meta,
  sort_order = excluded.sort_order,
  active = true;

insert into public.site_content (key, value)
values
  (
    'homepage.hero',
    '{
      "title": "Craft your character.",
      "subtitle": "Traditional craftsmanship meets modern character. Build your avatar, craft your journey, wear the mark.",
      "image": "/logo-mark.png",
      "buttonText": "Enter Avatar Studio",
      "buttonHref": "/avatar"
    }'::jsonb
  ),
  (
    'homepage.announcement',
    '{
      "enabled": true,
      "text": "New Master Mason Collection Available"
    }'::jsonb
  ),
  (
    'footer',
    '{
      "copyright": "the ASHLAR CRAFTSMAN. All rights reserved.",
      "email": "theashlar357@gmail.com",
      "social": {
        "instagram": "",
        "facebook": "",
        "x": ""
      }
    }'::jsonb
  ),
  (
    'about',
    '{
      "heading": "Built on the level.",
      "text": "Ashlar Craftsman blends lodge tradition with modern streetwear — avatars, aprons, and marks made to be worn with pride."
    }'::jsonb
  )
on conflict (key) do nothing;

insert into public.announcements (title, body, published, starts_at)
select * from (
  values
    (
      'New Master Mason Collection Available',
      'Explore formalwear and MM apron options in the Avatar Studio.',
      true,
      now()
    ),
    (
      'Free Shipping This Weekend',
      'Complimentary shipping on orders over $75 — this weekend only.',
      false,
      null::timestamptz
    )
) as v(title, body, published, starts_at)
where not exists (
  select 1 from public.announcements a where a.title = v.title
);
