-- ============================================================================
-- portfolio_projects + portfolio_media (migration 0006)
--
-- Portfolio projects are owned by an editor. Media is stored as external
-- URLs/embeds (Aparat/YouTube/Vimeo) — the platform does not host video.
-- ============================================================================

create table public.portfolio_projects (
  id           uuid primary key default gen_random_uuid(),
  editor_id    uuid not null references public.editor_profiles(id) on delete cascade,
  title        text not null,
  description  text,
  role         text,                         -- e.g. 'editor', 'motion designer'
  client       text,
  year         int,
  status       text not null default 'published'
               check (status in ('draft', 'published', 'private')),
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.portfolio_projects (editor_id, status);

create table public.portfolio_media (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  kind       text not null check (kind in ('image', 'video_embed', 'video_url')),
  url        text not null,                  -- external embed/URL or storage path
  is_cover   boolean not null default false,
  sort_order int not null default 0
);

create index on public.portfolio_media (project_id);

create trigger set_updated_at_portfolio_projects
  before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_media enable row level security;

-- ---------------------------------------------------------------------------
-- portfolio_projects
-- ---------------------------------------------------------------------------

-- public read: only *published* projects of *public* editors are visible
create policy "portfolio_projects_public_read"
  on public.portfolio_projects for select to public
  using (
    status = 'published'
    and public.is_editor_public(editor_id)
  );

-- owner read/write (owner sees drafts and private projects too)
create policy "portfolio_projects_owner_select"
  on public.portfolio_projects for select to authenticated
  using (public.is_editor_owner(editor_id));

create policy "portfolio_projects_owner_write"
  on public.portfolio_projects for all to authenticated
  using (public.is_editor_owner(editor_id))
  with check (public.is_editor_owner(editor_id));

-- admin override
create policy "portfolio_projects_admin_all"
  on public.portfolio_projects for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- portfolio_media (visible only when the parent project is)
-- ---------------------------------------------------------------------------

create policy "portfolio_media_public_read"
  on public.portfolio_media for select to public
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and pp.status = 'published'
        and public.is_editor_public(pp.editor_id)
    )
  );

create policy "portfolio_media_owner_select"
  on public.portfolio_media for select to authenticated
  using (
    exists (
      select 1 from public.portfolio_projects pp
      where pp.id = project_id
        and public.is_editor_owner(pp.editor_id)
    )
  );

create policy "portfolio_media_owner_write"
  on public.portfolio_media for all to authenticated
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

-- admin override
create policy "portfolio_media_admin_all"
  on public.portfolio_media for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
