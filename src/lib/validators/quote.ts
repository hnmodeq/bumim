import { z } from "zod";
import {
  COMPLEXITY_LEVELS,
  DURATION_BUCKETS,
  EXPERIENCES,
  TURNAROUNDS,
  USAGE_RIGHTS,
} from "@/lib/validators/rate";

/** Translator shape injected by callers (see validators/rate.ts). */
export type QuoteTranslator = (key: string) => string;

export const CALC_MAX_VIDEOS = 50;
export const CALC_MAX_REVISION_ROUNDS = 20;
/** |unit price| ceiling in Toman; mirrors the ±1e14 Rial CHECK in 0014. */
export const MAX_UNIT_TOMAN = 10_000_000_000_000n;

const dateStr = (t: QuoteTranslator) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), t("dateInvalid"))
    .refine((v) => v === "" || !Number.isNaN(new Date(v).getTime()), t("dateInvalid"))
    .optional();

/** Calculator inputs (client + server re-validation). */
export const quoteCalcSchema = (t: QuoteTranslator) =>
  z.object({
    categoryId: z.string().uuid(t("categoryRequired")),
    experience: z.enum(EXPERIENCES),
    videoCount: z.coerce
      .number()
      .int(t("videosRange"))
      .min(1, t("videosRange"))
      .max(CALC_MAX_VIDEOS, t("videosRange")),
    durationBucket: z.enum(DURATION_BUCKETS),
    complexity: z.enum(COMPLEXITY_LEVELS),
    includesMotion: z.boolean().default(false),
    includesColor: z.boolean().default(false),
    includesSound: z.boolean().default(false),
    revisionRounds: z.coerce
      .number()
      .int(t("revisionsRange"))
      .min(0, t("revisionsRange"))
      .max(CALC_MAX_REVISION_ROUNDS, t("revisionsRange")),
    turnaround: z.enum(TURNAROUNDS),
    usageRights: z.enum(USAGE_RIGHTS),
  });

export type QuoteCalcForm = z.input<ReturnType<typeof quoteCalcSchema>>;

/** One line item as it arrives from the form: unit price typed in TOMAN. */
const quoteItemSchema = (t: QuoteTranslator) =>
  z.object({
    description: z
      .string()
      .trim()
      .min(1, t("itemDescriptionRequired"))
      .max(300, t("itemDescriptionLong")),
    quantity: z.coerce
      .number()
      .int(t("itemQuantityRange"))
      .min(1, t("itemQuantityRange"))
      .max(10000, t("itemQuantityRange")),
    /** integer Toman, signed (discount lines); converted to Rial ×10. */
    unitToman: z
      .string()
      .trim()
      .regex(/^-?\d+$/, t("itemPriceInvalid"))
      .refine((v) => {
        // zod runs refinements even after the regex check failed; never call
        // BigInt() on a value the regex rejected (it would throw and take the
        // whole resolver down with it — same guard as in validators/rate.ts).
        if (!/^-?\d+$/.test(v)) return true;
        const n = BigInt(v);
        return n <= MAX_UNIT_TOMAN && n >= -MAX_UNIT_TOMAN;
      }, t("itemPriceTooLarge")),
  });

export const quoteFormSchema = (t: QuoteTranslator) =>
  z.object({
    id: z.string().uuid().optional(),
    clientName: z
      .string()
      .trim()
      .min(1, t("clientRequired"))
      .max(120, t("clientTooLong")),
    clientCompany: z.string().trim().max(120, t("companyTooLong")).optional(),
    projectTitle: z
      .string()
      .trim()
      .min(1, t("projectRequired"))
      .max(160, t("projectTooLong")),
    deliverables: z.string().trim().max(2000, t("textTooLong")).optional(),
    revisionsIncluded: z.coerce
      .number()
      .int(t("revisionsRange"))
      .min(0, t("revisionsRange"))
      .max(50, t("revisionsRange")),
    deadline: dateStr(t),
    expiresAt: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("dateInvalid"))
      .refine((v) => !Number.isNaN(new Date(v).getTime()), t("dateInvalid")),
    terms: z.string().trim().max(4000, t("textTooLong")).optional(),
    notes: z.string().trim().max(4000, t("textTooLong")).optional(),
    items: z.array(quoteItemSchema(t)).min(1, t("itemsRequired")).max(40, t("itemsTooMany")),
  });

export type QuoteFormInput = z.input<ReturnType<typeof quoteFormSchema>>;
export type QuoteFormOutput = z.output<ReturnType<typeof quoteFormSchema>>;
