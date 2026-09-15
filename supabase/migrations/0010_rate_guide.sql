-- ============================================================================
-- Rate Guide (migration 0010)
--
-- Crowd-sourced pricing data for Iranian video editors (Phase 7).
--
--   * rate_categories  — the pricing dimensions (editing, motion, color, …)
--   * rate_submissions — individual data points, optionally anonymous
--
-- Privacy / abuse model:
--   * Anyone (including anonymous visitors) may INSERT, but RLS forces
--     status='pending' on insert and pins submitted_by to the caller (or NULL
--     for anonymous). Nothing is published until an admin approves it.
--   * Raw submissions are NOT readable by the public: only the submitter and
--     admins can select rows. `submitted_by` exists purely for moderation and
--     is never exposed by the public aggregate function.
--   * The public reads ONLY aggregates of *approved* rows, via the
--     security-definer function rate_guide_aggregates().
-- ============================================================================

-- ---------------------------------------------------------------------------
-- rate_categories
-- ---------------------------------------------------------------------------
create table public.rate_categories (
  id      uuid primary key default gen_random_uuid(),
  slug    text unique not null,
  name_fa text not null,
  name_en text,
  sort    int not null default 0
);

alter table public.rate_categories enable row level security;

create policy "rate_categories_public_read"
  on public.rate_categories for select to public
  using (true);

create policy "rate_categories_admin_write"
  on public.rate_categories for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- rate_submissions
-- ---------------------------------------------------------------------------
create table public.rate_submissions (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.rate_categories(id) on delete cascade,
  experience   text not null check (experience in ('junior', 'mid', 'senior')),
  amount_rial  numeric(20,0) not null
               check (amount_rial > 0 and amount_rial < 1000000000000000),
  unit         text not null default 'project'
               check (unit in ('project', 'hour', 'day', 'minute', 'second')),
  city         text,
  is_anonymous boolean not null default true,
  -- Nullable owner: kept only for moderation; never exposed publicly.
  submitted_by uuid references public.profiles(id) on delete set null,
  status       text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now()
);

create index on public.rate_submissions (category_id, experience, status);
create index on public.rate_submissions (submitted_by);

alter table public.rate_submissions enable row level security;

-- INSERT: open to anyone (the anonymous flow), but the row MUST start as
-- 'pending' and submitted_by must be NULL (anonymous) or the caller's own id.
create policy "rate_submissions_public_insert"
  on public.rate_submissions for insert to public
  with check (
    status = 'pending'
    and (
      (auth.uid() is null and submitted_by is null)
      or submitted_by = auth.uid()
    )
  );

-- SELECT: never public. Submitters see their own rows; admins see everything.
create policy "rate_submissions_owner_select"
  on public.rate_submissions for select to authenticated
  using (submitted_by = auth.uid());

create policy "rate_submissions_admin_select"
  on public.rate_submissions for select to authenticated
  using (public.is_admin());

-- UPDATE / DELETE: admins only (the Phase 15 moderation queue).
create policy "rate_submissions_admin_update"
  on public.rate_submissions for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "rate_submissions_admin_delete"
  on public.rate_submissions for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Public aggregate view (approved rows only, no PII)
--
-- security definer so anonymous visitors can read aggregates without being
-- able to read the underlying submissions. search_path is pinned to avoid
-- search_path privilege escalation.
-- ---------------------------------------------------------------------------
create or replace function public.rate_guide_aggregates()
returns table (
  category_id   uuid,
  slug          text,
  experience    text,
  unit          text,
  sample_count  bigint,
  p25_rial      numeric,
  median_rial   numeric,
  p75_rial      numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.category_id,
    c.slug,
    s.experience,
    s.unit,
    count(*)::bigint as sample_count,
    round(percentile_cont(0.25) within group (order by s.amount_rial::double precision))::numeric as p25_rial,
    round(percentile_cont(0.50) within group (order by s.amount_rial::double precision))::numeric as median_rial,
    round(percentile_cont(0.75) within group (order by s.amount_rial::double precision))::numeric as p75_rial
  from public.rate_submissions s
  join public.rate_categories c on c.id = s.category_id
  where s.status = 'approved'
  group by s.category_id, c.slug, s.experience, s.unit
  having count(*) >= 1;
$$;

revoke all on function public.rate_guide_aggregates() from public;
grant execute on function public.rate_guide_aggregates() to anon, authenticated;
