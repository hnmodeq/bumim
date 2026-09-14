# Supabase

This directory will hold the Supabase project configuration and database
migrations (added in **Phase 3 — Database + Supabase Foundation**):

- `migrations/` — ordered SQL migrations (source of truth for schema + RLS).
- `seed.sql` — development seed data.
- `config.toml` — local Supabase CLI configuration.

Workflow (Phase 3+):

```bash
supabase start          # local Postgres/Auth/Storage
supabase db diff        # generate a migration from schema changes
supabase gen types typescript --project-id <ref> > src/types/database.types.ts
```
