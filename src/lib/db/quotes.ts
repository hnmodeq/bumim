import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type QuoteRow = Tables<"quotes">;
export type QuoteItemRow = Tables<"quote_items">;
export type QuoteWithItems = QuoteRow & { items: QuoteItemRow[] };

const QUOTE_SELECT =
  "id, owner_id, client_name, client_company, project_title, deliverables, revisions_included, deadline, expires_at, terms, notes, status, created_at, updated_at";
const ITEM_SELECT =
  "id, quote_id, description, quantity, unit_rial, sort_order";

/**
 * All reads run on the caller's own session: RLS is the authorization layer,
 * so a non-owner simply receives an empty result — there is no branch in this
 * code that could leak another editor's commercial documents.
 */

/** The signed-in editor's quotes with their items (totals computed in app). */
export async function getOwnQuotesWithItems(): Promise<QuoteWithItems[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select(`${QUOTE_SELECT}, quote_items(${ITEM_SELECT})`)
    .order("updated_at", { ascending: false });
  return (
    (data ?? []).map((q) => ({
      ...q,
      items: (q.quote_items ?? []).sort((a, b) => a.sort_order - b.sort_order),
    })) as unknown as QuoteWithItems[]
  );
}

/** One quote with items, or null when it does not exist or is not ours. */
export async function getOwnQuoteWithItems(id: string): Promise<QuoteWithItems | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select(`${QUOTE_SELECT}, quote_items(${ITEM_SELECT})`)
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const row = data as unknown as QuoteWithItems & { quote_items?: QuoteItemRow[] };
  return {
    ...row,
    items: (row.quote_items ?? []).sort((a, b) => a.sort_order - b.sort_order),
  };
}

/** Count of the editor's working (non-archived) quotes, for the nav badge. */
export async function getOwnDraftQuoteCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("quotes")
    .select("id", { count: "exact", head: true })
    .eq("status", "draft");
  return count ?? 0;
}
