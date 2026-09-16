"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { consumeRateToken } from "@/lib/rate/token";
import { rateSubmissionSchema } from "@/lib/validators/rate";
import type { RateSubmissionInput } from "@/lib/validators/rate";
import { getCurrentProfile } from "@/lib/auth/session";

/**
 * Rate Guide submission + moderation (Phase 7).
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

  // Inserted through the security-definer `submit_rate` RPC, not a direct table
  // insert: `rate_submissions` has no public SELECT policy (raw rows are
  // private), and PostgREST always uses INSERT ... RETURNING, which RLS
  // evaluates against the SELECT policies — so a direct anonymous insert that
  // asks for the row back is rejected. The RPC also pins submitted_by =
  // auth.uid() and status = 'pending' inside the database, so neither can be
  // spoofed by a caller.
  const { error } = await supabase.rpc("submit_rate", {
    p_category_id: values.categoryId,
    p_experience: values.experience,
    p_amount_rial: Number(amountRial),
    p_unit: values.unit,
    p_city: values.city ?? null,
    p_is_anonymous: isAnonymous,
    // optional project characteristics
    p_duration_bucket: values.durationBucket ?? null,
    p_complexity: values.complexity ?? null,
    // Validated as bounded numeric strings; converted here (never a float).
    // Note "0" revisions is meaningful and truthy as a string, so it survives.
    p_deliverables: values.deliverables ? Number(values.deliverables) : null,
    p_revisions: values.revisions ? Number(values.revisions) : null,
    p_turnaround: values.turnaround ?? null,
    p_usage_rights: values.usageRights ?? null,
    p_includes_motion: values.includesMotion,
    p_includes_color: values.includesColor,
    p_includes_sound: values.includesSound,
  });
  if (error) return { ok: false, error: "updateFailed" };

  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Moderate a submission (Phase 7 ships the minimal approve/reject queue; the
 * full moderation tooling — reports, bulk actions, notes — is Phase 15).
 *
 * Only 'pending' rows can transition, so a decision cannot be silently
 * rewritten later, and only admins can call this at all (checked here AND by
 * the rate_submissions_admin_update policy).
 */
export async function setSubmissionStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<RateActionResult> {
  // The admin layout already gates the page and RLS gates the UPDATE; this is
  // the third layer, so a non-admin caller gets a clean result, not a redirect.
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") return { ok: false, error: "forbidden" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rate_submissions")
    .update({
      status,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select("id");

  if (error) return { ok: false, error: "updateFailed" };
  if (!data || data.length === 0) return { ok: false, error: "notPending" };

  // Approving publishes the row into the aggregates; rejecting removes it.
  revalidatePath("/", "layout");
  return { ok: true };
}
