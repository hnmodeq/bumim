# Bumim

**The professional network and work platform for Iranian video editors.**

Primary relationship: **Editor ↔ Platform ↔ Editor** — collaboration, profiles,
portfolios, market pricing, quotes, and reputation. RTL/Persian-first.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** v4 + **shadcn/ui**
- **Supabase** (PostgreSQL, Auth, Storage, RLS)
- **Zod** (validation) + **React Hook Form** (complex forms)
- **next-intl** (RTL/localization)
- **Vercel** (hosting)

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full technical
architecture, database schema, RLS strategy, and roadmap.

## Getting Started

```bash
npm install

# configure environment (see .env.example)
cp .env.example .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Default locale is Persian
(`/`); English is at `/en`.

## Scripts

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start the development server         |
| `npm run build`         | Production build                     |
| `npm run start`         | Serve the production build           |
| `npm run lint`          | Run ESLint                           |
| `npm run lint:fix`      | Run ESLint and auto-fix              |
| `npm run typecheck`     | Type-check without emitting          |
| `npm run format`        | Format with Prettier                 |
| `npm run format:check`  | Check formatting                     |

## Environment Variables

Copy `.env.example` → `.env.local`. Required variables (see `.env.example`):

| Variable                        | Scope       | Notes                              |
| ------------------------------- | ----------- | ---------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | public      | Site URL                           |
| `NEXT_PUBLIC_SUPABASE_URL`      | public      | Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public      | Safe to expose (RLS-restricted)    |
| `SUPABASE_SERVICE_ROLE_KEY`     | **server**  | Bypasses RLS — never expose        |

## Folder Structure

```
src/
├── app/            # App Router routes ([locale]/…, error/loading/not-found)
├── components/
│   ├── ui/         # shadcn/ui primitives
│   └── shared/     # cross-cutting components
├── lib/
│   ├── supabase/   # client.ts (browser), server.ts, admin.ts (server-only)
│   ├── db/         # repositories (data access)
│   ├── validators/ # zod schemas
│   ├── money.ts    # integer Rial/Toman money model
│   └── env.ts      # typed env access
├── i18n/           # next-intl routing/navigation/request
├── middleware.ts   # locale routing
└── types/          # shared + generated DB types
messages/           # fa.json / en.json message catalogs
supabase/           # migrations + config (Phase 3)
docs/               # architecture documentation
```

## Current Status

**Phase 1 — Project Foundation.** The app shell, design system, Supabase client
architecture, RTL/i18n, and error/loading states are in place. No product
features yet (authentication, profiles, projects, marketplace) — those begin in
later phases.
