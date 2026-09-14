-- ============================================================================
-- LOCAL TEST ONLY — grants for the anon / authenticated roles.
--
-- The roles themselves (anon, authenticated) are created in 00_auth_stub.sql
-- because they are part of the Supabase Auth surface. This file grants the
-- table/function privileges that Supabase grants to those roles by default.
-- ============================================================================

grant usage on schema public to anon, authenticated;
grant usage on schema auth to anon, authenticated;

-- table DML privileges (RLS further restricts rows)
grant select, insert, update, delete on all tables in schema public to anon, authenticated;

-- sequences (none used today, harmless to grant for future serial columns)
grant usage, select on all sequences in schema public to anon, authenticated;

-- functions referenced by policies / app code
grant execute on all functions in schema public to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant execute on function auth.role() to anon, authenticated;
grant execute on function auth.jwt() to anon, authenticated;

-- the test helper schema
create schema if not exists tests;
grant usage on schema tests to anon, authenticated;
