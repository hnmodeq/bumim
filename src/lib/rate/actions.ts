"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { consumeRateToken } from "@/lib/rate/token";
import { rateSubmissionSchema } from "@/lib/validators/rate";
import type { RateSubmissionInput } from "@/lib/validators/rate";

/**
 * Rate Guide submission (Phase 7).
 *
 * Abuse controls (the real gate is human moderation before anything is shown):
 *   * honeypot field that bots fill and humans never see;
 *   * a page-load token cookie: a submission is rejected unless the form page
 *     was rendered at least MIN_DELAY_MS ago, and the token is rotated on
 *     success — this stops instant/automated POST floods without storing IPs;
 *   * duplicate detection for signed-in submitters (own rows are readable);
 *   * Zod bounds + the DB CHECK constraints as the final backstop.
 *
 * Anonymity: anonymous visitors get submitted_by = NULL. Signed-in users may
 * tick "post anonymously"; their id is still recorded for moderation only and
 * is never exposed by the public aggregate function.
 */

export type RateActionResult = { ok: true } | { ok: false; error: string };

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const noop = (key: string) => key;

export async function submitRate(input: RateSubmissionInput): Promise<RateActionResult> {
  const parsed = rateSubmissionSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };
  const values = parsed.data;

  // Honeypot: a filled hidden field means a bot.
  if (values.website !== "") return { ok: false, error: "spamDetected" };

  if (!(await consumeRateToken())) return { ok: false, error: "tooFast" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const submittedBy = user?.id ?? null;
  // Anonymous visitors are inherently anonymous; signed-in users choose.
  const isAnonymous = submittedBy ? values.isAnonymous : true;

  // Integer Toman → integer Rial (1 Toman = 10 Rial). No floats anywhere.
  const amountRial = BigInt(values.amount) * 10n;

  // Duplicate detection (signed-in submitters can read their own rows).
  if (submittedBy) {
    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const { count } = await supabase
      .from("rate_submissions")
      .select("id", { count: "exact", head: true })
      .eq("submitted_by", submittedBy)
      .eq("category_id", values.categoryId)
      .eq("experience", values.experience)
      .eq("amount_rial", Number(amountRial))
      .gte("created_at", since);
    if ((count ?? 0) > 0) return { ok: false, error: "duplicate" };
  }

  // Inserted through the security-definer `submit_rate` RPC, not a direct
  // table insert: `rate_submissions` has no public SELECT policy (raw rows are
  // private), and PostgREST always uses INSERT ... RETURNING, which RLS
  // evaluates against the SELECT policies — so a direct anonymous insert is
  // rejected. The RPC also pins submitted_by = auth.uid() and status = 'pending'
  // inside the database, so neither can be spoofed by a caller.
  const { error } = await supabase.rpc("submit_rate", {
    p_category_id: values.categoryId,
    p_experience: values.experience,
    p_amount_rial: Number(amountRial),
    p_unit: values.unit,
    p_city: values.city ?? null,
    p_is_anonymous: isAnonymous,
  });
  if (error) return { ok: false, error: "updateFailed" };

  revalidatePath("/", "layout");
  return { ok: true };
}
