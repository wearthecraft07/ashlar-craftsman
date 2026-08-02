-- the ASHLAR CRAFTSMAN — Supabase schema
-- Run in the Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  category text not null default 'essentials',
  colors jsonb not null default '[]'::jsonb,
  sizes text[] not null default array['S','M','L','XL'],
  images text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  best_seller boolean not null default false,
  inventory integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  config jsonb not null,
  shirt_color text not null default '#0A0A0A',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  email text not null,
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  shipping integer not null default 0,
  tax integer not null default 0,
  total integer not null default 0,
  stripe_session_id text,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.avatars enable row level security;
alter table public.orders enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Public products are readable"
  on public.products for select
  using (true);

create policy "Admins manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy "Users manage own avatars"
  on public.avatars for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
