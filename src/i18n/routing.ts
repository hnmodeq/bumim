import { defineRouting } from "next-intl/routing";

export const locales = ["fa", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "fa";

export const routing = defineRouting({
  // Persian is the primary/default locale (no URL prefix), English is opt-in (/en).
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});
