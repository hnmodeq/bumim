-- ============================================================================
-- Rate Guide reconciliation (migration 0011)
--
-- The hosted project was provisioned from an EARLIER DRAFT of 0010, so the
-- live schema drifted from the committed one in three ways:
--
--   1. The table carried three moderation columns the repo never declared
--      (source_hash, reviewed_by, reviewed_at) plus an index on them.
--   2. The public INSERT policy also required reviewed_by/reviewed_at to be
--      NULL (a submitter cannot pre-approve or back-date their own review).
--   3. `rate_guide_aggregates()` returned a different shape: no `slug`, and
--      the count was named `submissions` instead of `sample_count`.
--
-- (3) was a live bug: the app resolved category names from `slug` and rendered
-- sample counts from `sample_count`, so the public guide showed EMPTY category
-- captions and "NaN" sample counts while the numbers themselves were correct.
--
-- This migration makes the repo authoritative and reproducible: it adopts the
-- extra columns/policy into the canonical schema (they are strictly useful for
-- the Phase 15 moderation queue) and fixes the aggregate contract. It is safe
-- to run against both a fresh 0010 database and the drifted hosted one.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Moderation columns (nullable; only admins may write them)
-- ---------------------------------------------------------------------------
alter table public.rate_submissions
  add column if not exists source_hash text,
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
  add column if not exists reviewed_at timestamptz;

create index if not exists rate_submissions_source_hash_created_at_idx
  on public.rate_submissions (source_hash, created_at);

-- ---------------------------------------------------------------------------
-- 2. INSERT policy: rows must arrive unreviewed and pending
-- ---------------------------------------------------------------------------
drop policy if exists "rate_submissions_public_insert" on public.rate_submissions;

create policy "rate_submissions_public_insert"
  on public.rate_submissions for insert to public
  with check (
    status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and (
      (auth.uid() is null and submitted_by is null)
      or submitted_by = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 3. Public aggregate function (approved rows only, no PII)
--
-- Changes vs the draft:
--   * returns `slug` so the caller can resolve localized category names;
--   * returns `sample_count` (the name the app and its types use). `submissions`
--     is kept as an alias, and min_rial/max_rial as extras, so nothing that was
--     written against the earlier shape breaks. Both may be dropped once the
--     Phase 15 moderation tooling lands.
--   * percentiles stay on percentile_disc, i.e. every published figure is an
--     OBSERVED integer Rial amount. No floating-point money math, anywhere.
--
-- Must be dropped first: a changed RETURNS TABLE cannot be replaced in place.
-- ---------------------------------------------------------------------------
drop function if exists public.rate_guide_aggregates();

create function public.rate_guide_aggregates()
returns table (
  category_id  uuid,
  slug         text,
  experience   text,
  unit         text,
  sample_count bigint,
  submissions  bigint,
  p25_rial     numeric,
  median_rial  numeric,
  p75_rial     numeric,
  min_rial     numeric,
  max_rial     numeric
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.category_id,
    c.slug,
    s.experience,
    s.unit,
    count(*)::bigint,
    count(*)::bigint,
    percentile_disc(0.25) within group (order by s.amount_rial),
    percentile_disc(0.50) within group (order by s.amount_rial),
    percentile_disc(0.75) within group (order by s.amount_rial),
    min(s.amount_rial),
    max(s.amount_rial)
  from public.rate_submissions s
  join public.rate_categories c on c.id = s.category_id
  where s.status = 'approved'
  group by s.category_id, c.slug, s.experience, s.unit
  having count(*) >= 1;
$$;

-- security definer + explicit grants: anonymous visitors read aggregates, but
-- never the underlying rows. EXECUTE is NOT left open to PUBLIC.
revoke all on function public.rate_guide_aggregates() from public;
grant execute on function public.rate_guide_aggregates() to anon, authenticated, service_role;
