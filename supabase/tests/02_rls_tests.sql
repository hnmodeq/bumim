-- ============================================================================
-- RLS test suite (run after auth stub + migrations + seed + roles).
--
-- Simulates the three client identities by switching roles and setting the
-- JWT GUCs that Supabase normally derives from the auth session:
--
--   anonymous   : set role anon            (no request.jwt.claim.sub)
--   sara        : set role authenticated;  set request.jwt.claim.sub = sara
--   amir        : set role authenticated;  set request.jwt.claim.sub = amir
--   admin       : set role authenticated;  set request.jwt.claim.sub = admin
--
-- Any assertion failure raises an exception, failing the test run.
-- ============================================================================

-- Seed UUIDs are stored as session GUCs so they are readable inside the
-- DO blocks below (psql \set variables are not interpolated there).
do $$
begin
  perform set_config('t.sara',   '00000000-0000-4000-8000-000000000001', false);
  perform set_config('t.amir',   '00000000-0000-4000-8000-000000000002', false);
  perform set_config('t.negar',  '00000000-0000-4000-8000-000000000003', false);
  perform set_config('t.reza',   '00000000-0000-4000-8000-000000000004', false);
  perform set_config('t.admin',  '00000000-0000-4000-8000-0000000000aa', false);
  perform set_config('t.ep_sara','10000000-0000-4000-8000-000000000001', false);
  perform set_config('t.ep_amir','10000000-0000-4000-8000-000000000002', false);
end $$;

-- ---------------------------------------------------------------------------
-- Test helpers (owned by the superuser; SECURITY INVOKER so they run as the
-- current role and RLS still applies).
-- ---------------------------------------------------------------------------
create or replace function tests.assert_count(actual bigint, expected bigint, msg text)
returns void language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'FAIL [%]: expected % but got %', msg, expected, actual;
  end if;
end $$;

-- Executes arbitrary DML as the current role and returns the affected row count.
create or replace function tests.dml_rows(sql text) returns bigint
language plpgsql as $$
declare
  n bigint;
begin
  execute sql;
  get diagnostics n = row_count;
  return n;
end $$;

-- Runs arbitrary DML as the current role and fails the test if it does NOT error.
create or replace function tests.expect_error(sql text, msg text)
returns void language plpgsql as $$
begin
  begin
    execute sql;
    raise exception 'FAIL [%]: expected statement to be denied but it succeeded', msg;
  exception
    when others then
      -- expected: statement was denied
      null;
  end;
end $$;

grant execute on function tests.assert_count(bigint, bigint, text) to anon, authenticated;
grant execute on function tests.dml_rows(text) to anon, authenticated;
grant execute on function tests.expect_error(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Setup: make sara's profile PRIVATE so we can verify both the public-read
-- boundary and the owner's ability to read their own private data.
-- ---------------------------------------------------------------------------
update public.profiles set is_public = false
where id = current_setting('t.sara')::uuid;

-- ============================================================================
-- 1. ANONYMOUS access
-- ============================================================================
reset role;
reset request.jwt.claim.sub;
reset request.jwt.claim.role;
set role anon;

do $$
begin
  -- public profiles: amir, negar, reza, admin (sara is private)
  perform tests.assert_count((select count(*) from public.profiles), 4, 'anon: profiles count');
  -- sara's private profile is hidden
  perform tests.assert_count(
    (select count(*) from public.profiles where id = current_setting('t.sara')::uuid),
    0, 'anon: cannot read private profile');
  -- public editor_profiles: amir, negar, reza
  perform tests.assert_count((select count(*) from public.editor_profiles), 3, 'anon: editor_profiles count');
  perform tests.assert_count(
    (select count(*) from public.editor_profiles where id = current_setting('t.ep_sara')::uuid),
    0, 'anon: cannot read private editor_profile');
  -- reference data is public
  perform tests.assert_count((select count(*) from public.skills), 10, 'anon: skills count');
  perform tests.assert_count((select count(*) from public.software), 10, 'anon: software count');
  -- services of public editors only (amir 2 + negar 1 + reza 2 = 5)
  perform tests.assert_count((select count(*) from public.services), 5, 'anon: services count');
  -- published portfolio of public editors (amir 2 + negar 1 + reza 1 = 4)
  perform tests.assert_count((select count(*) from public.portfolio_projects), 4, 'anon: portfolio count');
  -- sara's published portfolio is hidden (she is private)
  perform tests.assert_count(
    (select count(*) from public.portfolio_projects where editor_id = current_setting('t.ep_sara')::uuid),
    0, 'anon: cannot read private editor portfolio');
  -- media of visible projects
  perform tests.assert_count((select count(*) from public.portfolio_media), 4, 'anon: media count');
end $$;

-- anonymous cannot write anything
do $$
begin
  perform tests.expect_error(
    'insert into public.services (editor_id, category, title, rate_rial) values (''' || current_setting('t.ep_amir') || ''', ''editing'', ''x'', 1000)',
    'anon: insert service');
  perform tests.expect_error(
    'insert into public.portfolio_projects (editor_id, title) values (''' || current_setting('t.ep_amir') || ''', ''x'')',
    'anon: insert portfolio');
  perform tests.expect_error(
    'insert into public.profiles (id, username, display_name) values (''ffffffff-ffff-4fff-8fff-ffffffffffff'', ''x'', ''x'')',
    'anon: insert profile');

  -- update/delete silently affect 0 rows (RLS using() filters them out)
  perform tests.assert_count(
    tests.dml_rows('update public.profiles set bio=''x'' where id = ''' || current_setting('t.reza') || ''''),
    0, 'anon: update profile affects 0 rows');
  perform tests.assert_count(
    tests.dml_rows('delete from public.skills where id = ''20000000-0000-4000-8000-000000000001'''),
    0, 'anon: delete skill affects 0 rows');
  perform tests.assert_count(
    tests.dml_rows('update public.services set title=''x'' where editor_id = ''' || current_setting('t.ep_amir') || ''''),
    0, 'anon: update service affects 0 rows');
end $$;

-- ============================================================================
-- 2. SARA — owner of a PRIVATE profile
-- ============================================================================
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
set request.jwt.claim.role = 'authenticated';

do $$
begin
  -- owner sees their own private profile + all public profiles (4) = 5
  perform tests.assert_count((select count(*) from public.profiles), 5, 'sara: profiles count');
  perform tests.assert_count(
    (select count(*) from public.profiles where id = current_setting('t.sara')::uuid),
    1, 'sara: sees own private profile');
  -- owner sees their own editor_profile + services + portfolio
  perform tests.assert_count(
    (select count(*) from public.editor_profiles where id = current_setting('t.ep_sara')::uuid),
    1, 'sara: sees own editor_profile');
  perform tests.assert_count(
    (select count(*) from public.services where editor_id = current_setting('t.ep_sara')::uuid),
    2, 'sara: sees own services');
  perform tests.assert_count(
    (select count(*) from public.portfolio_projects where editor_id = current_setting('t.ep_sara')::uuid),
    2, 'sara: sees own portfolio');
  perform tests.assert_count(
    (select count(*) from public.portfolio_media pm
       join public.portfolio_projects pp on pp.id = pm.project_id
       where pp.editor_id = current_setting('t.ep_sara')::uuid),
    3, 'sara: sees own media');
end $$;

-- sara can create / update / delete her own resources
do $$
begin
  perform tests.assert_count(
    tests.dml_rows('insert into public.services (editor_id, category, title, rate_rial) values (''' || current_setting('t.ep_sara') || ''', ''editing'', ''تدوین تست'', 1000000)'),
    1, 'sara: insert own service');

  perform tests.assert_count(
    tests.dml_rows('update public.services set title = ''تدوین تست ویرایش‌شده'' where editor_id = ''' || current_setting('t.ep_sara') || ''' and title = ''تدوین تست'''),
    1, 'sara: update own service');

  perform tests.assert_count(
    tests.dml_rows('delete from public.services where editor_id = ''' || current_setting('t.ep_sara') || ''' and title = ''تدوین تست ویرایش‌شده'''),
    1, 'sara: delete own service');
end $$;

-- sara CANNOT modify another editor's resources
do $$
begin
  perform tests.assert_count(
    tests.dml_rows('update public.services set title=''hacked'' where editor_id = ''' || current_setting('t.ep_amir') || ''''),
    0, 'sara: cannot update amir service');
  perform tests.assert_count(
    tests.dml_rows('delete from public.portfolio_projects where editor_id = ''' || current_setting('t.ep_amir') || ''''),
    0, 'sara: cannot delete amir portfolio');
  perform tests.expect_error(
    'insert into public.portfolio_media (project_id, kind, url) values (''50000000-0000-4000-8000-000000000003'', ''image'', ''x.jpg'')',
    'sara: cannot add media to amir project');
  perform tests.assert_count(
    tests.dml_rows('update public.profiles set bio=''hacked'' where id = ''' || current_setting('t.amir') || ''''),
    0, 'sara: cannot update amir profile');
end $$;

-- ============================================================================
-- 3. AMIR — another authenticated editor
-- ============================================================================
reset role;
reset request.jwt.claim.sub;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
set request.jwt.claim.role = 'authenticated';

do $$
begin
  -- amir cannot see sara's private profile or any of her data
  perform tests.assert_count(
    (select count(*) from public.profiles where id = current_setting('t.sara')::uuid),
    0, 'amir: cannot read sara private profile');
  perform tests.assert_count(
    (select count(*) from public.editor_profiles where id = current_setting('t.ep_sara')::uuid),
    0, 'amir: cannot read sara editor_profile');
  perform tests.assert_count(
    (select count(*) from public.services where editor_id = current_setting('t.ep_sara')::uuid),
    0, 'amir: cannot read sara services');
  perform tests.assert_count(
    (select count(*) from public.portfolio_projects where editor_id = current_setting('t.ep_sara')::uuid),
    0, 'amir: cannot read sara portfolio');
  -- but amir sees the other public editors
  perform tests.assert_count((select count(*) from public.profiles), 4, 'amir: profiles count (public)');
end $$;

-- ============================================================================
-- 4. ADMIN — sees and manages everything
-- ============================================================================
reset role;
reset request.jwt.claim.sub;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000aa';
set request.jwt.claim.role = 'authenticated';

do $$
begin
  -- admin sees all profiles including sara's private one
  perform tests.assert_count((select count(*) from public.profiles), 5, 'admin: profiles count');
  perform tests.assert_count(
    (select count(*) from public.profiles where id = current_setting('t.sara')::uuid),
    1, 'admin: sees private profile');
  -- admin can modify another editor's service (amir has 2)
  perform tests.assert_count(
    tests.dml_rows('update public.services set description=''reviewed'' where editor_id = ''' || current_setting('t.ep_amir') || ''''),
    2, 'admin: update amir services');
  -- admin can write reference data
  perform tests.assert_count(
    tests.dml_rows('insert into public.skills (slug, name_fa) values (''admin-test'', ''مهارت تست'')'),
    1, 'admin: insert skill');
  perform tests.assert_count(
    tests.dml_rows('delete from public.skills where slug=''admin-test'''),
    1, 'admin: delete skill');
end $$;

-- ============================================================================
-- 5. Provisioning trigger chain (auth user -> profile -> editor profile)
--    Run as the superuser (service role), which is how Supabase applies it.
-- ============================================================================
reset role;
reset request.jwt.claim.sub;
reset request.jwt.claim.role;

do $$
declare
  new_user_id uuid := '11111111-1111-4111-8111-111111111111';
  prof_count int;
  ep_count int;
begin
  insert into auth.users (id, aud, role, email, encrypted_password, raw_user_meta_data)
  values (new_user_id, 'authenticated', 'authenticated', 'new@bumim.dev', 'x',
          '{"username":"new.editor","display_name":"تدوینگر جدید","role":"editor"}');

  select count(*) into prof_count from public.profiles where id = new_user_id;
  perform tests.assert_count(prof_count, 1, 'trigger: profile auto-created');

  select count(*) into ep_count
  from public.editor_profiles ep where ep.profile_id = new_user_id;
  perform tests.assert_count(ep_count, 1, 'trigger: editor_profile auto-created');

  -- cleanup
  delete from auth.users where id = new_user_id;
end $$;

-- ============================================================================
-- Done
-- ============================================================================
reset role;
reset request.jwt.claim.sub;
reset request.jwt.claim.role;
\echo 'ALL RLS TESTS PASSED'
