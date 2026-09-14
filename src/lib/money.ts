import { z } from "zod";

/**
 * Centralized money representation.
 *
 * Rules (see docs/ARCHITECTURE.md §12):
 *  - NEVER use floating-point numbers for monetary amounts.
 *  - Canonical unit is the Rial (IRR), the smallest official unit.
 *  - 1 Toman = 10 Rial. Iranian professionals quote in Toman.
 *  - All arithmetic uses bigint. The type is serialized as a STRING across
 *    JSON/API boundaries to avoid JavaScript number precision loss.
 */

export type Money = {
  readonly __brand: "Money";
  readonly rial: string; // canonical integer Rial, as a decimal string
};

/** Build a Money from an integer Rial amount (number | bigint | string). */
export function rial(amount: bigint | number | string): Money {
  return { __brand: "Money", rial: BigInt(amount).toString() };
}

/** Build a Money from an integer Toman amount. */
export function tomanToRial(amount: bigint | number | string): Money {
  return rial(BigInt(amount) * 10n);
}

/** Rial amount as bigint. */
export function rialAmount(m: Money): bigint {
  return BigInt(m.rial);
}

/** Toman amount as bigint (floors any Rial remainder). */
export function tomanAmount(m: Money): bigint {
  return BigInt(m.rial) / 10n;
}

/** Add two Money values. */
export function addMoney(a: Money, b: Money): Money {
  return rial(rialAmount(a) + rialAmount(b));
}

/** Multiply a Money by an integer factor (never a fractional multiplier). */
export function multiplyMoney(m: Money, factor: bigint | number): Money {
  return rial(rialAmount(m) * BigInt(factor));
}

export type MoneyFormatOptions = {
  locale?: "fa" | "en";
  unit?: "toman" | "rial";
  digits?: "fa" | "en";
};

/**
 * Format a Money for display. Defaults to Toman with Persian digit grouping.
 * Display only — never use the formatted string for arithmetic.
 */
export function formatMoney(m: Money, opts: MoneyFormatOptions = {}): string {
  const { unit = "toman", locale = "fa", digits = "fa" } = opts;
  const amount = unit === "rial" ? rialAmount(m) : tomanAmount(m);

  // Conversion to number is display-only and safe for realistic amounts.
  const formatted = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Number(amount));

  if (digits === "en") {
    return formatted.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  }
  return formatted;
}

/** Zod schema for a Money value: an integer Rial string. */
export const moneySchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "مبلغ باید عدد صحیح باشد")
  .transform((s) => rial(s));

/** Zod schema for a Toman amount input (converted to Rial Money). */
export const tomanSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "مبلغ باید عدد صحیح باشد")
  .transform((s) => tomanToRial(s));
