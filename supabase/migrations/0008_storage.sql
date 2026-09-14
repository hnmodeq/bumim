-- ============================================================================
-- Storage buckets + policies (migration 0008)
--
-- Two public buckets for editor imagery:
--   * avatars  — square profile photos (max 5 MB)
--   * covers   — wide cover images  (max 10 MB)
--
-- Files are stored under `<user_id>/<filename>` so ownership is enforced by
-- path: an authenticated user may only write to their own folder. Anyone
-- (including anonymous visitors) may read, which lets the public editor
-- profile render images without auth.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880,  array['image/jpeg', 'image/png', 'image/webp']),
  ('covers',  'covers',  true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS on storage.objects
--
-- NOTE: RLS is already enabled on storage.objects by the Supabase platform;
-- we only add policies (creating a policy does not require table ownership,
-- unlike `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, which the migration
-- runner role cannot do on hosted Supabase).
-- ---------------------------------------------------------------------------

-- Public read for the two image buckets.
create policy "storage_avatars_public_read"
  on storage.objects for select to public
  using (bucket_id = 'avatars');

create policy "storage_covers_public_read"
  on storage.objects for select to public
  using (bucket_id = 'covers');

-- Owner write: the first path segment must equal the caller's user id.
create policy "storage_avatars_owner_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_avatars_owner_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_avatars_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_covers_owner_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_covers_owner_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_covers_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
