# Supabase

Supabase project configuration, database migrations, seed data, and a local
RLS test harness — the **Phase 3 (Database + Supabase Foundation)** deliverable.

## Contents

- `migrations/` — ordered SQL migrations; the **source of truth** for schema,
  relationships, indexes, and Row Level Security.
- `seed.sql` — realistic Persian/Iranian development seed data (no lorem ipsum).
- `config.toml` — local Supabase CLI configuration.
- `tests/` — a standalone RLS test harness that runs against a plain local
  PostgreSQL (no Supabase CLI required).

## Migrations

| File | Contents |
| --- | --- |
| `0001_functions.sql` | Helper functions (`set_updated_at`, `is_admin`, `is_editor_owner`, `is_editor_public`) and the auth/provisioning triggers (`handle_new_user`, `handle_new_profile`). |
| `0002_profiles.sql` | `profiles` (1:1 with `auth.users`), indexes, triggers, full RLS. |
| `0003_editor_profiles.sql` | `editor_profiles` (1:1 with `profiles`), RLS. |
| `0004_skills_software.sql` | `skills`, `software` (global reference lists) + `editor_skills`, `editor_software` (m2m joins), RLS. |
| `0005_services.sql` | `services` (integer-Rial `rate_rial numeric(20,0)`), RLS. |
| `0006_portfolio.sql` | `portfolio_projects` + `portfolio_media` (external URLs/embeds only), RLS. |

Relationship chain: `auth.users → profiles → editor_profiles → { services, portfolio_projects → portfolio_media, editor_skills, editor_software }`.

### RLS summary

- Public (`anon` and `authenticated`) can read **public** editor info.
- Users can read/edit **only their own** profile and owned resources.
- Private profiles (and everything they own) are invisible to others.
- Portfolio projects are visible only when `status = 'published'` **and** the
  owner is public; owners see their own drafts/private projects.
- Reference lists (`skills`, `software`) are publicly readable, admin-writable.
- Admins (`is_admin()`) override all policies.
- **No frontend-only authorization** — all rules are enforced in the database.

## Local testing (no Docker / no Supabase CLI)

The harness creates a local auth stand-in (`tests/00_auth_stub.sql`) so the
migrations and RLS policies run against plain PostgreSQL, then runs a full RLS
assertion suite (`tests/02_rls_tests.sql`).

```bash
# requires a local PostgreSQL with a superuser role `bumim` (password `bumim`)
bash supabase/tests/run.sh
```

Expected output ends with `ALL RLS TESTS PASSED` / `✅ ALL TESTS PASSED`.

The suite covers: anonymous read/write, owner read/write, cross-editor
isolation, admin override, and the auth→profile→editor_profile trigger chain.

## Type generation

`src/types/database.types.ts` is the generated `Database` type, wired into the
browser/server/admin clients for strongly-typed queries. Regenerate after
schema changes (once a Supabase project is linked):

```bash
supabase gen types typescript --project-id <ref> > src/types/database.types.ts
```

## Deploying to a hosted project (no Docker / CLI)

`scripts/deploy_migrations.py` applies the local migrations + seed to a hosted
Supabase project through the Management API, using a personal access token
(`sbp_...`) — no DB password, Docker, or CLI required.

```bash
SUPABASE_ACCESS_TOKEN=sbp_... SUPABASE_PROJECT_REF=xxxxxxxxxxxx \
    python3 supabase/scripts/deploy_migrations.py            # migrations + seed
    # add --skip-seed to apply migrations only
```

> The seed sets a session flag (`bumim.provisioning = 'off'`) that the
> `handle_new_user` / `handle_new_profile` triggers respect, instead of
> `ALTER TABLE ... DISABLE TRIGGER` (which fails on hosted Supabase because
> the seed role does not own `auth.users`).

## Workflow

```bash
supabase start          # local Postgres/Auth/Storage (when the CLI is available)
supabase db diff        # generate a migration from schema changes
```
