-- ============================================================================
-- Helper functions (migration 0001)
--
-- All functions are created here before the tables they reference. This is
-- safe: PostgreSQL defers resolution of table references inside function
-- bodies until first execution.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- updated_at maintenance trigger function (shared by every table with
-- an `updated_at` column).
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- is_admin() — returns true when the current user (auth.uid()) is an admin.
--
-- SECURITY DEFINER so the query against public.profiles bypasses RLS (the
-- table owner is postgres), which also prevents infinite recursion when this
-- helper is referenced from a profiles RLS policy.
--
-- Implemented in plpgsql (not `language sql`) so the table reference is
-- resolved lazily at first call, letting this migration precede the table DDL.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- is_editor_owner(editor_id) — true when the current user owns the given
-- editor_profile (i.e. auth.uid() is the linked profile_id).
-- ---------------------------------------------------------------------------
create or replace function public.is_editor_owner(editor_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.editor_profiles ep
    where ep.id = editor_id and ep.profile_id = auth.uid()
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- is_editor_public(editor_id) — true when the editor's parent profile is
-- public (drives "public can read public editor information").
-- ---------------------------------------------------------------------------
create or replace function public.is_editor_public(editor_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.editor_profiles ep
    join public.profiles p on p.id = ep.profile_id
    where ep.id = editor_id and p.is_public = true
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- handle_new_user() — after a Supabase Auth user is created, provision the
-- matching public.profiles row (username derived from metadata or the id).
-- SECURITY DEFINER so it can insert regardless of RLS.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  -- During seeding (hosted Supabase runs the seed as a non-superuser role
  -- that cannot ALTER auth.users) we set bumim.provisioning = 'off' so the
  -- seed can insert rows with explicit, fixed UUIDs without this trigger
  -- creating a conflicting profile.
  if current_setting('bumim.provisioning', true) = 'off' then
    return new;
  end if;

  base_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    'editor-' || left(new.id::text, 8)
  );
  final_username := base_username;

  -- guarantee username uniqueness
  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := base_username || '-' || substr(gen_random_uuid()::text, 1, 6);
  end loop;

  insert into public.profiles (id, username, display_name, role, locale)
  values (
    new.id,
    final_username,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), final_username),
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'editor'),
    coalesce(nullif(new.raw_user_meta_data ->> 'locale', ''), 'fa')
  );
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- handle_new_profile() — when a profile is created with role = 'editor',
-- provision the matching editor_profiles extension row (1:1).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_setting('bumim.provisioning', true) = 'off' then
    return new;
  end if;

  if new.role = 'editor' then
    insert into public.editor_profiles (profile_id)
    values (new.id);
  end if;
  return new;
end;
$$;
