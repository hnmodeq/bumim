# Bumim — Technical Architecture

> Working title. "The professional network and work platform for Iranian video editors."
>
> Status: **Design document + build record.** Phases 1–7 are implemented (foundation/shell,
> database + RLS, auth, profiles, portfolios, rate guide — market reference with project
> characteristics, threshold-gated medians and an admin moderation queue); Phase 8 (quotes) is next.
> Where the shipped implementation differs from the design below, the difference is noted
> inline as "As built". The prior marketing site is preserved under tag `old-yellow-design`.

---

## 0. Repository Inspection — What Exists Today

- The repository contains **no source files** (only `.git`).
- History contains the previous single-page marketing site (Next.js, one `page.tsx` driven by `dangerouslySetInnerHTML`, plus an `/admin` control panel). That work is preserved and reachable at tag `old-yellow-design`.
- There is **no** existing database, auth, or application architecture to migrate. We are designing from zero.
- Remote: `https://github.com/hnmodeq/bumim.git`, branch `main`.

**Conclusion:** this is a greenfield product build. The prior site is unrelated code and will not be reused.

---

## 1. Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Vercel (Next.js App Router, SSR + RSC + Edge middleware)    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Server        │  │ Route        │  │ Client           │   │
│  │ Components    │  │ Handlers /   │  │ Components        │   │
│  │ (RSC)         │  │ Server Actions│ │ (interactive)     │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
│         │                 │                    │             │
│         └────────┬────────┴────────────────────┘             │
│                  │  @supabase/ssr (cookie session)           │
└──────────────────┼───────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase                                                    │
│  ├── PostgreSQL   (schema + Row Level Security)              │
│  ├── Auth         (email/password, phone OTP, OAuth)         │
│  └── Storage      (avatars, covers, portfolio thumbnails)    │
└─────────────────────────────────────────────────────────────┘
```

**Principles**

1. **Thin client, thick server.** Business logic, data access, and authorization live on the server. The browser only ever talks to public, RLS-protected Supabase endpoints (for realtime/optimistic reads where needed) or to our own Route Handlers / Server Actions.
2. **Single source of truth for auth** = Supabase Auth. We never roll our own session system.
3. **RLS is the security boundary.** Even if a query reaches Supabase directly from the browser, RLS scopes it to the user. Application code re-checks authorization on top (defense in depth).
4. **Money as integers only** (see §12). Never floats.
5. **RTL-first** (see §11). Persian is the primary locale; English is additive.

---

## 2. Recommended Folder Structure

App Router with route groups (`(group)` segments affect URL, `_private` folders don't become routes).

```
bumim/
├── supabase/
│   ├── migrations/            # ordered SQL migrations (source of truth for schema + RLS)
│   ├── seed.sql               # dev seed data
│   └── config.toml            # local Supabase CLI config
├── src/
│   ├── app/
│   │   ├── layout.tsx          # root: <html dir>, fonts, providers
│   │   ├── page.tsx            # landing
│   │   ├── globals.css         # Tailwind + design tokens
│   │   │
│   │   ├── (marketing)/        # public marketing
│   │   │   ├── page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── ...
│   │   │
│   │   ├── (auth)/             # unauthenticated flows
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── verify/page.tsx
│   │   │
│   │   ├── (app)/              # authenticated shell (own layout: nav + guard)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/...
│   │   │   ├── portfolio/...
│   │   │   ├── directory/page.tsx
│   │   │   ├── projects/...
│   │   │   ├── quotes/...
│   │   │   ├── messages/...
│   │   │   └── settings/...
│   │   │
│   │   ├── admin/              # admin (role-guarded)
│   │   │
│   │   └── api/                # Route Handlers (webhooks, uploads, exports)
│   │       ├── webhooks/supabase/route.ts
│   │       └── ...
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── forms/              # react-hook-form + zod wiring
│   │   └── shared/             # cross-cutting components
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # browser client
│   │   │   ├── server.ts       # RSC/server client
│   │   │   ├── admin.ts        # service-role (server-only)
│   │   │   └── middleware.ts   # session refresh helper
│   │   ├── auth/               # session helpers, guards, role checks
│   │   ├── money.ts            # Money type, converters, formatters
│   │   ├── i18n/               # locales, dictionaries, config
│   │   ├── db/                 # typed query helpers / repositories
│   │   ├── validators/         # zod schemas (one per domain)
│   │   └── utils.ts
│   │
│   ├── actions/                # Server Actions, grouped by domain
│   │   ├── profile.ts
│   │   ├── portfolio.ts
│   │   ├── projects.ts
│   │   ├── quotes.ts
│   │   └── ...
│   │
│   └── types/                  # shared TS types (generated DB types live here)
│       └── database.types.ts   # generated via supabase gen types
│
├── middleware.ts               # session refresh + route guards
├── tailwind.config.ts
├── next.config.mjs
├── .env.example
└── package.json
```

Key conventions:

- **One zod schema per domain** in `lib/validators`, imported by both Server Actions (authoritative validation) and Client forms (UX validation).
- **Repositories** in `lib/db` encapsulate Supabase queries so components/actions never scatter raw queries.
- `types/database.types.ts` is generated from the live schema (`supabase gen types typescript`).

---

## 3. Database Architecture

**Naming & conventions**

- Table names: `snake_case`, **plural**.
- Primary keys: `uuid` (`gen_random_uuid()`), matching Supabase `auth.users.id` where applicable.
- Every table: `created_at timestamptz default now()`, `updated_at timestamptz` maintained by a trigger.
- Statuses: `text` + `CHECK` constraints (not native enums) — easier to extend via migration without enum surgery.
- Soft-delete only where legally/operationally required (reviews, projects); otherwise hard delete.
- Monetary values: `numeric(20,0)` (see §12).

### 3.1 Entity Relationship Overview

```
auth.users (Supabase)
   │ 1:1
profiles ──────< editor_profiles (1:1 extension)
   │                    │
   │                    ├──< editor_skills >── skills (m2m)
   │                    ├──< editor_software >── software (m2m)
   │                    ├──< portfolio_projects >──< portfolio_media
   │                    ├──< services
   │                    └──< verifications
   │
   ├──< rate_submissions (anonymous rate data)
   ├──< quotes >──< quote_items
   ├──< projects (as owner) >──< project_applications >── profiles (applicant)
   ├──< collaborations (as owner or collaborator)
   ├──< reviews (author / recipient)
   ├──< conversations >──< conversation_participants
   ├──< messages
   ├──< notifications
   ├──< community_posts >──< community_comments
   └──< reports
```

### 3.2 Core Tables (DDL)

```sql
-- ===== Identity =====

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text not null,
  avatar_path   text,                       -- storage path, not URL
  cover_path    text,
  bio           text,
  role          text not null default 'editor'
                check (role in ('editor','customer','admin')),
  is_verified   boolean not null default false,
  is_public     boolean not null default true,
  locale        text not null default 'fa',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.editor_profiles (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null unique references public.profiles(id) on delete cascade,
  headline         text,
  years_experience int check (years_experience >= 0),
  location         text,
  city             text,
  is_available     boolean not null default true,
  -- reputation snapshot (also computed live from reviews)
  rating_avg       numeric(3,2) not null default 0,
  rating_count     int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ===== Skills / Software (reference lists) =====

create table public.skills (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name_fa    text not null,
  name_en    text,
  category   text
);

create table public.editor_skills (
  editor_id uuid not null references public.editor_profiles(id) on delete cascade,
  skill_id  uuid not null references public.skills(id) on delete cascade,
  primary key (editor_id, skill_id)
);

create table public.software (
  id      uuid primary key default gen_random_uuid(),
  slug    text unique not null,
  name    text not null
);

create table public.editor_software (
  editor_id   uuid not null references public.editor_profiles(id) on delete cascade,
  software_id uuid not null references public.software(id) on delete cascade,
  primary key (editor_id, software_id)
);

-- ===== Portfolio =====

create table public.portfolio_projects (
  id            uuid primary key default gen_random_uuid(),
  editor_id     uuid not null references public.editor_profiles(id) on delete cascade,
  title         text not null,
  description   text,
  role          text,                       -- e.g. 'editor', 'motion designer'
  client        text,
  year          int,
  status        text not null default 'published'
                check (status in ('draft','published','private')),
  is_featured   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on public.portfolio_projects (editor_id, status);

create table public.portfolio_media (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.portfolio_projects(id) on delete cascade,
  kind        text not null check (kind in ('image','video_embed','video_url')),
  url         text not null,                -- external embed/URL or storage path
  is_cover    boolean not null default false,
  sort_order  int not null default 0
);
create index on public.portfolio_media (project_id);

-- ===== Services (what an editor offers, with rates) =====

create table public.services (
  id          uuid primary key default gen_random_uuid(),
  editor_id   uuid not null references public.editor_profiles(id) on delete cascade,
  category    text not null,                -- e.g. editing, motion_2d, color
  title       text not null,
  description text,
  rate_rial   numeric(20,0) not null,       -- integer Rial, see §12
  rate_unit   text not null default 'project'
              check (rate_unit in ('project','hour','day','minute','second')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index on public.services (editor_id, category);

-- ===== Rate Guide (crowd-sourced pricing data) =====

create table public.rate_categories (
  id      uuid primary key default gen_random_uuid(),
  slug    text unique not null,
  name_fa text not null,
  name_en text,
  sort    int not null default 0
);

create table public.rate_submissions (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.rate_categories(id),
  experience    text not null check (experience in ('junior','mid','senior')),
  amount_rial   numeric(20,0) not null,
  unit          text not null default 'project',
  city          text,
  is_anonymous  boolean not null default true,
  -- nullable owner: kept only for moderation; never exposed publicly
  submitted_by  uuid references public.profiles(id) on delete set null,
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected')),
  created_at    timestamptz not null default now()
);
create index on public.rate_submissions (category_id, experience, status);

-- As built (Phase 7, migrations 0010–0013) the shipped table adds three
-- moderation columns used by the Phase 15 queue — source_hash text,
-- reviewed_by uuid → profiles, reviewed_at timestamptz — plus an index on
-- (source_hash, created_at) and a CHECK on city length (≤ 60).
--
-- Migration 0013 adds the project characteristics that make one rate comparable
-- with another. All are nullable and deliberately COARSE (duration in buckets,
-- not seconds): in a small market an exact figure is a re-identifying
-- fingerprint. duration_bucket, complexity, deliverable_count (1–99),
-- revision_count (0–50), turnaround, usage_rights, includes_motion,
-- includes_color, includes_sound — each constrained by a CHECK on its
-- vocabulary — plus the six launch categories the guide was missing
-- (short_form, youtube, commercial, wedding, documentary, vfx).
--
-- Two SECURITY DEFINER functions form the entire public surface; raw rows are
-- never publicly readable:
--   * rate_guide_aggregates() → per (category, experience, unit) over APPROVED
--     rows only: sample_count, p25/median/p75, min/max in integer Rial, plus
--     the category slug. Percentiles use percentile_disc, so every published
--     figure is an OBSERVED amount — no floating-point money math (§12).
--   * submit_rate(category, experience, amount_rial, unit, city, is_anonymous,
--     duration_bucket, complexity, deliverables, revisions, turnaround,
--     usage_rights, includes_motion, includes_color, includes_sound)
--     → the only insert path. It pins submitted_by = auth.uid() and
--     status = 'pending' in the database (neither is an argument), forces
--     is_anonymous = true for logged-out callers, and returns the new id.
--     A function is required here because PostgREST always issues
--     INSERT … RETURNING, and RLS evaluates RETURNING against the SELECT
--     policies — which deliberately do not exist for the public.
--
-- The guide is a MARKET REFERENCE, not a price list, and the rule that keeps it
-- honest lives in the app: a group publishes a median only from
-- MIN_SAMPLES_FOR_MEDIAN = 3 approved samples (src/lib/validators/rate.ts).
-- Below that the page shows the observed min–max and says the data is thin, so
-- one person's quote is never presented as the market price. Moderation is
-- /admin/rates (approve/reject → status + reviewed_by + reviewed_at); only
-- approved rows reach rate_guide_aggregates().

-- ===== Quotes =====

create table public.quotes (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  client_name   text not null,
  project_title text,
  notes         text,
  status        text not null default 'draft'
                check (status in ('draft','sent','accepted','declined')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.quote_items (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity    numeric(20,4) not null default 1,   -- quantity only; no currency
  unit_rial   numeric(20,0) not null,             -- price always integer Rial
  -- total = quantity * unit_rial computed in app layer, rounded to integer
  sort_order  int not null default 0
);

-- ===== Projects (overflow outsourcing) =====

create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  description   text not null,
  category      text,
  budget_min_rial numeric(20,0),
  budget_max_rial numeric(20,0),
  deadline      date,
  status        text not null default 'draft'
                check (status in ('draft','open','in_progress','completed','cancelled')),
  is_public     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on public.projects (status, is_public, created_at desc);

-- ===== Applications =====

create table public.project_applications (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  applicant_id  uuid not null references public.profiles(id) on delete cascade,
  cover_letter  text,
  proposed_rial numeric(20,0),
  status        text not null default 'pending'
                check (status in ('pending','accepted','rejected','withdrawn')),
  created_at    timestamptz not null default now(),
  unique (project_id, applicant_id)
);
create index on public.project_applications (project_id, status);
create index on public.project_applications (applicant_id);

-- ===== Collaborations (accepted engagements) =====

create table public.collaborations (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects(id) on delete cascade,
  owner_id        uuid not null references public.profiles(id),
  collaborator_id uuid not null references public.profiles(id),
  agreed_rial     numeric(20,0),
  status          text not null default 'active'
                  check (status in ('active','completed','cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (project_id, collaborator_id)
);

-- ===== Reviews =====

create table public.reviews (
  id             uuid primary key default gen_random_uuid(),
  collaboration_id uuid not null references public.collaborations(id) on delete cascade,
  author_id      uuid not null references public.profiles(id),
  recipient_id   uuid not null references public.profiles(id),
  rating         int not null check (rating between 1 and 5),
  body           text,
  is_public      boolean not null default true,
  created_at     timestamptz not null default now(),
  check (author_id <> recipient_id),
  unique (collaboration_id, author_id)   -- one review per participant per job
);
create index on public.reviews (recipient_id);

-- ===== Verification =====

create table public.verifications (
  id          uuid primary key default gen_random_uuid(),
  editor_id   uuid not null references public.editor_profiles(id) on delete cascade,
  type        text not null check (type in ('identity','skill','portfolio')),
  evidence    text,                       -- storage path / notes
  status      text not null default 'pending'
              check (status in ('pending','approved','rejected')),
  reviewed_by uuid references public.profiles(id),   -- admin
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ===== Messaging =====

create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  unread_count    int not null default 0,
  primary key (conversation_id, profile_id)
);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id),
  body            text not null,
  created_at      timestamptz not null default now()
);
create index on public.messages (conversation_id, created_at);

-- ===== Notifications =====

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  type       text not null,
  payload    jsonb not null default '{}'::jsonb,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.notifications (recipient_id, is_read, created_at desc);

-- ===== Community =====

create table public.community_posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  body       text not null,
  category   text,
  created_at timestamptz not null default now()
);

create table public.community_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  parent_id  uuid references public.community_comments(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

-- ===== Resources =====

create table public.resources (
  id        uuid primary key default gen_random_uuid(),
  slug      text unique not null,
  title     text not null,
  body      text not null,
  category  text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ===== Moderation =====

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('profile','project','review','message','community_post')),
  target_id   uuid not null,
  reason      text not null,
  status      text not null default 'open'
              check (status in ('open','resolved','dismissed')),
  created_at  timestamptz not null default now()
);
```

### 3.3 Indexes, Timestamps, Ownership

- **Indexes** added above where query patterns are known (FKS used in lookups, status filters, `recipient_id` for reviews/notifications). We add more only when a real query justifies it (avoid premature indexing).
- **`updated_at`** maintained by a shared trigger:

```sql
create function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
```

- **Ownership** is always expressed by an explicit `*_id` column referencing `profiles`/`editor_profiles`. Ownership is what RLS keys off (§5).

### 3.4 Explicitly *Not* Created (yet)

- No `teams` / `team_members` (Phase "future teams").
- No `analytics_events` table — analytics via server-side event logging + external tooling later.
- No payment/ledger tables — monetization is future; money is stored but no transactions occur.
- No separate `reputation` table — reputation is **computed** from `reviews` (aggregate) plus denormalized counters on `editor_profiles`.

---

## 4. Supabase Architecture

| Concern          | Supabase service                    | Notes |
|------------------|-------------------------------------|-------|
| Database         | PostgreSQL                          | Schema + RLS via migrations |
| Auth             | Supabase Auth                       | email/password + phone OTP; sessions in cookies |
| Files            | Supabase Storage                    | avatars, covers, thumbnails only |
| Realtime         | Supabase Realtime (later)           | messaging / notifications presence |
| Edge Functions   | *Not used initially*                | prefer Next.js Route Handlers on Vercel |

**Three clients (never confused):**

1. `lib/supabase/server.ts` — server-side client (RSC / Server Actions / Route Handlers). Uses the user's session cookie → runs with the *user's* privileges → subject to RLS.
2. `lib/supabase/client.ts` — browser client for interactivity (realtime, optimistic reads). Also subject to RLS.
3. `lib/supabase/admin.ts` — **service-role** client. `import 'server-only'`. Used only for: seeding, moderation/verification actions, background jobs. Never imported by anything the browser can reach.

**Environment variables** (see §17) separate `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe, public) from `SUPABASE_SERVICE_ROLE_KEY` (secret, server-only).

**Migrations** are the single source of truth (no "edit in dashboard"). Use Supabase CLI: `supabase db diff` → committed SQL → applied in CI + locally.

---

## 5. RLS Strategy

**Default-deny.** Every table starts with `enable row level security` and **no** policies. Access is granted explicitly.

**Patterns**

```sql
alter table public.profiles enable row level security;

-- public read of public profiles
create policy "profiles are viewable when public"
  on public.profiles for select
  using (is_public = true);

-- owner full control over own row
create policy "owners manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- admins override
create policy "admins manage all"
  on public.profiles for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));
```

**Recurring rules**

- `select`: `using` that allows either (a) the resource is public, (b) the user owns it, or (c) the user is a participant (for collaborations, conversations, project applications visible to the project owner).
- `insert`: `with check (auth.uid() = <owner_column>)`.
- `update`/`delete`: `using (auth.uid() = <owner_column>) with check (auth.uid() = <owner_column>)`.
- **Admin** gets a shared policy set built on a `is_admin()` helper (via a `security definer` function) rather than inlining `role='admin'` checks everywhere.

```sql
create function public.is_admin() returns boolean language sql stable security definer
  set search_path = public as $$
    select exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    );
  $$;
```

**Special cases**

- `rate_submissions`: **as built** — anyone (including logged-out visitors) may insert, but only through the `submit_rate()` SECURITY DEFINER function, which pins `submitted_by = auth.uid()` and `status = 'pending'`; the permissive RLS INSERT policy is kept as defence in depth. There is **no** public SELECT policy at all: raw rows are visible to their own submitter and to admins only, so `submitted_by` cannot leak (no column-level grant trick needed). The public reads aggregates exclusively through `rate_guide_aggregates()`.
- `project_applications`: visible to the applicant **and** the project owner (owner needs to review).
- `messages` / `conversation_participants`: participant-only.
- `reviews`: readable by all when `is_public`; writable only by the author, and only for a `collaboration` they participated in (enforced in app + a DB trigger guard as backstop).

**Column-level protection**: use `grant select (…)` / column policies to hide sensitive columns (`submitted_by`, admin notes) rather than relying on the app to omit them.

---

## 6. Authentication Strategy

- **Provider:** Supabase Auth. Email/password as the baseline; **phone OTP (SMS)** as the primary channel for Iranian users (email adoption is lower; phone-first is the norm).
  - Note: Supabase's native SMS uses Twilio/MessageBird; for Iranian numbers we may need a custom SMS provider (Kavenegar/SMS.ir) via a small Route Handler + `signInWithOtp` admin flow. Flag this as a Phase-4 decision (see §19).
- **Sessions:** cookie-based via `@supabase/ssr`. `middleware.ts` refreshes the session token on each request (the canonical Supabase pattern) — never store tokens in `localStorage`.
- **Auth flows as Server Components** with Server Actions (or Route Handlers for OTP verification) for credential handling; passwords/OTP codes never touch client state beyond form fields.
- **Guards:**
  - `(app)` layout reads the session server-side; unauthenticated → redirect to `/login`.
  - `(auth)` routes redirect to dashboard if already authenticated.
  - `admin/` additionally checks `is_admin()`.
- **On signup:** create the `profiles` row (and `editor_profiles` row) via a Supabase trigger on `auth.users` insert — guarantees a 1:1 profile exists before any app code runs.
- **Onboarding:** incomplete profiles are gated but non-blocking (profile completeness score on the dashboard).

---

## 7. Storage Strategy

- **Buckets:**
  - `avatars` (private write, public read via signed/cached URLs)
  - `covers` (same)
  - `portfolio-thumbnails` (owner-write, public read)
- **Constraints:** image-only MIME allow-list, size limits, and filename sanitization enforced in app + Storage policies.
- **Upload path:** signed upload from the browser to Supabase Storage (RLS-scoped), storing the returned **path** (not a signed URL) in the DB row. URLs are generated on read (server-side) so expired signed URLs never persist.
- **No video hosting.** Portfolio videos are external URLs/embeds (YouTube, Vimeo, Aparat — the Iranian platform). `portfolio_media.kind` encodes this.
- **Public read via RLS storage policies**, not service-role.

---

## 8. Server Component / Client Component Strategy

**Default = Server Components.** Anything that can render without interactivity is RSC.

| Concern                 | Where it lives |
|-------------------------|----------------|
| Data fetching (profiles, directory, projects) | Server Components |
| Mutations (forms)       | Server Actions (authoritative) |
| Session & auth checks   | Server only |
| Money formatting        | Shared pure functions (usable both sides) |
| Realtime (messages, notifications) | Client Components |
| Instant search / filters | Client Components |
| Image upload / dropzones | Client Components |
| Modals, toasts, drawers | Client (shadcn/ui) |

**Rules**

- Mark the boundary deliberately: `'use client'` only at the leaf/feature level, never on whole pages or layouts that can be server-rendered.
- Pass **serializable** props across the RSC→Client boundary; pass data down, not Supabase clients.
- Keep the browser Supabase client usage to read-only + realtime; mutations go through Server Actions so authorization is centralized.

---

## 9. Route Architecture

| Route group      | Purpose                    | Auth           |
|------------------|----------------------------|----------------|
| `(marketing)`    | landing, pricing, about    | public         |
| `(auth)`         | login, signup, verify, reset | anonymous    |
| `(app)`          | authenticated product      | authenticated  |
| `admin`          | moderation, verification   | admin          |
| `api/*`          | webhooks, uploads, exports | varies         |

**Route conventions**

- Nested layouts: `(app)/layout.tsx` holds the shell (sidebar + topbar + mobile nav); sub-routes render in an RSC page.
- Server Actions colocated in `src/actions/<domain>.ts`, one action per mutation, each:
  1. resolves the session + asserts authorization,
  2. validates with zod,
  3. executes the repository call,
  4. revalidates affected paths (`revalidatePath`).
- Route Handlers reserved for: OTP verification callbacks, file/webhook ingestion, CSV/PDF export, anything non-HTML or cross-origin.
- `middleware.ts` only refreshes sessions + coarse redirects; fine-grained auth is in layouts/actions.

---

## 10. Validation Strategy

- **Zod is the single contract.** One schema per domain entity in `lib/validators`.
- **Two layers:**
  1. *Server Actions* validate with the authoritative schema and return typed, field-level errors — this is the security boundary and is always enforced.
  2. *Client forms* (react-hook-form + `@hookform/resolvers/zod`) reuse the same schema for instant UX feedback; client validation is a convenience, never the boundary.
- Shared schema approach: define `baseSchema`, and `clientSchema` (looser, for optimistic UI) vs `serverSchema` (strict) where they differ.
- Example of the pattern:

```ts
// lib/validators/project.ts
export const projectSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(5000),
  budgetMinRial: z.money().optional(),     // branded integer money schema
  deadline: z.isoDate().optional(),
});
```

- Validation errors are mapped to localized messages (§11), never raw zod strings in production UI.

---

## 11. RTL / Localization Strategy

**RTL is the default.** Persian is the primary locale; English is additive.

- `next-intl` (with App Router integration) for routing + message catalogs. Locale-prefixed routing: `fa` as default (no prefix or `/fa`), `en` opt-in. *(This is a library, not a framework change — within the approved stack.)*
- `<html dir="rtl" lang="fa">` set from the active locale in the root layout; `dir` flips for English.
- **Logical CSS everywhere**: Tailwind logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`), never hard-coded `left`/`right`/`ml`/`mr` in layout code.
- **Fonts**: Vazirmatn (RTL, latin digits support) via `next/font`, with a Latin fallback stack. Numbers: support both Persian (`۰۱۲۳`) and Latin digit rendering — a shared number formatter decides (see §12).
- **Dates**: `Intl.DateTimeFormat('fa-IR')` (Jalali calendar) for display; storage always UTC ISO.
- **Assets**: icons/illustrations must be direction-agnostic or provide mirrored variants.
- **Content**: all user-generated content supports mixed LTR/RTL inline; use `dir="auto"` on user text blocks.

---

## 12. Money / Currency Strategy

**Rules**

1. **Never floats.** All monetary amounts are **integers**.
2. **Canonical unit = Rial (IRR)**, the smallest official unit (1 Toman = 10 Rial). Storing Rial avoids any fractional subdivision ever. Display defaults to **Toman** (what Iranian professionals quote).
3. **DB:** `numeric(20,0)` for amounts. Quantities may be fractional but **never** currency.
4. **TS:** a branded type serialized as a **string** across JSON/API boundaries to dodge JS `number` precision entirely.

```ts
// lib/money.ts
export type Money = { readonly __brand: 'Money'; readonly rial: string }; // string, not number

export const rial = (n: bigint | number | string): Money => ({ __brand: 'Money', rial: BigInt(n).toString() });

export const toman = (m: Money): bigint => BigInt(m.rial) / 10n;          // 1 Toman = 10 Rial
export const tomanToRial = (t: bigint): Money => rial(t * 10n);

// Display: Toman by default, grouped, locale-aware digits
export function formatToman(m: Money, opts?: { locale?: 'fa' | 'en'; digits?: 'fa' | 'en' }) {
  const n = Number(toman(m)); // safe: display only, never arithmetic
  return new Intl.NumberFormat(opts?.locale === 'fa' ? 'fa-IR' : 'en-US').format(n);
}

// zod schema for money
export const moneySchema = z.string().regex(/^\d+$/, 'invalid amount').transform((s) => rial(s));
```

5. **Single currency** (IRR) for all real money math. If USD equivalents are ever shown (e.g. for a client-facing glance), they are display-only conversions computed from a configurable reference rate — **never** stored as, or mixed into, authoritative amounts.
6. **No floating arithmetic** anywhere: add/subtract via `bigint`; quote totals = `Σ (quantity × unit_rial)` rounded to integer Rial in app code.

---

## 13. Testing Strategy

| Layer                    | Tool                              | Scope |
|--------------------------|-----------------------------------|-------|
| Unit (pure logic)        | Vitest                            | money, validators, formatting, reputation math |
| Component                | Vitest + React Testing Library    | shadcn forms, cards, RTL rendering |
| Integration (DB/RLS)     | Vitest + a Supabase **local** instance | RLS policies, repositories, triggers |
| E2E                      | Playwright                        | critical loops (signup → profile → project → application → review) |
| Type-safety              | `tsc --noEmit` in CI + generated DB types | contract drift |

- **RLS tests are non-negotiable**: seed two users + admin, assert each can/cannot read/write every resource (a policy matrix test).
- CI: lint + typecheck + unit + integration (Supabase CLI local DB) + a smoke E2E on the preview deployment.

---

## 14. Error Handling Strategy

- **Server Actions** return a typed `ActionResult<T> = { ok: true; data } | { ok: false; error: { code; message; fields? } }` — never throw raw exceptions across the boundary.
- **Zod errors** map to `fields` with localized messages.
- **Route Handlers** return typed JSON error envelopes + correct HTTP status.
- **Error boundaries** (`error.tsx` per route) for unexpected client/render failures; `not-found.tsx`, `loading.tsx` skeletons everywhere.
- **Expected failures** (validation, permission, not-found, rate-limit) are modeled as values; **unexpected failures** are caught at the edge and surfaced minimally.
- **Logging:** structured server logs; a client-side error reporter (Sentry optional) only for uncaught frontend errors. Never log PII or tokens.
- **Supabase error mapping**: a single `normalizeSupabaseError()` converts unique-violation/FK/RLS errors into friendly codes.

---

## 15. Security Strategy

- **RLS as the primary boundary** (see §5) with default-deny.
- **Never expose service-role key** to the browser; `NEXT_PUBLIC_*` only ever contains the anon key + URL.
- **Never trust client-only checks**: every mutation re-authorizes server-side, every query is RLS-scoped.
- **Input validation** on every mutation (zod), output encoding (React escapes by default; no `dangerouslySetInnerHTML` for user content).
- **CSRF**: rely on same-site cookies + non-mutating GET; Server Actions include origin checks where needed.
- **Rate limiting**: on auth endpoints (OTP, password reset) and on high-volume mutations (messages, applications) — via Vercel/edge or a DB-backed limiter.
- **Secrets**: managed via Vercel env (encrypted), `.env` git-ignored, `.env.example` committed with placeholders.
- **Uploads**: MIME + size allow-lists, sanitized filenames, no executable content; storage policies mirror DB RLS.
- **Abuse/moderation**: `reports` table + admin tooling; rate submissions gated and reviewed.
- **Supply chain**: lockfile committed, dependency audit in CI, minimal deps.
- **Privacy**: phone numbers and emails are never publicly exposed; `submitted_by` on rate submissions is column-protected.

---

## 16. Vercel Deployment Strategy

- **Framework preset** Next.js (App Router), default build output.
- **Preview deployments** per PR; **production** from `main`.
- **Environment**: three env sets (Local / Preview / Production) with separate Supabase projects (dev / staging / prod).
- **Supabase migrations** applied in CI: `supabase db push` on a dedicated database before deploy, or a migration job in the deploy pipeline (migrations are forward-only, versioned).
- **Region**: deploy nearest to Iran (e.g. Frankfurt `fra1`) for latency; serve assets via CDN.
- **Observability**: Vercel Analytics + logs; error tracking wired in later phases.
- **No secrets in the repo or client bundle.**

---

## 17. Environment Variables

```bash
# --- public (safe in browser) ---
NEXT_PUBLIC_SITE_URL=https://bumim.ir
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# --- server-only ---
SUPABASE_SERVICE_ROLE_KEY=          # NEVER in NEXT_PUBLIC_*
NEXT_PUBLIC_... (none beyond the above)

# --- optional / later ---
SMS_PROVIDER_API_KEY=               # Kavenegar / SMS.ir (phone OTP)
SENTRY_DSN=
CRON_SECRET=                        # protects internal API jobs
```

`.env.example` is committed; real values live in Vercel. `.env*` git-ignored (except `.env.example`).

---

## 18. Development Workflow

- **Repo hygiene:** trunk-based on `main`, short-lived feature branches, conventional commits, PR reviews for anything touching schema/RLS.
- **Local stack:** `next dev` + Supabase CLI (`supabase start` → local Postgres/Auth/Storage) so RLS and triggers are exercised locally, not just in the cloud.
- **Types:** regenerate `database.types.ts` after schema changes (`supabase gen types typescript`); CI fails on drift.
- **Migrations:** edit only via new migration files; never retro-edit applied migrations.
- **Seed data:** `supabase/seed.sql` for dev; deterministic test fixtures for integration tests.
- **Code quality gates:** ESLint + Prettier + `tsc --noEmit` in CI.

---

## 19. Potential Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Iranian SMS delivery** for phone OTP (Twilio unreliable for +98) | Signup friction, blocked onboarding | Custom SMS provider integration early in Phase 4; email fallback |
| **Sanctions / payment rails** for any future monetization | Can't charge via Stripe/etc. | Defer monetization; design money model currency-agnostic; explore local gateways later |
| **Supabase latency from Iran** | Slow UX | Frankfurt region; CDN assets; optimistic UI + realtime |
| **RLS misconfiguration** exposing private data | Severe privacy breach | Default-deny + policy matrix tests in CI |
| **`bigint`/`numeric` serialization drift** in money handling | Wrong amounts shown | Branded string type; single `money.ts`; tests |
| **RTL bugs creeping into layout** | Poor first impression for core audience | Logical CSS utilities enforced by lint; RTL visual checks in E2E |
| **Profile spam / fake reviews** | Reputation trust erosion | Verification + moderation queue + rate submissions review |
| **Video "hosting" temptation** | Cost/complexity explosion | Hard rule: external embeds only (Aparat/YouTube/Vimeo) |
| **Scope creep** (22 modules) | Never ships | Strict phase gating; features behind the two core loops |

---

## 20. Recommended Implementation Order

Tied to the roadmap, but sequenced by **risk and dependency** (auth and data model first, because everything depends on them):

1. **Phase 1 — Foundation:** repo scaffold (Next.js + TS + Tailwind + shadcn/ui), Supabase CLI, `next-intl` + RTL shell, `money.ts`, `env` setup, CI. *(Milestone: `fa`-RTL "hello" app on Vercel.)*
2. **Phase 3 — Database:** full schema + RLS migrations, triggers, seed, generated types, policy-matrix tests. *(Do this *before* features; schema is the contract.)*
3. **Phase 4 — Auth:** email + phone OTP (with the SMS-provider decision made here), profile trigger on signup, guards, onboarding skeleton.
4. **Phase 5 — Profiles:** editor profile CRUD, skills/software, avatars/covers, public profile page.
5. **Phase 6 — Portfolios:** projects + media, featured ordering, external video embeds.
6. **Phase 7 — Rate Guide:** categories + submissions + aggregated display, anonymous submission flow.
7. **Phase 8 — Quotes:** calculator + quote items + generator (PDF) — first money-heavy feature, exercise the integer-money layer end-to-end.
8. **Phase 9 — Directory + Search:** discoverability, filters, reputation sort.
9. **Phase 10 — Projects:** posting, applications (Loop 1 begins).
10. **Phase 11 — Applications + Collaborations:** accept/reject, engagement state.
11. **Phase 12 — Reviews + Reputation + Verification:** closes Loop 1; admin verification queue.
12. **Phase 13 — Messaging + Notifications:** realtime.
13. **Phase 14 — Community + Resources:** content surfaces.
14. **Phase 15 — Admin + Moderation:** reports, moderation, analytics-lite.
15. **Phase 16 — Production hardening:** SEO, performance, security audit, launch.

> Phases 2 (design system/app shell) is folded into Phase 1's scaffold + shadcn setup and then refined alongside Phase 5. The two **core loops** are validated end-to-end by Phase 11 (Loop 1) and Phase 8 (Loop 2).

---

## Appendix — Key Decisions Summary

1. Empty repo → greenfield build; prior site preserved at tag `old-yellow-design`.
2. Supabase = database + auth + storage + RLS; Vercel = hosting.
3. Server Components default; Server Actions for mutations; thin client.
4. Default-deny RLS; `is_admin()` helper; policy-matrix tests.
5. Money = integer Rial (`numeric(20,0)`), displayed as Toman, branded string type in TS.
6. Persian/RTL first-class via `next-intl`, logical CSS, Vazirmatn, Jalali dates.
7. No video hosting; external embeds (Aparat/YouTube/Vimeo).
8. Migrations (not dashboard) are the schema source of truth.
