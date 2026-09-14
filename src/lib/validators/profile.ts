import { z } from "zod";

/**
 * Profile validation schemas (Zod). Factories take a translator for
 * localized messages, matching the auth validators. Used client-side (UX) and
 * re-validated server-side (security boundary).
 */

export type ProfileTranslator = (key: string) => string;

export const AVAILABILITY = ["available", "limited", "booked"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export const SERVICE_CATEGORIES = [
  "editing",
  "color",
  "motion",
  "audio",
  "vfx",
  "post",
  "production",
] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const RATE_UNITS = ["project", "hour", "day", "minute", "second"] as const;
export type RateUnit = (typeof RATE_UNITS)[number];

/** An optional free-text field (empty string is normalized to undefined). */
const text = (t: ProfileTranslator, key: string) =>
  z.string().trim().max(120, t(key)).optional().or(z.literal(""));

/** A free-form tag list field (languages / industries / project types). */
function tagList(t: ProfileTranslator, max = 20) {
  return z
    .array(z.string().trim().min(1).max(40))
    .max(max, t("tooManyTags"))
    .default([]);
}

export const basicsSchema = (t: ProfileTranslator) =>
  z.object({
    displayName: z
      .string()
      .trim()
      .min(2, t("displayNameMinLength"))
      .max(80, t("displayNameMaxLength")),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, t("usernameMinLength"))
      .max(30, t("usernameMaxLength"))
      .regex(/^[a-z0-9._-]+$/, t("usernameInvalid")),
    headline: text(t, "headlineMaxLength"),
    bio: z.string().trim().max(1000, t("bioMaxLength")).optional().or(z.literal("")),
    location: text(t, "locationMaxLength"),
    city: text(t, "cityMaxLength"),
    yearsExperience: z
      .number()
      .int(t("yearsInvalid"))
      .min(0, t("yearsInvalid"))
      .max(60, t("yearsInvalid"))
      .nullable()
      .optional(),
    availability: z.enum(AVAILABILITY).default("available"),
    languages: tagList(t),
    industries: tagList(t),
    preferredProjectTypes: tagList(t),
    isPublic: z.boolean().default(true),
  });

export type BasicsInput = z.input<ReturnType<typeof basicsSchema>>;
export type BasicsOutput = z.output<ReturnType<typeof basicsSchema>>;

export const serviceSchema = (t: ProfileTranslator) =>
  z.object({
    category: z.enum(SERVICE_CATEGORIES, { message: t("categoryRequired") }),
    title: z.string().trim().min(2, t("titleRequired")).max(120, t("titleMaxLength")),
    description: z.string().trim().max(500, t("descriptionMaxLength")).optional().or(z.literal("")),
    // Rate entered in Toman as an integer string. Converted to integer Rial on
    // the server (in the action) — money is never a float.
    rate: z.string().trim().regex(/^\d+$/, t("rateInvalid")),
    rateUnit: z.enum(RATE_UNITS).default("project"),
  });

export type ServiceInput = z.input<ReturnType<typeof serviceSchema>>;
export type ServiceOutput = z.output<ReturnType<typeof serviceSchema>>;
