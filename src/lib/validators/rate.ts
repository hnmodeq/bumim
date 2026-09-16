import { z } from "zod";
import type { ProfileTranslator } from "@/lib/validators/profile";

/**
 * Rate Guide submission validation. Used client-side (UX) and re-validated
 * server-side (the real boundary). Amounts are entered in Toman and converted
 * to integer Rial in the server action (money is never a float).
 *
 * The project characteristics are all OPTIONAL on purpose: this is crowd-sourced
 * market data, and requiring ten fields per submission would collapse the sample
 * size that makes the guide useful. They are stored as coarse buckets rather than
 * exact numbers — in a small market "a 47-minute documentary, 4 revisions, rush"
 * is a fingerprint, and a bucket is all the aggregate display needs anyway.
 */

export const EXPERIENCES = ["junior", "mid", "senior"] as const;
export type Experience = (typeof EXPERIENCES)[number];

export const RATE_UNITS = ["project", "hour", "day", "minute", "second"] as const;
export type RateUnit = (typeof RATE_UNITS)[number];

/** Finished-video length bands (minutes). */
export const DURATION_BUCKETS = [
  "under_1",
  "min_1_5",
  "min_5_15",
  "min_15_30",
  "min_30_60",
  "over_60",
] as const;
export type DurationBucket = (typeof DURATION_BUCKETS)[number];

export const COMPLEXITY_LEVELS = ["simple", "standard", "complex"] as const;
export type Complexity = (typeof COMPLEXITY_LEVELS)[number];

export const TURNAROUNDS = ["flexible", "standard", "rush"] as const;
export type Turnaround = (typeof TURNAROUNDS)[number];

/** Commercial usage rights granted with the delivery. */
export const USAGE_RIGHTS = ["none", "social", "paid_ads", "broadcast"] as const;
export type UsageRights = (typeof USAGE_RIGHTS)[number];

export const MIN_DELIVERABLES = 1;
export const MAX_DELIVERABLES = 99;
export const MIN_REVISIONS = 0;
export const MAX_REVISIONS = 50;

/**
 * Upper bound in Toman. The DB CHECK is `amount_rial < 1e15` (strict) and the
 * action stores amount_rial = toman * 10, so the largest acceptable Toman value
 * is 1e14 - 1. Allowing exactly 1e14 passed validation but was rejected by the
 * CHECK constraint, surfacing as a generic "updateFailed" instead of a clear
 * "amount too large" message.
 */
export const MAX_TOMAN = 99_999_999_999_999n;

/** An unset Select posts "" — normalize it to `undefined` before the enum. */
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.enum(values).optional(),
  );

/**
 * Optional whole-number input with bounds. Deliberately NOT transformed to a
 * number: the server action re-validates the same payload the client produced,
 * and a transform would make the resolver output (number) unassignable to the
 * action's input type (string). The action converts after validation.
 */
const optionalInt = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (/^\d+$/.test(v) && Number(v) >= min && Number(v) <= max),
      message,
    )
    .optional();

export const rateSubmissionSchema = (t: ProfileTranslator) =>
  z.object({
    categoryId: z.string().uuid(t("categoryRequired")),
    experience: z.enum(EXPERIENCES),
    unit: z.enum(RATE_UNITS),
    amount: z
      .string()
      .trim()
      .regex(/^\d+$/, t("amountInvalid"))
      // Guarded: refinements still run when the regex above fails, so never
      // call BigInt() on a value the regex rejected (it would throw).
      .refine((v) => !/^\d+$/.test(v) || BigInt(v) > 0n, t("amountInvalid"))
      .refine((v) => !/^\d+$/.test(v) || BigInt(v) <= MAX_TOMAN, t("amountTooLarge")),
    city: z
      .string()
      .trim()
      .max(60, t("cityTooLong"))
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
    isAnonymous: z.boolean().default(true),

    // ---- optional project characteristics ----
    durationBucket: optionalEnum(DURATION_BUCKETS),
    complexity: optionalEnum(COMPLEXITY_LEVELS),
    turnaround: optionalEnum(TURNAROUNDS),
    usageRights: optionalEnum(USAGE_RIGHTS),
    deliverables: optionalInt(MIN_DELIVERABLES, MAX_DELIVERABLES, t("deliverablesRange")),
    revisions: optionalInt(MIN_REVISIONS, MAX_REVISIONS, t("revisionsRange")),
    includesMotion: z.boolean().default(false),
    includesColor: z.boolean().default(false),
    includesSound: z.boolean().default(false),

    /** Honeypot: must stay empty. Bots fill it; humans never see it. */
    website: z.string().max(0, t("spamDetected")).default(""),
  });

export type RateSubmissionInput = z.input<ReturnType<typeof rateSubmissionSchema>>;
export type RateSubmissionOutput = z.output<ReturnType<typeof rateSubmissionSchema>>;

/**
 * Minimum approved samples before a median is published. Below this the page
 * shows the observed range and "not enough data yet" instead: a median of one
 * or two submissions looks like a market price but is really one person's quote.
 */
export const MIN_SAMPLES_FOR_MEDIAN = 3;
