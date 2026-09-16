import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/**
 * Rate Guide repository. Public aggregates are read through the
 * security-definer RPC `rate_guide_aggregates()`, which exposes only approved,
 * de-identified statistics — never raw submissions.
 */

export type RateCategory = Tables<"rate_categories">;

export type RateAggregate = {
  categoryId: string;
  slug: string;
  experience: "junior" | "mid" | "senior";
  unit: "project" | "hour" | "day" | "minute" | "second";
  sampleCount: number;
  /** Integer Rial, as a decimal string (money is never a float). */
  p25Rial: string;
  medianRial: string;
  p75Rial: string;
  /** Observed extremes — used instead of the IQR when the sample is too small. */
  minRial: string;
  maxRial: string;
};

export async function getRateCategories(): Promise<RateCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rate_categories")
    .select("*")
    .order("sort", { ascending: true });
  return data ?? [];
}

export async function getRateAggregates(): Promise<RateAggregate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("rate_guide_aggregates");
  if (error || !data) return [];
  return data.map((r) => ({
    categoryId: r.category_id,
    slug: r.slug,
    experience: r.experience,
    unit: r.unit,
    sampleCount: Number(r.sample_count),
    p25Rial: String(r.p25_rial),
    medianRial: String(r.median_rial),
    p75Rial: String(r.p75_rial),
    minRial: String(r.min_rial),
    maxRial: String(r.max_rial),
  }));
}

/** One experience row inside a (category, unit) group. */
export type RateRow = {
  experience: RateAggregate["experience"];
  sampleCount: number;
  p25Rial: string;
  medianRial: string;
  p75Rial: string;
  minRial: string;
  maxRial: string;
};

/** A (category, unit) group with one row per experience level. */
export type RateGroup = {
  categoryId: string;
  slug: string;
  unit: RateAggregate["unit"];
  rows: RateRow[];
};

const EXPERIENCE_ORDER: Record<RateAggregate["experience"], number> = {
  junior: 0,
  mid: 1,
  senior: 2,
};

/** Group flat aggregates into category → unit → experience rows. */
export function groupAggregates(
  aggregates: RateAggregate[],
  categories: RateCategory[],
): RateGroup[] {
  const byKey = new Map<string, RateGroup>();
  for (const a of aggregates) {
    const key = `${a.categoryId}|${a.unit}`;
    const group = byKey.get(key) ?? {
      categoryId: a.categoryId,
      slug: a.slug,
      unit: a.unit,
      rows: [],
    };
    group.rows.push({
      experience: a.experience,
      sampleCount: a.sampleCount,
      p25Rial: a.p25Rial,
      medianRial: a.medianRial,
      p75Rial: a.p75Rial,
      minRial: a.minRial,
      maxRial: a.maxRial,
    });
    byKey.set(key, group);
  }

  const order = new Map(categories.map((c, i) => [c.id, i]));
  return [...byKey.values()]
    .map((g) => ({
      ...g,
      rows: g.rows.sort(
        (x, y) => EXPERIENCE_ORDER[x.experience] - EXPERIENCE_ORDER[y.experience],
      ),
    }))
    .sort((a, b) => (order.get(a.categoryId) ?? 99) - (order.get(b.categoryId) ?? 99));
}

// ---------------------------------------------------------------------------
// Moderation (admins only)
//
// Raw submissions are readable by their submitter and by admins — never by the
// public. These run on the *user* client so RLS does the authorization: an
// editor who somehow reaches this code gets an empty list, not someone's data.
// Category names are resolved by the caller from getRateCategories() rather than
// an embedded join, which keeps the select string statically typed.
// ---------------------------------------------------------------------------

export type RateSubmissionRow = Tables<"rate_submissions">;

/** Queue of submissions awaiting review, oldest first. */
export async function getPendingSubmissions(limit = 100): Promise<RateSubmissionRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rate_submissions")
    .select(
      "id, category_id, experience, amount_rial, unit, city, is_anonymous, status, created_at, duration_bucket, complexity, deliverable_count, revision_count, turnaround, usage_rights, includes_motion, includes_color, includes_sound, submitted_by, reviewed_by, source_hash, reviewed_at",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}

/** Most recently reviewed submissions, so an admin can spot a mistaken call. */
export async function getReviewedSubmissions(limit = 20): Promise<RateSubmissionRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rate_submissions")
    .select(
      "id, category_id, experience, amount_rial, unit, city, is_anonymous, status, created_at, duration_bucket, complexity, deliverable_count, revision_count, turnaround, usage_rights, includes_motion, includes_color, includes_sound, submitted_by, reviewed_by, source_hash, reviewed_at",
    )
    .in("status", ["approved", "rejected"])
    .not("reviewed_at", "is", null)
    .order("reviewed_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** Size of the review queue. */
export async function countPendingSubmissions(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("rate_submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}
