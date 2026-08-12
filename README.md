# the ASHLAR CRAFTSMAN

Premium lodge-inspired storefront and Avatar Studio.

**Craft Your Journey.**

## Stack

- Next.js 15 (App Router) + React + TypeScript
- Tailwind CSS + Framer Motion
- Supabase (Auth, Postgres, RLS)
- Stripe (Checkout + webhooks)
- Cloudinary (media uploads)
- Zustand (guest cart)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without API keys the storefront still runs using static catalog fallbacks and local cart/avatar saves. Admin requires Supabase.

## Production setup (Supabase)

1. Create a Supabase project.
2. In the SQL editor, run:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
3. Put these in `.env.local` / Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAILS=you@example.com
```

4. Create an Auth user with that email, then sign in at `/admin/login`.
   - `ADMIN_EMAILS` auto-promotes matching profiles to `super_admin` (via service role).
   - Or manually: `update public.profiles set role = 'super_admin' where email = 'you@example.com';`

5. Optional: Stripe + Cloudinary keys for checkout and uploads.

## What’s live now (Phase 0–1 foundation)

- Expanded production schema (products, categories, avatar items, content, announcements, media, orders, roles)
- Secure `/admin/login` + middleware gate (customers cannot access admin)
- Admin product CRUD + category CRUD against Supabase
- Shop/best-sellers read from database when available, else static fallback
- Footer no longer exposes a public Admin link
- Placeholder admin sections for Avatar / Content / Announcements (tables ready)

## Next phases

- Stripe webhook → persist orders + inventory decrement (server-priced checkout)
- Avatar admin CRUD + DB-driven studio options / image layers
- CMS content + announcements on the storefront
- Customer accounts, saved designs sync, order history
- Media library + dashboard analytics from real data

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
