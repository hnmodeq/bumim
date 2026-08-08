# بومیم استودیو — Bumim Studio

Website for **بومیم** (digital content production studio) — rebuilt as a **Next.js + TypeScript** app.

## Tech stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Package manager**: pnpm
- **Database**: PostgreSQL via **Prisma ORM** / Prisma Postgres
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

# 3) Apply migrations and seed local/dev database
pnpm db:deploy      # applies committed Prisma migrations
pnpm db:seed        # inserts default pricing + initial projects
pnpm db:health      # verifies connection, tables, and seed data

# 4) Run locally
pnpm dev
```

Open http://localhost:3000.

## Database and migrations

This project uses committed Prisma migrations in `prisma/migrations`. Do **not** rely on `prisma db push` for deployments because it does not create migration history.

Common commands:

```bash
pnpm db:status      # check database/migration health
pnpm db:migrate     # development only: create a new migration after schema changes
pnpm db:deploy      # production/deployment: apply existing migrations
pnpm db:seed        # idempotently seed pricing + projects
pnpm db:health      # verify connection + required tables
pnpm db:studio      # open Prisma Studio
```

### Existing Prisma Postgres database that already has tables

If your database already contains `pricing_config` and `projects` but Prisma says **Drift detected**, baseline the existing schema once instead of resetting data:

```bash
pnpm db:resolve:init
pnpm db:status
```

After that, use `pnpm db:deploy` in deployments and `pnpm db:migrate -- --name your_change_name` only when you intentionally change `prisma/schema.prisma` in development.

If the database is disposable and you are okay losing data, you can alternatively reset it locally with Prisma's prompt from `pnpm db:migrate -- --name init`, then run `pnpm db:seed`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes (for DB features and deployments) | Prisma Postgres / PostgreSQL connection string |
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

- **تعرفه‌ها (pricing)**: edit the global **مبلغ پایه (base price)** and each plan's **ضریب (multiplier)**. The site computes `price = basePrice × multiplier` in Toman. Changes persist to PostgreSQL via `/api/pricing`.
- **پروژهها (projects)**: create, edit and delete portfolio projects. Use the **آپلود** button to upload a file to Supabase Storage; the returned URL is set on the project (`src` / `poster`).

## Data model (Prisma)

- **`PricingConfig`** — single row (`id = 1`) holding `basePrice` and a JSON map of per-plan multipliers.
- **`Project`** — portfolio items (`src` / `poster` can be local `/media` paths or Supabase URLs).

Schema: `prisma/schema.prisma` · Seed: `prisma/seed.ts` · Config: `prisma.config.ts`

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

1. Push this repo to GitHub.
2. In Vercel: **Add New Project → Import** the repo.
3. Framework preset: **Next.js**. This repo sets Vercel's build command to `pnpm vercel-build`, which runs `prisma migrate deploy`, `prisma generate`, then `next build`.
4. Add all environment variables under **Settings → Environment Variables** (see table above). `DATABASE_URL` must be available to Production builds for the migration step.
5. Set `NEXTAUTH_URL` to your production URL (e.g. `https://bumimstudio.vercel.app`).
6. Deploy.

### Supabase Storage setup

1. Create a project and a bucket (e.g. `bumim-media`).
2. Create a **public** read policy on the bucket so media URLs are accessible (Storage → Policies → "Public").
3. Copy the project URL + keys into your env vars.

### Prisma Postgres setup

1. Create or select a Prisma Postgres database and copy the connection string into `DATABASE_URL`.
2. For a new empty database, run `pnpm db:deploy` and `pnpm db:seed` once.
3. For an existing database that already has this schema, run `pnpm db:resolve:init` once, then `pnpm db:status`.

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
prisma/                    # schema + migrations + seed
public/
  media/                   # original images / videos / audio / icons
  fonts/                   # Kalameh (Persian) webfont
```

## Notes

- The original Vite/JS app lived in this repo; this is a full conversion to Next.js + TypeScript.
- Custom Persian font (Kalameh) is served from `/fonts` and applied via `app/globals.css`.
