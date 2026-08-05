# بومیم استودیو — Bumim Studio

Website for **بومیم** (digital content production studio) — rebuilt as a **Next.js + TypeScript** app.

## Tech stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Package manager**: pnpm
- **Database**: Neon (PostgreSQL) via **Prisma**
- **Storage**: Supabase Storage (media uploads)
- **Auth**: NextAuth (password login + optional Google)
- **Deploy**: Vercel

## Getting started

Requirements: Node 20+, pnpm.

```bash
# 1) Install dependencies
pnpm install

# 2) Configure environment
cp .env.example .env
# ... fill in your values (see "Environment variables" below)

# 3) Set up the database
pnpm db:push        # create tables on Neon (no migration history)
# or
pnpm db:migrate     # create + apply a migration (recommended)
pnpm db:seed        # insert default pricing + initial 47 projects

# 4) Run locally
pnpm dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes (for DB features) | Neon / Postgres connection string (Prisma) |
| `NEXT_PUBLIC_SUPABASE_URL` | For uploads | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For uploads | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | For uploads | Supabase service-role key (server only) |
| `SUPABASE_STORAGE_BUCKET` | No | Bucket name, default `bumim-media` |
| `NEXTAUTH_SECRET` | Yes | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Your site URL (`https://...` in production) |
| `ADMIN_PASSWORD` | Yes | Password for the admin login |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Google OAuth (optional) |
| `NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN` | No | `"true"` to show the Google button |

> Media defaults to local files in `public/media/` (the original assets). The site works with no database at all — pricing and projects fall back to the seeded defaults. Database/Supabase unlock the admin panel to change prices and manage/upload projects.

## Admin panel

Visit **`/admin`** (login with `ADMIN_PASSWORD`).

- **تعرفه‌ها (pricing)**: edit the global **مبلغ پایه (base price)** and each plan's **ضریب (multiplier)**. The site computes `price = basePrice × multiplier` in Toman. Changes persist to Neon via `/api/pricing`.
- **پروژهها (projects)**: create, edit and delete portfolio projects. Use the **آپلود** button to upload a file to Supabase Storage; the returned URL is set on the project (`src` / `poster`).

## Data model (Prisma)

- **`PricingConfig`** — single row (`id = 1`) holding `basePrice` and a JSON map of per-plan multipliers.
- **`Project`** — portfolio items (`src` / `poster` can be local `/media` paths or Supabase URLs).

Schema: `prisma/schema.prisma` · Seed: `prisma/seed.ts`

## API routes

| Route | Method | Auth | Purpose |
| --- | --- | --- | --- |
| `/api/pricing` | GET | — | Current pricing (with defaults fallback) |
| `/api/pricing` | PUT | admin | Update base price / multipliers |
| `/api/projects` | GET | — | List projects (fallback to seed) |
| `/api/projects` | POST | admin | Create project |
| `/api/projects/[id]` | PUT / DELETE | admin | Update / delete project |
| `/api/admin/upload` | POST | admin | Upload a file to Supabase Storage → returns public URL |
| `/api/auth/[...nextauth]` | — | — | NextAuth |

## Deploy to Vercel

1. Push this repo to GitHub (done).
2. In Vercel: **Add New Project → Import** the repo.
3. Framework preset: **Next.js** (auto-detected). Build command: `pnpm build`. Install: `pnpm install`.
4. Add all environment variables under **Settings → Environment Variables** (see table above).
5. Set `NEXTAUTH_URL` to your production URL (e.g. `https://bumimstudio.vercel.app`).
6. Deploy.

### Supabase Storage setup

1. Create a project and a bucket (e.g. `bumim-media`).
2. Create a **public** read policy on the bucket so media URLs are accessible (Storage → Policies → "Public").
3. Copy the project URL + keys into your env vars.

### Neon setup

1. Create a Neon project and copy the **Prisma (postgres)** connection string into `DATABASE_URL`.
2. Run `pnpm db:push` (or `pnpm db:migrate`) and `pnpm db:seed` once.

## Project structure

```
app/
  page.tsx                 # Home (Hero + Pricing + Contact)
  about/ portfolio/ pricing/ contact/ terms/   # public pages
  admin/login/             # admin login
  admin/(dashboard)/       # guarded admin: pricing + projects
  api/                     # route handlers (pricing, projects, upload, auth)
components/
  sections/                # Hero, Pricing, Portfolio, Contact, About, ...
  layout/                  # Header, Navbar, Footer, AppShell
  admin/                   # AdminShell, PricingEditor, ProjectsManager
lib/
  data/                    # seed data (projects, services, aboutus)
  prisma.ts  pricing.ts  projects-data.ts  supabase.ts  auth.ts  types.ts
prisma/                    # schema + seed
public/
  media/                   # original images / videos / audio / icons
  fonts/                   # Kalameh (Persian) webfont
```

## Notes

- The original Vite/JS app lived in this repo; this is a full conversion to Next.js + TypeScript.
- Custom Persian font (Kalameh) is served from `/fonts` and applied via `app/globals.css`.
