-- ============================================================================
-- Portfolio extension (migration 0009)
--
-- Phase 6. Extends the portfolio model to match the full editor-portfolio
-- feature set:
--   * per-project category, sort_order (manual reordering), project_date,
--     external project URL, external video URL, and a storage thumbnail path
--   * "services used" / "software used" many-to-many links
--   * a public `portfolio` storage bucket for thumbnails/images
--
-- The old `portfolio_media` table is consolidated INTO portfolio_projects
-- (a project has one thumbnail + one video URL, not an open-ended media list),
-- and the redundant `year` column is replaced by `project_date`.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. New columns on portfolio_projects
-- ---------------------------------------------------------------------------
alter table public.portfolio_projects
  add column category        text,
  add column sort_order      int  not null default 0,
  add column project_date    date,
  add column external_url    text,
  add column video_url       text,
  add column thumbnail_path  text;

-- ---------------------------------------------------------------------------
-- 2. Backfill from portfolio_media (before it is dropped)
-- ---------------------------------------------------------------------------

-- External video URL: the first video media (prefer cover, then sort order).
update public.portfolio_projects pp
set video_url = m.url
from (
  select distinct on (project_id) project_id, url
  from public.portfolio_media
  where kind in ('video_embed', 'video_url')
  order by project_id, is_cover desc, sort_order asc
) m
where m.project_id = pp.id
  and pp.video_url is null;

-- Thumbnail path: intentionally NOT backfilled. `thumbnail_path` points into the
-- `portfolio` bucket, which is created by this migration — so no pre-existing
-- media row can reference a real stored thumbnail (the old seed used a
-- placeholder path that never existed in Storage). Leaving it null renders the
-- default artwork instead of a broken image.

-- ---------------------------------------------------------------------------
-- 3. Replace `year` with `project_date` (date = year-01-01 for old rows)
-- ---------------------------------------------------------------------------
update public.portfolio_projects
set project_date = make_date(year, 1, 1)
where year is not null
  and project_date is null;

alter table public.portfolio_projects drop column year;

-- ---------------------------------------------------------------------------
-- 4. Consolidate: drop the now-redundant portfolio_media table
-- ---------------------------------------------------------------------------
drop table public.portfolio_media;

-- ---------------------------------------------------------------------------
-- 5. Services / software used (many-to-many)
-- ---------------------------------------------------------------------------
create table public.portfolio_project_services (
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (project_id, service_id)
);

create table public.portfolio_project_software (
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  software_id uuid not null references public.software(id) on delete cascade,
  primary key (project_id, software_id)
);

-- ---------------------------------------------------------------------------
-- 6. RLS — visibility mirrors the parent project
-- ---------------------------------------------------------------------------
alter table public.portfolio_project_services enable row level security;
alter table public.portfolio_project_software enable row level security;

-- public read: the owning project is published and its editor is public
create policy "pp_services_public_read"
  on public.portfolio_project_services for select to public
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and pp.status = 'published'
        and public.is_editor_public(pp.editor_id)
    )
  );

create policy "pp_services_owner_select"
  on public.portfolio_project_services for select to authenticated
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and public.is_editor_owner(pp.editor_id)
    )
  );

create policy "pp_services_owner_write"
  on public.portfolio_project_services for all to authenticated
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and public.is_editor_owner(pp.editor_id)
    )
  )
  with check (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and public.is_editor_owner(pp.editor_id)
    )
  );

create policy "pp_services_admin_all"
  on public.portfolio_project_services for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "pp_software_public_read"
  on public.portfolio_project_software for select to public
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and pp.status = 'published'
        and public.is_editor_public(pp.editor_id)
    )
  );

create policy "pp_software_owner_select"
  on public.portfolio_project_software for select to authenticated
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and public.is_editor_owner(pp.editor_id)
    )
  );

create policy "pp_software_owner_write"
  on public.portfolio_project_software for all to authenticated
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and public.is_editor_owner(pp.editor_id)
    )
  )
  with check (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and public.is_editor_owner(pp.editor_id)
    )
  );

create policy "pp_software_admin_all"
  on public.portfolio_project_software for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. `portfolio` storage bucket (public thumbnails/images)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio',
  'portfolio',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "storage_portfolio_public_read"
  on storage.objects for select to public
  using (bucket_id = 'portfolio');

create policy "storage_portfolio_owner_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_portfolio_owner_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_portfolio_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
