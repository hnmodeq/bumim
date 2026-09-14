-- ============================================================================
-- skills, software, and the editor join tables (migration 0004)
--
-- skills and software are global reference lists (curated by admins).
-- editor_skills / editor_software are many-to-many links owned by the editor.
-- ============================================================================

create table public.skills (
  id        uuid primary key default gen_random_uuid(),
  slug      text unique not null,
  name_fa   text not null,
  name_en   text,
  category  text
);

create table public.software (
  id    uuid primary key default gen_random_uuid(),
  slug  text unique not null,
  name  text not null
);

create table public.editor_skills (
  editor_id uuid not null references public.editor_profiles(id) on delete cascade,
  skill_id  uuid not null references public.skills(id) on delete cascade,
  primary key (editor_id, skill_id)
);

-- reverse lookup: which editors have a given skill
create index on public.editor_skills (skill_id);

create table public.editor_software (
  editor_id   uuid not null references public.editor_profiles(id) on delete cascade,
  software_id uuid not null references public.software(id) on delete cascade,
  primary key (editor_id, software_id)
);

create index on public.editor_software (software_id);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.skills enable row level security;
alter table public.software enable row level security;
alter table public.editor_skills enable row level security;
alter table public.editor_software enable row level security;

-- skills / software: readable by everyone; writable only by admins
create policy "skills_public_read"
  on public.skills for select to public using (true);

create policy "skills_admin_write"
  on public.skills for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "software_public_read"
  on public.software for select to public using (true);

create policy "software_admin_write"
  on public.software for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- editor_skills: readable when the editor is public (or by owner/admin);
-- writable only by the editor owner or an admin.
create policy "editor_skills_public_read"
  on public.editor_skills for select to public
  using (public.is_editor_public(editor_id));

create policy "editor_skills_owner_select"
  on public.editor_skills for select to authenticated
  using (public.is_editor_owner(editor_id));

create policy "editor_skills_owner_write"
  on public.editor_skills for all to authenticated
  using (public.is_editor_owner(editor_id))
  with check (public.is_editor_owner(editor_id));

create policy "editor_skills_admin_all"
  on public.editor_skills for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- editor_software: same rules as editor_skills
create policy "editor_software_public_read"
  on public.editor_software for select to public
  using (public.is_editor_public(editor_id));

create policy "editor_software_owner_select"
  on public.editor_software for select to authenticated
  using (public.is_editor_owner(editor_id));

create policy "editor_software_owner_write"
  on public.editor_software for all to authenticated
  using (public.is_editor_owner(editor_id))
  with check (public.is_editor_owner(editor_id));

create policy "editor_software_admin_all"
  on public.editor_software for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
