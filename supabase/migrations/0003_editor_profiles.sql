-- ============================================================================
-- editor_profiles (migration 0003)
--
-- 1:1 extension of profiles, holding editor-specific attributes. Auto-created
-- by the on_profile_created trigger for role='editor' profiles.
-- ============================================================================

create table public.editor_profiles (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null unique references public.profiles(id) on delete cascade,
  headline         text,
  years_experience int check (years_experience >= 0),
  location         text,
  city             text,
  is_available     boolean not null default true,
  -- reputation snapshot (recomputed from reviews in a later phase)
  rating_avg       numeric(3,2) not null default 0,
  rating_count     int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- reverse lookup from profile -> editor profile (profile_id already unique)
create index on public.editor_profiles (city);

create trigger set_updated_at_editor_profiles
  before update on public.editor_profiles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.editor_profiles enable row level security;

-- public read: editor info is visible when the parent profile is public
create policy "editor_profiles_public_read"
  on public.editor_profiles for select
  to public
  using (public.is_editor_public(id));

-- owner read/write: the linked profile owner manages their editor profile
create policy "editor_profiles_owner_select"
  on public.editor_profiles for select
  to authenticated
  using (profile_id = auth.uid());

create policy "editor_profiles_owner_insert"
  on public.editor_profiles for insert
  to authenticated
  with check (profile_id = auth.uid());

create policy "editor_profiles_owner_update"
  on public.editor_profiles for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "editor_profiles_owner_delete"
  on public.editor_profiles for delete
  to authenticated
  using (profile_id = auth.uid());

-- admin override
create policy "editor_profiles_admin_all"
  on public.editor_profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
