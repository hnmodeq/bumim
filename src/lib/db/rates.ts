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
  }));
}

/** One experience row inside a (category, unit) group. */
export type RateRow = {
  experience: RateAggregate["experience"];
  sampleCount: number;
  p25Rial: string;
  medianRial: string;
  p75Rial: string;
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
