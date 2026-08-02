# the ASHLAR CRAFTSMAN

Premium 2D cartoon streetwear storefront and avatar studio.

**Craft Your Journey.**

## Stack

- Next.js 15 (App Router) + React + TypeScript
- Tailwind CSS + Framer Motion
- Supabase (auth + database)
- Stripe (checkout + webhooks)
- Cloudinary (image uploads)
- Zustand (cart)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs in **demo mode** without API keys:

- Avatar save/edit via `localStorage`
- Catalog, cart, and demo checkout work locally
- Admin dashboard uses sample analytics/orders

## Configure integrations

Copy `.env.example` → `.env.local` and fill in:

1. **Supabase** — create a project, run `supabase/schema.sql`, add URL + anon key
2. **Stripe** — add publishable + secret keys (optional webhook secret)
3. **Cloudinary** — add cloud name + API key/secret for admin uploads

## Features

### Homepage
Hero with brand lockup, animated avatars, featured collections, best sellers, customer gallery, testimonials, newsletter.

### Avatar Studio (`/avatar`)
Modular customization for face, skin, eyes, brows, nose, mouth, hair, beard, glasses, hats, body, clothing, shoes, expressions, and poses. Save/edit, rotate/zoom, shirt color preview, SVG download, add custom tee to cart.

### Shop
Catalog filters, product pages, cart, Stripe checkout (or local demo), order history.

### Admin (`/admin`)
Upload designs, manage inventory, view orders/customers, analytics overview.

## Project structure

```
src/
  app/           # routes + API
  avatar/        # SVG avatar system
  components/    # reusable UI
  data/          # catalog + content
  lib/           # supabase, stripe, cloudinary, cart
  types/         # shared types
supabase/
  schema.sql     # database schema + RLS
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
