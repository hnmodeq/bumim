import { z } from "zod";
import type { ProfileTranslator } from "@/lib/validators/profile";

/**
 * Rate Guide submission validation. Used client-side (UX) and re-validated
 * server-side (the real boundary). Amounts are entered in Toman and converted
 * to integer Rial in the server action (money is never a float).
 */

export const EXPERIENCES = ["junior", "mid", "senior"] as const;
export type Experience = (typeof EXPERIENCES)[number];

export const RATE_UNITS = ["project", "hour", "day", "minute", "second"] as const;
export type RateUnit = (typeof RATE_UNITS)[number];

/**
 * Upper bound in Toman. The DB CHECK is `amount_rial < 1e15` (strict) and the
 * action stores amount_rial = toman * 10, so the largest acceptable Toman value
 * is 1e14 - 1. Allowing exactly 1e14 passed validation but was rejected by the
 * CHECK constraint, surfacing as a generic "updateFailed" instead of a clear
 * "amount too large" message.
 */
export const MAX_TOMAN = 99_999_999_999_999n;

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
    /** Honeypot: must stay empty. Bots fill it; humans never see it. */
    website: z.string().max(0, t("spamDetected")).default(""),
  });

export type RateSubmissionInput = z.input<ReturnType<typeof rateSubmissionSchema>>;
export type RateSubmissionOutput = z.output<ReturnType<typeof rateSubmissionSchema>>;
