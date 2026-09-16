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
  -- Migrations grant privileges to service_role (server-side admin client).
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'create role service_role nologin bypassrls';
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

-- ---------------------------------------------------------------------------
-- Supabase Storage stub (LOCAL TESTS ONLY)
--
-- Migrations 0008/0009 insert buckets and create RLS policies on
-- storage.objects using storage.foldername(). On hosted Supabase the `storage`
-- schema is provided by the platform; locally we stand in a minimal version so
-- the whole migration chain can be applied to plain PostgreSQL.
-- ---------------------------------------------------------------------------
create schema if not exists storage;

create table if not exists storage.buckets (
  id                 text primary key,
  name               text not null,
  owner              uuid,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now(),
  public             boolean default false,
  avif_autodetection boolean default false,
  file_size_limit    bigint,
  allowed_mime_types text[]
);

create table if not exists storage.objects (
  id               uuid primary key default gen_random_uuid(),
  bucket_id        text references storage.buckets(id) on delete cascade,
  name             text,
  owner            uuid,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  last_accessed_at timestamptz default now(),
  metadata         jsonb default '{}'::jsonb
);

-- The platform enables RLS on these; locally the stub owns them so it can too.
alter table storage.buckets enable row level security;
alter table storage.objects enable row level security;

-- storage.foldername('uid/dir/file.jpg') -> {uid,dir}  (all but the last segment)
create or replace function storage.foldername(name text)
returns text[]
language sql
immutable
as $$
  select case
    when name like '%/%'
      then string_to_array(
             substring(name for length(name) - position('/' in reverse(name))),
             '/')
    else '{}'::text[]
  end
$$;
