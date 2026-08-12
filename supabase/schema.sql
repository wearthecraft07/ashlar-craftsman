-- the ASHLAR CRAFTSMAN — production schema
-- Run in the Supabase SQL editor after creating a project.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS patterns where practical.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles & roles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  role text not null default 'customer'
    check (role in ('customer', 'admin', 'super_admin')),
  is_admin boolean not null default false,
  disabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep is_admin in sync with role for backwards compatibility
create or replace function public.sync_profile_admin_flag()
returns trigger
language plpgsql
as $$
begin
  new.is_admin := new.role in ('admin', 'super_admin');
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_sync_profile_admin on public.profiles;
create trigger trg_sync_profile_admin
  before insert or update of role on public.profiles
  for each row execute procedure public.sync_profile_admin_flag();

-- ---------------------------------------------------------------------------
-- Product categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  sale_price integer check (sale_price is null or sale_price >= 0),
  sku text,
  category_id uuid references public.categories(id) on delete set null,
  category text not null default 'essentials', -- legacy slug fallback
  colors jsonb not null default '[]'::jsonb,
  sizes text[] not null default array['S','M','L','XL'],
  images text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  best_seller boolean not null default false,
  inventory integer not null default 0,
  low_stock_threshold integer not null default 5,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'out_of_stock', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products (status);
create index if not exists products_category_idx on public.products (category);

-- ---------------------------------------------------------------------------
-- Avatar categories & items (admin-manageable layers)
-- ---------------------------------------------------------------------------
create table if not exists public.avatar_categories (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  layer_order integer not null default 0,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.avatar_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.avatar_categories(id) on delete cascade,
  key text not null,
  name text not null,
  description text not null default '',
  asset_url text,
  meta jsonb not null default '{}'::jsonb,
  layer_order integer,
  sort_order integer not null default 0,
  active boolean not null default true,
  featured boolean not null default false,
  price integer check (price is null or price >= 0),
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, key)
);

create index if not exists avatar_items_category_idx on public.avatar_items (category_id);

-- ---------------------------------------------------------------------------
-- Saved customer avatar designs
-- ---------------------------------------------------------------------------
create table if not exists public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  config jsonb not null,
  shirt_color text not null default '#0A0A0A',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists avatars_user_idx on public.avatars (user_id);

-- ---------------------------------------------------------------------------
-- Customer addresses
-- ---------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  label text not null default 'Default',
  name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  email text not null,
  status text not null default 'pending'
    check (status in (
      'pending', 'paid', 'processing', 'ready', 'shipped',
      'delivered', 'cancelled', 'refunded'
    )),
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  shipping integer not null default 0,
  tax integer not null default 0,
  total integer not null default 0,
  stripe_session_id text unique,
  stripe_payment_intent text,
  shipping_address jsonb,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  author_id uuid references auth.users on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Site content (CMS key/value)
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

-- ---------------------------------------------------------------------------
-- Announcements
-- ---------------------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  published boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Media library
-- ---------------------------------------------------------------------------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  public_id text,
  alt text not null default '',
  folder text not null default 'general',
  width integer,
  height integer,
  bytes integer,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Auth trigger: create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  bootstrap text := coalesce(current_setting('app.admin_emails', true), '');
  next_role text := 'customer';
begin
  if bootstrap <> '' and position(lower(new.email) in lower(bootstrap)) > 0 then
    next_role := 'super_admin';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    next_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.disabled = false
      and p.role in ('admin', 'super_admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.disabled = false
      and p.role = 'super_admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.avatar_categories enable row level security;
alter table public.avatar_items enable row level security;
alter table public.avatars enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_notes enable row level security;
alter table public.site_content enable row level security;
alter table public.announcements enable row level security;
alter table public.media enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Profiles
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and disabled = (select disabled from public.profiles where id = auth.uid())
  );

drop policy if exists "Super admins manage profiles" on public.profiles;
create policy "Super admins manage profiles"
  on public.profiles for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Categories
drop policy if exists "Public read enabled categories" on public.categories;
create policy "Public read enabled categories"
  on public.categories for select
  using (enabled = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Products
drop policy if exists "Public products are readable" on public.products;
drop policy if exists "Public read published products" on public.products;
create policy "Public read published products"
  on public.products for select
  using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Avatar catalog
drop policy if exists "Public read active avatar categories" on public.avatar_categories;
create policy "Public read active avatar categories"
  on public.avatar_categories for select
  using (enabled = true or public.is_admin());

drop policy if exists "Admins manage avatar categories" on public.avatar_categories;
create policy "Admins manage avatar categories"
  on public.avatar_categories for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read active avatar items" on public.avatar_items;
create policy "Public read active avatar items"
  on public.avatar_items for select
  using (active = true or public.is_admin());

drop policy if exists "Admins manage avatar items" on public.avatar_items;
create policy "Admins manage avatar items"
  on public.avatar_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- Saved avatars
drop policy if exists "Users manage own avatars" on public.avatars;
create policy "Users manage own avatars"
  on public.avatars for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- Addresses
drop policy if exists "Users manage own addresses" on public.addresses;
create policy "Users manage own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins read addresses" on public.addresses;
create policy "Admins read addresses"
  on public.addresses for select
  using (public.is_admin());

-- Orders
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins manage order notes" on public.order_notes;
create policy "Admins manage order notes"
  on public.order_notes for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users read notes on own orders" on public.order_notes;
create policy "Users read notes on own orders"
  on public.order_notes for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Site content
drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
  on public.site_content for all
  using (public.is_admin())
  with check (public.is_admin());

-- Announcements
drop policy if exists "Public read live announcements" on public.announcements;
create policy "Public read live announcements"
  on public.announcements for select
  using (
    public.is_admin()
    or (
      published = true
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
    )
  );

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
  on public.announcements for all
  using (public.is_admin())
  with check (public.is_admin());

-- Media
drop policy if exists "Admins manage media" on public.media;
create policy "Admins manage media"
  on public.media for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read media" on public.media;
create policy "Public read media"
  on public.media for select
  using (true);

-- Newsletter
drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

drop policy if exists "Admins read subscribers" on public.newsletter_subscribers;
create policy "Admins read subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Bootstrap note:
-- After first signup, promote an admin manually if needed:
--   update public.profiles set role = 'super_admin' where email = 'you@example.com';
-- Or set ADMIN_EMAILS in the app and use the bootstrap API after login.
-- ---------------------------------------------------------------------------
