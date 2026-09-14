-- ============================================================================
-- services (migration 0005)
--
-- What an editor offers, with rates. Money is always integer Rial
-- (numeric(20,0)) — never floats (see docs/ARCHITECTURE.md §12).
-- ============================================================================

create table public.services (
  id          uuid primary key default gen_random_uuid(),
  editor_id   uuid not null references public.editor_profiles(id) on delete cascade,
  category    text not null,                 -- e.g. 'editing', 'motion_2d', 'color'
  title       text not null,
  description text,
  rate_rial   numeric(20,0) not null,        -- integer Rial
  rate_unit   text not null default 'project'
              check (rate_unit in ('project', 'hour', 'day', 'minute', 'second')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.services (editor_id, category);

create trigger set_updated_at_services
  before update on public.services
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.services enable row level security;

-- public read: visible when the owning editor is public
create policy "services_public_read"
  on public.services for select to public
  using (public.is_editor_public(editor_id));

-- owner read/write
create policy "services_owner_select"
  on public.services for select to authenticated
  using (public.is_editor_owner(editor_id));

create policy "services_owner_write"
  on public.services for all to authenticated
  using (public.is_editor_owner(editor_id))
  with check (public.is_editor_owner(editor_id));

-- admin override
create policy "services_admin_all"
  on public.services for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
