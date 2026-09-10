-- Product print layout for admin T-shirt design placement.
-- Safe to run multiple times.

alter table public.products
  add column if not exists print_layout jsonb;

comment on column public.products.print_layout is
  'Normalized T-shirt print placement: designUrl, x/y/width/height, rotation, printArea, designAspect';
