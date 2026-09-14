import { z } from "zod";

/**
 * Authentication validation schemas (Zod).
 *
 * Each schema is a factory that takes a translator `t(key) => message` so
 * messages are localized (Persian-first). The same schemas are used in:
 *
 *  1. Client forms (react-hook-form + zodResolver) — UX validation.
 *  2. Server Actions — authoritative, security-boundary validation.
 */

export type AuthTranslator = (key: string) => string;

/** Email: trimmed, lowercased, and validated as an email address. */
const emailField = (t: AuthTranslator) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(1, t("emailRequired"))
    .email(t("emailInvalid"));

/** Password: min 8 chars, must contain at least one letter and one number. */
const passwordField = (t: AuthTranslator) =>
  z
    .string()
    .min(8, t("passwordMinLength"))
    .max(72, t("passwordMaxLength"))
    .refine((p) => /[A-Za-z]/.test(p) && /\d/.test(p), t("passwordWeak"));

export const loginSchema = (t: AuthTranslator) =>
  z.object({
    email: emailField(t),
    password: z.string().min(1, t("passwordRequired")),
  });

export const registerSchema = (t: AuthTranslator) =>
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
    email: emailField(t),
    password: passwordField(t),
  });

export const forgotPasswordSchema = (t: AuthTranslator) =>
  z.object({ email: emailField(t) });

export const resetPasswordSchema = (t: AuthTranslator) =>
  z
    .object({
      password: passwordField(t),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    });
