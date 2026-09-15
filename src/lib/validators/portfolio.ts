import { z } from "zod";
import type { ProfileTranslator } from "@/lib/validators/profile";

/**
 * Portfolio project validation (Zod). Factories take a translator for
 * localized messages, matching the other profile validators. Used client-side
 * (UX) and re-validated server-side (security boundary).
 */

export const PROJECT_CATEGORIES = [
  "short_film",
  "feature",
  "documentary",
  "commercial",
  "music_video",
  "motion",
  "color",
  "social",
  "corporate",
  "other",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ["draft", "published", "private"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

const UUID = z.string().uuid();

/** True when the trimmed value is an http(s) URL with a host. */
function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return (u.protocol === "https:" || u.protocol === "http:") && Boolean(u.hostname);
  } catch {
    return false;
  }
}

/** Optional URL field: empty → undefined; else must be a valid http(s) URL. */
function urlField(t: ProfileTranslator, key = "urlInvalid") {
  return z
    .string()
    .trim()
    .max(2000, t("urlTooLong"))
    .refine((v) => v === "" || isHttpUrl(v), t(key))
    .transform((v) => (v === "" ? undefined : v))
    .optional();
}

/** Optional free-text field (empty string normalized to undefined). */
const text = (t: ProfileTranslator, key: string, max = 120) =>
  z
    .string()
    .trim()
    .max(max, t(key))
    .transform((v) => (v === "" ? undefined : v))
    .optional();

/** Optional ISO date field (`YYYY-MM-DD`). */
function dateField(t: ProfileTranslator) {
  return z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), t("dateInvalid"))
    .transform((v) => (v === "" ? undefined : v))
    .optional();
}

export const projectSchema = (t: ProfileTranslator) =>
  z.object({
    title: z.string().trim().min(2, t("titleRequired")).max(120, t("titleMaxLength")),
    description: text(t, "descriptionMaxLength", 2000),
    role: text(t, "roleMaxLength"),
    client: text(t, "clientMaxLength"),
    category: z
      .enum(PROJECT_CATEGORIES)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    projectDate: dateField(t),
    externalUrl: urlField(t),
    videoUrl: urlField(t, "videoUrlInvalid"),
    isPublished: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    services: z.array(UUID).max(20, t("tooManyTags")).default([]),
    software: z.array(UUID).max(20, t("tooManyTags")).default([]),
  });

export type ProjectInput = z.input<ReturnType<typeof projectSchema>>;
export type ProjectOutput = z.output<ReturnType<typeof projectSchema>>;
