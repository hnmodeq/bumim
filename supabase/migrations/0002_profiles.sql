-- ============================================================================
-- profiles (migration 0002)
--
-- 1:1 with auth.users. Every Supabase Auth user gets a profile row via the
-- on_auth_user_created trigger; editor users additionally get an
-- editor_profiles row (see 0003).
-- ============================================================================

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  display_name text not null,
  avatar_path  text,
  cover_path   text,
  bio          text,
  role         text not null default 'editor'
               check (role in ('editor', 'customer', 'admin')),
  is_verified  boolean not null default false,
  is_public    boolean not null default true,
  locale       text not null default 'fa',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- username lookups are the primary public entry point.
create index on public.profiles (username);

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- provision a profile whenever a new auth user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- provision an editor_profiles row whenever a new editor profile is created
create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.profiles enable row level security;

-- public read: anyone (incl. anonymous) can view public profiles
create policy "profiles_public_read"
  on public.profiles for select
  to public
  using (is_public = true);

-- owner read: a user can always read their own profile (even if private)
create policy "profiles_owner_read"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- owner write: a user manages their own row
create policy "profiles_owner_insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_owner_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_owner_delete"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = id);

-- admin override: admins can read/manage all profiles
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
