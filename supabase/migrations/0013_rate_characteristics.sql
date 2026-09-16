-- ============================================================================
-- Rate Guide: project characteristics + full taxonomy (migration 0013)
--
-- Phase 7 product spec requires submissions to capture the *characteristics*
-- of the job that produced the price (duration, complexity, deliverables,
-- revisions, turnaround, usage rights, which disciplines were bundled), and a
-- taxonomy covering the real market segments rather than just four crafts.
--
-- Everything here stays on the existing two tables — no new tables. All factor
-- columns are OPTIONAL: a submission with just a category, a price and an
-- experience level is still valid, because demanding ten fields would collapse
-- the crowd-sourced sample size.
--
-- All factors are stored as coarse BUCKETS rather than raw numbers wherever a
-- bucket is enough. Two reasons: exact figures are re-identifying in a small
-- market (a "47-minute documentary, 4 revisions, rush" is a fingerprint), and
-- buckets are what the aggregate display can actually use.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Project-characteristic columns
-- ---------------------------------------------------------------------------
alter table public.rate_submissions
  add column if not exists duration_bucket   text,
  add column if not exists complexity        text,
  add column if not exists deliverable_count int,
  add column if not exists revision_count    int,
  add column if not exists turnaround        text,
  add column if not exists usage_rights      text,
  add column if not exists includes_motion   boolean not null default false,
  add column if not exists includes_color    boolean not null default false,
  add column if not exists includes_sound    boolean not null default false;

alter table public.rate_submissions
  drop constraint if exists rate_submissions_duration_bucket_check,
  drop constraint if exists rate_submissions_complexity_check,
  drop constraint if exists rate_submissions_turnaround_check,
  drop constraint if exists rate_submissions_usage_rights_check,
  drop constraint if exists rate_submissions_deliverable_count_check,
  drop constraint if exists rate_submissions_revision_count_check;

alter table public.rate_submissions
  add constraint rate_submissions_duration_bucket_check
  check (duration_bucket is null or duration_bucket in
    ('under_1', 'min_1_5', 'min_5_15', 'min_15_30', 'min_30_60', 'over_60')),
  add constraint rate_submissions_complexity_check
  check (complexity is null or complexity in ('simple', 'standard', 'complex')),
  add constraint rate_submissions_turnaround_check
  check (turnaround is null or turnaround in ('flexible', 'standard', 'rush')),
  add constraint rate_submissions_usage_rights_check
  check (usage_rights is null or usage_rights in
    ('none', 'social', 'paid_ads', 'broadcast')),
  add constraint rate_submissions_deliverable_count_check
  check (deliverable_count is null or (deliverable_count >= 1 and deliverable_count <= 99)),
  add constraint rate_submissions_revision_count_check
  check (revision_count is null or (revision_count >= 0 and revision_count <= 50));

comment on column public.rate_submissions.duration_bucket is
  'Finished-video length band. Bucketed, not exact: exact figures re-identify in a small market.';
comment on column public.rate_submissions.includes_motion is
  'Motion graphics was part of this job (bundled work moves the price).';

-- ---------------------------------------------------------------------------
-- 2. Taxonomy: the market segments the spec asks for
--
-- Reference data, so it belongs in a migration (every deployed environment
-- needs the same taxonomy) as well as in seed.sql for fresh local databases.
-- Idempotent: existing categories are left untouched.
-- ---------------------------------------------------------------------------
insert into public.rate_categories (id, slug, name_fa, name_en, sort) values
  ('70000000-0000-4000-8000-000000000006', 'short_form',  'ویدیو کوتاه و ریلز',   'Short-form / Reels', 1),
  ('70000000-0000-4000-8000-000000000007', 'youtube',     'ویدیوی یوتیوب',        'YouTube',            2),
  ('70000000-0000-4000-8000-000000000008', 'commercial',  'تیزر تبلیغاتی',        'Commercial',         3),
  ('70000000-0000-4000-8000-000000000009', 'wedding',     'فیلم عروسی',           'Wedding',            4),
  ('70000000-0000-4000-8000-000000000010', 'documentary', 'مستند',                'Documentary',        5),
  ('70000000-0000-4000-8000-000000000011', 'vfx',         'جلوه‌های ویژه (VFX)',   'VFX',                8)
on conflict (id) do nothing;

-- Disciplines that already existed, re-ordered after the segments.
update public.rate_categories set sort = 6  where slug = 'motion';
update public.rate_categories set sort = 7  where slug = 'color';
update public.rate_categories set sort = 9  where slug = 'sound';
update public.rate_categories set sort = 10 where slug = 'editing';
update public.rate_categories set sort = 11 where slug = 'subtitling';

-- ---------------------------------------------------------------------------
-- 3. submit_rate v2 — accepts the optional characteristics
--
-- Recreated (not replaced) because the parameter list changes. Identity and
-- status pinning from 0012 are unchanged: submitted_by is still auth.uid() and
-- status is still always 'pending', neither of them an argument.
-- ---------------------------------------------------------------------------
drop function if exists public.submit_rate(uuid, text, numeric, text, text, boolean);

create or replace function public.submit_rate(
  p_category_id      uuid,
  p_experience       text,
  p_amount_rial      numeric,
  p_unit             text,
  p_city             text    default null,
  p_is_anonymous     boolean default true,
  -- optional project characteristics
  p_duration_bucket  text    default null,
  p_complexity       text    default null,
  p_deliverables     int     default null,
  p_revisions        int     default null,
  p_turnaround       text    default null,
  p_usage_rights     text    default null,
  p_includes_motion  boolean default null,
  p_includes_color   boolean default null,
  p_includes_sound   boolean default null
)
returns uuid
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_id  uuid;
begin
  -- Vocabulary / bounds mirror the table constraints, raised early so the
  -- caller gets a clear error instead of a raw constraint violation.
  if p_category_id is null
     or not exists (select 1 from public.rate_categories where id = p_category_id) then
    raise exception 'unknown rate category' using errcode = '22023';
  end if;

  if p_experience is null or p_experience not in ('junior', 'mid', 'senior') then
    raise exception 'invalid experience level' using errcode = '22023';
  end if;

  if p_unit is null or p_unit not in ('project', 'hour', 'day', 'minute', 'second') then
    raise exception 'invalid rate unit' using errcode = '22023';
  end if;

  if p_amount_rial is null or p_amount_rial <= 0 or p_amount_rial >= 1000000000000000 then
    raise exception 'amount out of range' using errcode = '22023';
  end if;

  if p_city is not null and char_length(btrim(p_city)) > 60 then
    raise exception 'city too long' using errcode = '22023';
  end if;

  if p_duration_bucket is not null and p_duration_bucket not in
     ('under_1', 'min_1_5', 'min_5_15', 'min_15_30', 'min_30_60', 'over_60') then
    raise exception 'invalid duration bucket' using errcode = '22023';
  end if;

  if p_complexity is not null and p_complexity not in ('simple', 'standard', 'complex') then
    raise exception 'invalid complexity' using errcode = '22023';
  end if;

  if p_turnaround is not null and p_turnaround not in ('flexible', 'standard', 'rush') then
    raise exception 'invalid turnaround' using errcode = '22023';
  end if;

  if p_usage_rights is not null and p_usage_rights not in
     ('none', 'social', 'paid_ads', 'broadcast') then
    raise exception 'invalid usage rights' using errcode = '22023';
  end if;

  if p_deliverables is not null and (p_deliverables < 1 or p_deliverables > 99) then
    raise exception 'invalid deliverable count' using errcode = '22023';
  end if;

  if p_revisions is not null and (p_revisions < 0 or p_revisions > 50) then
    raise exception 'invalid revision count' using errcode = '22023';
  end if;

  insert into public.rate_submissions (
    category_id, experience, amount_rial, unit, city, is_anonymous, submitted_by, status,
    duration_bucket, complexity, deliverable_count, revision_count, turnaround,
    usage_rights, includes_motion, includes_color, includes_sound
  ) values (
    p_category_id, p_experience, p_amount_rial, p_unit,
    nullif(btrim(coalesce(p_city, '')), ''),
    -- Logged-out visitors are anonymous whether they asked for it or not.
    case when v_uid is null then true else coalesce(p_is_anonymous, true) end,
    -- Pinned to the caller; never taken from the client.
    v_uid,
    'pending',
    p_duration_bucket, p_complexity, p_deliverables, p_revisions, p_turnaround,
    p_usage_rights,
    coalesce(p_includes_motion, false),
    coalesce(p_includes_color,  false),
    coalesce(p_includes_sound,  false)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_rate(
  uuid, text, numeric, text, text, boolean,
  text, text, int, int, text, text, boolean, boolean, boolean
) from public;
grant execute on function public.submit_rate(
  uuid, text, numeric, text, text, boolean,
  text, text, int, int, text, text, boolean, boolean, boolean
) to anon, authenticated;
