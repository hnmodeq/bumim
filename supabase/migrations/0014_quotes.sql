-- ===========================================================================
-- 0014 — Quotes (Phase 8): quote calculator output documents + line items
--
-- A quote is a PRIVATE business document: only its owner may read or write it
-- (no admin override — a quote is the editor's commercial correspondence, not
-- platform content). Money is integer Rial end to end (§12 of the architecture
-- doc): `unit_rial` is numeric(20,0), quantities are integers, and totals are
-- summed in the application layer, never in floating point.
-- ===========================================================================

create table public.quotes (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,

  -- who the quote is for
  client_name   text not null check (char_length(btrim(client_name)) between 1 and 120),
  client_company text check (client_company is null or char_length(btrim(client_company)) between 1 and 120),

  -- what it covers
  project_title text not null check (char_length(btrim(project_title)) between 1 and 160),
  deliverables  text check (deliverables is null or char_length(deliverables) <= 2000),

  -- commercial shape
  revisions_included int not null default 2 check (revisions_included between 0 and 50),
  deadline      date,
  expires_at    date not null default (current_date + 30),
  terms         text check (terms is null or char_length(terms) <= 4000),
  notes         text check (notes is null or char_length(notes) <= 4000),

  -- 'draft' is the working state; 'archived' hides it from the working list.
  -- There is deliberately no 'sent/accepted' workflow: sending happens outside
  -- the platform (the PDF), and this phase must not grow contract features.
  status        text not null default 'draft' check (status in ('draft', 'archived')),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index quotes_owner_idx on public.quotes (owner_id, status, created_at desc);

create trigger set_updated_at_quotes
  before update on public.quotes
  for each row execute function public.set_updated_at();

create table public.quote_items (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references public.quotes(id) on delete cascade,
  description text not null check (char_length(btrim(description)) between 1 and 300),
  -- integer quantity (videos, minutes, rounds…); no fractional deliverables
  quantity    integer not null default 1 check (quantity between 1 and 10000),
  -- price per unit in integer Rial, signed so discount lines are representable;
  -- same magnitude ceiling as rate_submissions.amount_rial
  unit_rial   numeric(20,0) not null
              check (unit_rial >= -100000000000000 and unit_rial <= 100000000000000),
  sort_order  integer not null default 0
);

create index quote_items_quote_idx on public.quote_items (quote_id, sort_order);

-- ---------------------------------------------------------------------------
-- RLS — owner only, for everything
-- ---------------------------------------------------------------------------

alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

-- profiles.id IS the auth uid (see the profiles_owner_* policies), so ownership
-- is a direct comparison -- no helper indirection needed.
create policy "quotes_owner_all"
  on public.quotes for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "quote_items_owner_all"
  on public.quote_items for all to authenticated
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_id
        and q.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quotes q
      where q.id = quote_id
        and q.owner_id = auth.uid()
    )
  );

-- Anonymous visitors have no access at all (no policies => denied by default).
