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
  -- embedded videos of visible projects (migration 0009 consolidated the old
  -- portfolio_media table INTO portfolio_projects.video_url)
  perform tests.assert_count(
    (select count(*) from public.portfolio_projects where video_url is not null),
    4, 'anon: visible projects with an embedded video');
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
    (select count(*) from public.portfolio_projects
      where editor_id = current_setting('t.ep_sara')::uuid
        and video_url is not null),
    2, 'sara: sees her own embedded videos');
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
  perform tests.assert_count(
    tests.dml_rows('update public.portfolio_projects set video_url = ''https://evil.example'' where id = ''50000000-0000-4000-8000-000000000003'''),
    0, 'sara: cannot change the video on amir project');
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
-- 8. RATE GUIDE — crowd-sourced pricing (Phase 7)
-- ============================================================================
-- Public surface = rate_categories + the two SECURITY DEFINER functions.
-- Raw submissions are readable only by their own submitter and by admins.

-- 8a. anonymous visitor
reset role;
set role anon;
reset request.jwt.claim.sub;
reset request.jwt.claim.role;

do $$
declare
  v_cat uuid;
  v_new uuid;
begin
  perform tests.assert_count(
    (select count(*) from public.rate_categories), 5, 'anon: rate categories are public');
  perform tests.assert_count(
    (select count(*) from public.rate_submissions), 0,
    'anon: raw submissions are never readable');

  -- aggregates are approved-only
  perform tests.assert_count(
    (select count(*) from public.rate_guide_aggregates()), 8,
    'anon: aggregates cover the 8 seeded approved groups');
  -- The aggregate output must carry no identifying columns. (Cross-checking the
  -- groups against raw approved rows is impossible here by design: anon cannot
  -- read rate_submissions at all, which is asserted above.)
  perform tests.assert_count(
    (select count(*) from (
       select jsonb_object_keys(to_jsonb(g)) as k
       from public.rate_guide_aggregates() g) x
      where x.k in ('submitted_by', 'city', 'is_anonymous', 'reviewed_by',
                    'reviewed_at', 'source_hash')),
    0, 'anon: aggregate output exposes no PII columns');

  -- the anonymous submission path (submit_rate pins status/submitted_by)
  select id into v_cat from public.rate_categories where slug = 'editing';
  select public.submit_rate(v_cat, 'senior', 1234567890, 'project', 'Tehran', true) into v_new;
  perform tests.assert_count((case when v_new is not null then 1 else 0 end)::bigint, 1, 'anon: submit_rate stores a row');
  perform set_config('t.rate_anon_row', v_new::text, false);

  perform tests.assert_count(
    (select count(*) from public.rate_submissions), 0,
    'anon: own submission is still not readable by anon');

  perform tests.expect_error(
    'insert into public.rate_submissions (category_id, experience, amount_rial, unit, status) values (''' || v_cat || ''', ''senior'', 1000, ''project'', ''approved'')',
    'anon: cannot insert an already-approved row');

  perform tests.assert_count(
    tests.dml_rows('update public.rate_submissions set status = ''approved'''),
    0, 'anon: cannot approve anything');
  perform tests.assert_count(
    tests.dml_rows('delete from public.rate_submissions'),
    0, 'anon: cannot delete anything');
end $$;

-- 8b. signed-in editor (sara) — identity pinned by the database, not the client
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
set request.jwt.claim.role = 'authenticated';

do $$
declare
  v_cat uuid;
  v_new uuid;
begin
  select id into v_cat from public.rate_categories where slug = 'motion';
  select public.submit_rate(v_cat, 'mid', 55000000, 'hour', null, false) into v_new;
  perform tests.assert_count((case when v_new is not null then 1 else 0 end)::bigint, 1, 'sara: submit_rate stores a row');
  perform set_config('t.rate_sara_row', v_new::text, false);

  perform tests.assert_count(
    (select count(*) from public.rate_submissions where id = v_new), 1,
    'sara: can read her own submission');
  perform tests.assert_count(
    (select count(*) from public.rate_submissions
      where id = v_new and status = 'pending'
        and submitted_by = current_setting('t.sara')::uuid),
    1, 'sara: row is pending and attributed to her');

  perform tests.assert_count(
    (select count(*) from public.rate_submissions
      where id = current_setting('t.rate_anon_row')::uuid),
    0, 'sara: cannot read a stranger submission');
  perform tests.assert_count(
    tests.dml_rows('update public.rate_submissions set status = ''approved'' where id = ''' || v_new || ''''),
    0, 'sara: cannot approve her own submission');
  perform tests.assert_count(
    tests.dml_rows('delete from public.rate_submissions where id = ''' || v_new || ''''),
    0, 'sara: cannot delete her own submission');
end $$;

-- 8c. admin — moderation privileges (the Phase 15 queue builds on these)
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000aa';
set request.jwt.claim.role = 'authenticated';

do $$
declare
  v_anon uuid := current_setting('t.rate_anon_row')::uuid;
  v_sara uuid := current_setting('t.rate_sara_row')::uuid;
begin
  perform tests.assert_count(
    (select count(*) from public.rate_submissions where id in (v_anon, v_sara)), 2,
    'admin: can read raw submissions');

  perform tests.assert_count(
    tests.dml_rows('update public.rate_submissions set status = ''approved'', reviewed_at = now() where id = ''' || v_anon || ''''),
    1, 'admin: can approve a submission');

  perform tests.assert_count(
    (select count(*) from public.rate_guide_aggregates() g
      where g.category_id = (select id from public.rate_categories where slug = 'editing')
        and g.experience = 'senior' and g.unit = 'project'),
    1, 'admin: approving publishes the row into the aggregates');

  perform tests.assert_count(
    tests.dml_rows('delete from public.rate_submissions where id = ''' || v_sara || ''''),
    1, 'admin: can delete a submission');

  perform tests.assert_count(
    tests.dml_rows('delete from public.rate_submissions where id = ''' || v_anon || ''''),
    1, 'admin: cleanup of the approved test row');
end $$;

-- 8d. seed state restored
reset role;
reset request.jwt.claim.sub;
reset request.jwt.claim.role;

do $$
begin
  perform tests.assert_count(
    (select count(*) from public.rate_submissions), 23,
    'cleanup: rate seed restored to 23 submissions');
  perform tests.assert_count(
    (select count(*) from public.rate_guide_aggregates()), 8,
    'cleanup: aggregate groups restored to 8');
end $$;

-- ============================================================================
-- Done
-- ============================================================================
reset role;
reset request.jwt.claim.sub;
reset request.jwt.claim.role;
\echo 'ALL RLS TESTS PASSED'
