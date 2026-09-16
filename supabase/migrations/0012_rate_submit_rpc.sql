-- ============================================================================
-- Rate Guide: anonymous submission path (migration 0012)
--
-- LATENT DEFECT REMOVED HERE
--   `rate_submissions` has no public SELECT policy (raw rows are private by
--   design). Under RLS an INSERT ... RETURNING clause is evaluated against the
--   SELECT policies, so any anonymous insert that asks for the stored row back
--   is rejected with 42501 "new row violates row-level security policy".
--   supabase-js only adds that RETURNING when `.select()` is chained, so the
--   original plain `.insert()` did work — but the flow was one `.select()` away
--   from failing for every logged-out visitor, and it could never return the new
--   id (needed for a confirmation link or a "your submission" view).
--   Signed-in submitters were unaffected (owner_select covers their own rows).
--
-- FIX
--   A SECURITY DEFINER function performs the insert as the table owner, so no
--   SELECT policy is needed to return the new id, and the RETURNING/SELECT
--   interaction can no longer break the anonymous path. It also moves two
--   guarantees from application code into the database:
--     * submitted_by is always auth.uid() — a caller can never claim an identity
--       (the value is not even accepted as an argument);
--     * status is always 'pending' and reviewed_by/reviewed_at stay NULL — a
--       caller can never publish or pre-approve their own submission.
--   Anonymous callers are forced to is_anonymous = true.
--
--   The existing RLS insert policy is KEPT as defence in depth for any client
--   that inserts directly rather than through this function.
-- ============================================================================

-- City length parity with the Zod schema (validator and DB agree).
alter table public.rate_submissions
  drop constraint if exists rate_submissions_city_length;
alter table public.rate_submissions
  add constraint rate_submissions_city_length
  check (city is null or char_length(city) <= 60);

create or replace function public.submit_rate(
  p_category_id  uuid,
  p_experience   text,
  p_amount_rial  numeric,
  p_unit         text,
  p_city         text    default null,
  p_is_anonymous boolean default true
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
  -- Vocabulary / bounds mirror the table CHECK constraints, raised early so the
  -- caller gets a clear error instead of a constraint violation.
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

  if p_amount_rial is null
     or p_amount_rial <= 0
     or p_amount_rial >= 1000000000000000 then
    raise exception 'amount out of range' using errcode = '22023';
  end if;

  if p_city is not null and char_length(btrim(p_city)) > 60 then
    raise exception 'city too long' using errcode = '22023';
  end if;

  insert into public.rate_submissions (
    category_id, experience, amount_rial, unit, city,
    is_anonymous, submitted_by, status
  ) values (
    p_category_id,
    p_experience,
    p_amount_rial,
    p_unit,
    nullif(btrim(coalesce(p_city, '')), ''),
    -- Logged-out visitors are anonymous whether they asked for it or not.
    case when v_uid is null then true else coalesce(p_is_anonymous, true) end,
    -- Pinned to the caller; never taken from the client.
    v_uid,
    'pending'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_rate(uuid, text, numeric, text, text, boolean) from public;
grant execute on function public.submit_rate(uuid, text, numeric, text, text, boolean)
  to anon, authenticated;
