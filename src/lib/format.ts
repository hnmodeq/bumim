/**
 * Locale-aware display formatting for non-monetary numbers.
 *
 * Persian (fa) renders Arabic-Indic digits everywhere else in the product —
 * including money via `formatMoney` in lib/money.ts — so plain counts must be
 * formatted the same way or a single table row ends up mixing numeral systems
 * (e.g. "۱٬۰۰۰٬۰۰۰ تومان" next to a Latin "3"). Display only.
 */

const NUMBER_LOCALES = { fa: "fa-IR", en: "en-US" } as const;

/** Format an integer count with locale-appropriate digits and grouping. */
export function formatCount(value: number, locale: "fa" | "en"): string {
  return new Intl.NumberFormat(NUMBER_LOCALES[locale], {
    maximumFractionDigits: 0,
  }).format(value);
}
