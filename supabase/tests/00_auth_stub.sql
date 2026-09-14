-- ============================================================================
-- LOCAL TEST ONLY — Supabase Auth stub (NOT part of production migrations)
--
-- Supabase provides the `auth` schema and `auth.uid()`/`auth.jwt()` functions.
-- For local RLS testing against plain PostgreSQL (no Supabase CLI/Docker),
-- this file creates a minimal stand-in so the migrations and RLS policies
-- run unchanged:
--
--   auth.users                    (minimal columns used by the seed/migrations)
--   auth.uid()                    (reads request.jwt.claim.sub)
--   auth.role()                   (reads request.jwt.claim.role)
--   auth.jwt()                    (reads request.jwt.claims)
--
-- RLS tests then simulate a logged-in user by setting the GUCs:
--   set request.jwt.claim.sub  = '<user-id>';
--   set request.jwt.claim.role = 'authenticated';
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Supabase client roles (cluster-wide; guarded for repeat runs)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'create role anon nologin';
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'create role authenticated nologin';
  end if;
end $$;

create schema if not exists auth;

create table if not exists auth.users (
  instance_id          uuid,
  id                   uuid primary key,
  aud                  text,
  role                 text,
  email                text,
  encrypted_password   text,
  email_confirmed_at   timestamptz,
  raw_app_meta_data    jsonb default '{}'::jsonb,
  raw_user_meta_data   jsonb default '{}'::jsonb,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now(),
  confirmation_token   text default '',
  email_change         text default '',
  email_change_token_new text default '',
  recovery_token       text default ''
);

-- Supabase's auth.uid() — reads the JWT subject from the session GUC.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

create or replace function auth.role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )
$$;

create or replace function auth.jwt()
returns jsonb
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true), '')::jsonb
$$;
