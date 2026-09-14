-- ============================================================================
-- Profile extensions (migration 0007)
--
-- Phase 5 adds richer editor-profile fields:
--   * availability   (3-state) replaces the boolean is_available
--   * languages, industries, preferred_project_types (free-form text arrays)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Availability: 3-state enum replacing is_available (boolean).
--   'available' = Available
--   'limited'   = Limited availability
--   'booked'    = Fully booked
-- ---------------------------------------------------------------------------
alter table public.editor_profiles
  add column availability text not null default 'available'
  check (availability in ('available', 'limited', 'booked'));

-- Backfill from the old boolean: true -> available, false -> booked.
update public.editor_profiles
   set availability = case when is_available then 'available' else 'booked' end;

alter table public.editor_profiles drop column is_available;

-- ---------------------------------------------------------------------------
-- Free-form multi-value fields (text arrays, default empty).
-- ---------------------------------------------------------------------------
alter table public.editor_profiles
  add column languages               text[] not null default '{}',
  add column industries              text[] not null default '{}',
  add column preferred_project_types text[] not null default '{}';
