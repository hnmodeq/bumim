/**
 * Centralized quote pricing service (Phase 8).
 *
 * THE ONLY PLACE PRICING LOGIC LIVES. UI components never contain rates or
 * multipliers — they call `calculateEstimate()` and render what comes back.
 *
 * Model (documented so a reviewer can audit every number on the page):
 *
 *   1. base        per-video starting point. Prefer the MARKET: the approved
 *                  rate-guide aggregate for (category, experience, primary
 *                  unit). Per-minute / per-second markets are converted to a
 *                  per-video base with the bucket's typical length; per-project
 *                  markets are adjusted by a duration factor instead. When the
 *                  market has too few samples the config fallback base is used
 *                  and the result is labelled "reference", never "market".
 *   2. range       the same pipeline run from the market p25/p75 gives the
 *                  low/high ratio around the recommended figure.
 *   3. factors     complexity, motion/colour/sound add-ons, turnaround, usage
 *                  rights and extra revision rounds are applied one at a time;
 *                  each step is rounded to a whole Rial immediately and shown
 *                  as its own breakdown line, so the lines sum EXACTLY to the
 *                  per-video figure (bigint from then on).
 *   4. volume      per-video price × video count, then a volume discount line.
 *                  The recommended total is the exact bigint sum of the lines.
 *
 * Money rules (architecture §12): canonical unit = Rial, integer only.
 * Fractional multipliers exist solely inside `scale()`, which rounds to a
 * whole Rial at once; every value that leaves this module is a bigint.
 */
import type {
  Complexity,
  DurationBucket,
  Experience,
  Turnaround,
  UsageRights,
} from "@/lib/validators/rate";

// ---------------------------------------------------------------------------
// Configuration — edit prices here and nowhere else
// ---------------------------------------------------------------------------

/** Typical finished length in minutes per duration bucket. */
export const BUCKET_MINUTES: Record<DurationBucket, number> = {
  under_1: 0.5,
  min_1_5: 3,
  min_5_15: 10,
  min_15_30: 22,
  min_30_60: 45,
  over_60: 90,
};

/** Which market unit a category's base price is taken from. */
export const PRIMARY_UNIT_BY_SLUG: Record<string, "project" | "minute" | "second"> = {
  editing: "minute",
  motion: "second",
  color: "project",
  subtitling: "minute",
  short_form: "project",
  youtube: "project",
  commercial: "project",
  wedding: "project",
  documentary: "project",
  vfx: "project",
};

/** Duration adjustment for per-PROJECT markets (relative to a typical job). */
export const DURATION_FACTORS: Record<DurationBucket, number> = {
  under_1: 0.8,
  min_1_5: 1,
  min_5_15: 1.6,
  min_15_30: 2.4,
  min_30_60: 3.6,
  over_60: 5,
};

export const COMPLEXITY_FACTORS: Record<Complexity, number> = {
  simple: 0.85,
  standard: 1,
  complex: 1.4,
};

/** Additive surcharges for included disciplines. */
export const ADDON_FACTORS = {
  motion: 0.25,
  color: 0.15,
  sound: 0.15,
} as const;

export const TURNAROUND_FACTORS: Record<Turnaround, number> = {
  flexible: 0.95,
  standard: 1,
  rush: 1.35,
};

export const USAGE_FACTORS: Record<UsageRights, number> = {
  none: 1,
  social: 1.1,
  paid_ads: 1.3,
  broadcast: 1.55,
};

/** Revision rounds included in the base price; each extra round costs +6%. */
export const INCLUDED_REVISIONS = 2;
export const EXTRA_REVISION_FACTOR = 0.06;

/** Per-video discount by volume band. */
export const VOLUME_BANDS: { min: number; max: number; factor: number }[] = [
  { min: 1, max: 1, factor: 1 },
  { min: 2, max: 3, factor: 0.95 },
  { min: 4, max: 9, factor: 0.9 },
  { min: 10, max: Number.MAX_SAFE_INTEGER, factor: 0.85 },
];

/**
 * Fallback per-video base in integer Rial when the market has no usable
 * sample for the group. Deliberately conservative middle-of-market figures.
 */
export const FALLBACK_BASE_RIAL: Record<string, bigint> = {
  short_form: 350_000_000n,
  youtube: 1_200_000_000n,
  commercial: 3_500_000_000n,
  wedding: 4_000_000_000n,
  documentary: 5_000_000_000n,
  motion: 2_500_000_000n,
  color: 900_000_000n,
  vfx: 3_000_000_000n,
  sound: 600_000_000n,
  editing: 900_000_000n,
  subtitling: 200_000_000n,
};

/** Spread used for the low/high range when there is no market p25/p75. */
export const FALLBACK_SPREAD = { low: 0.8, high: 1.3 } as const;

/** Below this many approved samples the market is not used as the base. */
export const MIN_SAMPLES_FOR_MARKET_BASE = 3;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Units whose market price already scales with length. */
export type PricingUnit = "project" | "hour" | "day" | "minute" | "second";
const LENGTH_UNITS: ReadonlySet<PricingUnit> = new Set(["hour", "day", "minute", "second"]);

/** One approved market group, as published by rate_guide_aggregates(). */
export type MarketAnchor = {
  unit: PricingUnit;
  p25Rial: bigint;
  medianRial: bigint;
  p75Rial: bigint;
  samples: number;
};

export type EstimateLineCode =
  | "base"
  | "duration"
  | "complexity"
  | "motion"
  | "color"
  | "sound"
  | "turnaround"
  | "usage"
  | "revisions"
  | "volume";

export type EstimateLine = {
  code: EstimateLineCode;
  /** Signed integer Rial. Discount lines are negative. */
  amountRial: bigint;
  /** Per-video lines: true; quote-level lines (volume): false. */
  perVideo: boolean;
};

export type EstimateFactor = {
  code: EstimateLineCode | "experience" | "videos";
  value: string;
};

export type QuoteCalcInput = {
  categorySlug: string;
  experience: Experience;
  videoCount: number;
  durationBucket: DurationBucket;
  complexity: Complexity;
  includesMotion: boolean;
  includesColor: boolean;
  includesSound: boolean;
  revisionRounds: number;
  turnaround: Turnaround;
  usageRights: UsageRights;
};

export type QuoteEstimate = {
  lines: EstimateLine[];
  factors: EstimateFactor[];
  perVideoRial: bigint;
  lowRial: bigint;
  recommendedRial: bigint;
  highRial: bigint;
  /** "market" = grounded in approved submissions; "reference" = config base. */
  source: "market" | "reference";
  samples: number;
  unit: PricingUnit;
};

// ---------------------------------------------------------------------------
// Calculation
// ---------------------------------------------------------------------------

/** Round a bigint amount by a fractional multiplier to a whole Rial. */
function scale(amount: bigint, multiplier: number): bigint {
  return BigInt(Math.round(Number(amount) * multiplier));
}

function volumeFactor(videos: number): number {
  const band = VOLUME_BANDS.find((b) => videos >= b.min && videos <= b.max);
  return band?.factor ?? 1;
}

/**
 * Base per-video figures (low/mid/high) from the market anchor or fallback.
 * Returns the three starting points plus how the length was accounted for.
 */
function basePerVideo(
  anchor: MarketAnchor | null,
  input: QuoteCalcInput,
): { low: bigint; mid: bigint; high: bigint; source: "market" | "reference" } {
  const minutes = BUCKET_MINUTES[input.durationBucket];

  if (anchor && anchor.samples >= MIN_SAMPLES_FOR_MARKET_BASE) {
    const convert = (perUnit: bigint): bigint => {
      if (anchor.unit === "minute") return scale(perUnit, minutes);
      if (anchor.unit === "second") return scale(perUnit, minutes * 60);
      if (anchor.unit === "hour") return scale(perUnit, minutes / 60);
      if (anchor.unit === "day") return scale(perUnit, minutes / 480);
      return scale(perUnit, DURATION_FACTORS[input.durationBucket]);
    };
    return {
      low: convert(anchor.p25Rial),
      mid: convert(anchor.medianRial),
      high: convert(anchor.p75Rial),
      source: "market",
    };
  }

  const fallback = FALLBACK_BASE_RIAL[input.categorySlug] ?? 1_000_000_000n;
  const mid = scale(fallback, DURATION_FACTORS[input.durationBucket]);
  return {
    low: scale(mid, FALLBACK_SPREAD.low),
    mid,
    high: scale(mid, FALLBACK_SPREAD.high),
    source: "reference",
  };
}

/**
 * The single entry point for pricing. Pure and deterministic: same input +
 * same anchor ⇒ same bigint output, on the server or in the browser.
 */
export function calculateEstimate(
  input: QuoteCalcInput,
  anchor: MarketAnchor | null,
): QuoteEstimate {
  const base = basePerVideo(anchor, input);
  const lines: EstimateLine[] = [];
  const factors: EstimateFactor[] = [];

  // -- per-video build-up, each step rounded and recorded -------------------
  let running = base.mid;
  lines.push({ code: "base", amountRial: running, perVideo: true });

  // length adjustment relative to the base (zero when the base already
  // includes the length, i.e. per-minute/per-second markets at their bucket).
  const durationDelta =
    base.source === "market" && anchor && LENGTH_UNITS.has(anchor.unit)
      ? 0n
      : scale(base.mid, DURATION_FACTORS[input.durationBucket] - 1);
  if (durationDelta !== 0n) {
    lines.push({ code: "duration", amountRial: durationDelta, perVideo: true });
    running += durationDelta;
  }

  const step = (
    code: EstimateLineCode,
    multiplier: number,
    factorValue?: string,
  ): void => {
    if (multiplier === 1) return;
    const delta = scale(running, multiplier - 1);
    if (delta === 0n) return;
    lines.push({ code, amountRial: delta, perVideo: true });
    running += delta;
    if (factorValue) factors.push({ code, value: factorValue });
  };

  step("complexity", COMPLEXITY_FACTORS[input.complexity], input.complexity);
  if (input.includesMotion) step("motion", 1 + ADDON_FACTORS.motion, "true");
  if (input.includesColor) step("color", 1 + ADDON_FACTORS.color, "true");
  if (input.includesSound) step("sound", 1 + ADDON_FACTORS.sound, "true");
  step("turnaround", TURNAROUND_FACTORS[input.turnaround], input.turnaround);
  step("usage", USAGE_FACTORS[input.usageRights], input.usageRights);

  const extraRevisions = Math.max(0, input.revisionRounds - INCLUDED_REVISIONS);
  if (extraRevisions > 0) {
    step("revisions", 1 + EXTRA_REVISION_FACTOR * extraRevisions, String(extraRevisions));
  }

  const perVideo = running;

  // -- quote level ----------------------------------------------------------
  const videos = Math.max(1, Math.round(input.videoCount));
  const subtotal = perVideo * BigInt(videos);
  const vFactor = volumeFactor(videos);
  let recommended = subtotal;
  if (vFactor !== 1) {
    const discount = scale(subtotal, vFactor - 1);
    lines.push({ code: "volume", amountRial: discount, perVideo: false });
    recommended = subtotal + discount;
  }

  // range from the market's own spread (or the fallback spread)
  const lowRatio = base.mid > 0n ? Number(base.low) / Number(base.mid) : FALLBACK_SPREAD.low;
  const highRatio = base.mid > 0n ? Number(base.high) / Number(base.mid) : FALLBACK_SPREAD.high;
  const low = scale(recommended, Math.min(lowRatio, 1));
  const high = scale(recommended, Math.max(highRatio, 1));

  factors.push({ code: "experience", value: input.experience });
  factors.push({ code: "videos", value: String(videos) });

  return {
    lines,
    factors,
    perVideoRial: perVideo,
    lowRial: low,
    recommendedRial: recommended,
    highRial: high,
    source: base.source,
    samples: anchor?.samples ?? 0,
    unit: anchor?.unit ?? "project",
  };
}

/**
 * Map an estimate's per-video lines onto quote line items, so "create quote
 * from estimate" produces a document that mirrors the breakdown. Zero lines
 * are dropped; the volume discount becomes a single negative item.
 */
export function estimateToQuoteItems(
  estimate: QuoteEstimate,
  videos: number,
  labelOf: (code: EstimateLineCode) => string,
): { description: string; quantity: number; unitRial: bigint }[] {
  const items: { description: string; quantity: number; unitRial: bigint }[] = [];
  for (const line of estimate.lines) {
    if (line.amountRial === 0n) continue;
    if (line.perVideo) {
      items.push({
        description: labelOf(line.code),
        quantity: videos,
        unitRial: line.amountRial,
      });
    } else {
      items.push({ description: labelOf(line.code), quantity: 1, unitRial: line.amountRial });
    }
  }
  return items;
}

/** Quote total = Σ (quantity × unit Rial), exact bigint arithmetic. */
export function quoteTotalRial(
  items: { quantity: number; unitRial: bigint }[],
): bigint {
  return items.reduce(
    (sum, item) => sum + BigInt(item.quantity) * item.unitRial,
    0n,
  );
}
