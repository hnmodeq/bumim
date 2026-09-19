"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { quoteFormSchema, type QuoteFormInput } from "@/lib/validators/quote";

export type QuoteActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/** Server-side messages are codes; the client renders localized text. */
const noop: (key: string) => string = (key) => key;

async function requireEditor(): Promise<string | null> {
  const profile = await getCurrentProfile();
  return profile?.id ?? null;
}

/**
 * Create or update a quote and its line items.
 *
 * Ownership is enforced twice: RLS (a non-owner's update/delete matches zero
 * rows and their insert with a foreign owner_id is refused) and an explicit
 * pre-check here so the caller gets a clean `forbidden` result instead of a
 * silent no-op. Money arrives as integer Toman strings and is converted to
 * integer Rial (×10) with bigint — no floating point anywhere.
 */
export async function saveQuote(input: QuoteFormInput): Promise<QuoteActionResult> {
  const ownerId = await requireEditor();
  if (!ownerId) return { ok: false, error: "forbidden" };

  const parsed = quoteFormSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };
  const v = parsed.data;

  const supabase = await createClient();

  if (v.id) {
    const { data: mine } = await supabase
      .from("quotes")
      .select("id")
      .eq("id", v.id)
      .maybeSingle();
    if (!mine) return { ok: false, error: "forbidden" };
  }

  const payload = {
    owner_id: ownerId,
    client_name: v.clientName,
    client_company: v.clientCompany?.trim() ? v.clientCompany : null,
    project_title: v.projectTitle,
    deliverables: v.deliverables?.trim() ? v.deliverables : null,
    revisions_included: v.revisionsIncluded,
    deadline: v.deadline?.trim() ? v.deadline : null,
    expires_at: v.expiresAt,
    terms: v.terms?.trim() ? v.terms : null,
    notes: v.notes?.trim() ? v.notes : null,
  };

  let quoteId = v.id;
  if (quoteId) {
    const { error } = await supabase.from("quotes").update(payload).eq("id", quoteId);
    if (error) return { ok: false, error: "updateFailed" };
    const { error: delError } = await supabase
      .from("quote_items")
      .delete()
      .eq("quote_id", quoteId);
    if (delError) return { ok: false, error: "updateFailed" };
  } else {
    const { data, error } = await supabase
      .from("quotes")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: "updateFailed" };
    quoteId = data.id;
  }

  const rows = v.items.map((item, index) => ({
    quote_id: quoteId,
    description: item.description,
    quantity: item.quantity,
    unit_rial: Number(BigInt(item.unitToman) * 10n),
    sort_order: index,
  }));
  const { error: itemError } = await supabase.from("quote_items").insert(rows);
  if (itemError) return { ok: false, error: "updateFailed" };

  revalidatePath("/dashboard/quotes", "layout");
  return { ok: true, id: quoteId };
}

/** Copy one of our quotes (header + items) into a fresh draft. */
export async function duplicateQuote(id: string): Promise<QuoteActionResult> {
  const ownerId = await requireEditor();
  if (!ownerId) return { ok: false, error: "forbidden" };

  const supabase = await createClient();
  const { data: source } = await supabase
    .from("quotes")
    .select("*, quote_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (!source) return { ok: false, error: "forbidden" };

  const { data: copy, error } = await supabase
    .from("quotes")
    .insert({
      owner_id: ownerId,
      client_name: source.client_name,
      client_company: source.client_company,
      project_title: source.project_title,
      deliverables: source.deliverables,
      revisions_included: source.revisions_included,
      deadline: source.deadline,
      expires_at: source.expires_at,
      terms: source.terms,
      notes: source.notes,
      status: "draft",
    })
    .select("id")
    .single();
  if (error || !copy) return { ok: false, error: "updateFailed" };

  const items = (source.quote_items ?? []) as {
    description: string;
    quantity: number;
    unit_rial: number;
    sort_order: number;
  }[];
  if (items.length > 0) {
    const { error: itemError } = await supabase.from("quote_items").insert(
      items
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((it, index) => ({
          quote_id: copy.id,
          description: it.description,
          quantity: it.quantity,
          unit_rial: it.unit_rial,
          sort_order: index,
        })),
    );
    if (itemError) return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/dashboard/quotes", "layout");
  return { ok: true, id: copy.id };
}

/** Archive or restore one of our quotes. */
export async function setQuoteStatus(
  id: string,
  status: "draft" | "archived",
): Promise<QuoteActionResult> {
  const ownerId = await requireEditor();
  if (!ownerId) return { ok: false, error: "forbidden" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, error: "updateFailed" };
  if (!data || data.length === 0) return { ok: false, error: "forbidden" };

  revalidatePath("/dashboard/quotes", "layout");
  return { ok: true, id };
}
