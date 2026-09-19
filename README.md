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
- **Vercel** / **ParsPack** (hosting)

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full technical
architecture, database schema, RLS strategy, and roadmap, and
[`docs/PARSPACK.md`](docs/PARSPACK.md) for ParsPack deployment.

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
├── proxy.ts        # locale routing (Next.js middleware convention)
└── types/          # shared + generated DB types
messages/           # fa.json / en.json message catalogs
supabase/           # migrations + config (Phase 3)
docs/               # architecture documentation
```

## Current Status

**Phase 8 — Quote Calculator + Quote Generator.** Phases 1–8 are implemented:
design system and shells, database + RLS, Supabase auth with provisioning
triggers, editor profiles, portfolios, the crowd-sourced rate guide, and the
quote calculator / quote generator with a print-to-PDF client document.

The rate guide (`/rate-guide`) is a **market reference, not a price list**: it
publishes the typical range and — only where at least three approved submissions
exist — the median, alongside the factors that move a price and three worked
example scenarios. Visitors can submit their own rate anonymously together with
coarse project characteristics (duration bucket, complexity, deliverables,
revisions, turnaround, usage rights, motion/colour/sound). Submissions land as
`pending`; admins approve or reject them at `/admin/rates`, and only approved
rows feed the public aggregates. All money is integer Rial end to end.

The quote calculator (`/quote`) turns project requirements into a
market-grounded **estimate range with a full factor breakdown** — every rate
lives in one centralized pricing service, nothing is hard-coded in the UI, and
the result is explicitly labelled a reference, never a binding offer. Signed-in
editors turn an estimate into a saved quote in one click: client and project
details, deliverables, line items in Toman (stored as integer Rial), revisions,
deadline, terms, notes and expiry; quotes support create / edit / duplicate /
archive and are visible only to their owner (RLS-enforced). `/print/quote/[id]`
renders a clean A4, RTL, Persian document with subtle platform branding that
prints to PDF from the browser.

Remaining routes still render placeholders until their phase lands (messaging,
applications, community, reports).

## Deployment

- **ParsPack:** see [`docs/PARSPACK.md`](docs/PARSPACK.md). Requires Node ≥ 20.9,
  port `3000`, and env vars set in the panel.
- **Vercel:** the project also deploys to Vercel out of the box.
