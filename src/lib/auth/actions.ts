"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { authErrorKey, type AuthErrorKey } from "@/lib/auth/errors";

/**
 * Server Actions for authentication. These are the authoritative security
 * boundary: inputs are re-validated with Zod here regardless of client-side
 * validation. Credentials never touch the client beyond the form fields, and
 * the service-role key is never exposed to the browser.
 */

export type ActionResult =
  | { ok: true; requiresConfirmation?: boolean }
  | { ok: false; error: AuthErrorKey };

const noop = (key: string) => key;

/** Build the email-redirect URL used for confirmation / recovery links. */
function emailRedirectUrl(next: string, locale: string): string {
  const base = env.siteUrl.replace(/\/$/, "");
  return `${base}/auth/callback?next=${encodeURIComponent(next)}&locale=${encodeURIComponent(locale)}`;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  const parsed = loginSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { ok: false, error: authErrorKey(error) };

  return { ok: true };
}

export async function register(input: {
  displayName: string;
  username: string;
  email: string;
  password: string;
  locale: string;
}): Promise<ActionResult> {
  const parsed = registerSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  // Check username availability up front (the profiles.username unique
  // constraint is the real backstop, but this gives a clear error).
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("username", parsed.data.username)
    .maybeSingle();
  if (existing) return { ok: false, error: "usernameTaken" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        username: parsed.data.username,
        display_name: parsed.data.displayName,
        role: "editor",
        locale: input.locale,
      },
      emailRedirectTo: emailRedirectUrl("/dashboard", input.locale),
    },
  });
  if (error) return { ok: false, error: authErrorKey(error) };

  // No session means email confirmation is required before sign-in.
  return { ok: true, requiresConfirmation: !data.session };
}

export async function forgotPassword(input: {
  email: string;
  locale: string;
}): Promise<ActionResult> {
  const parsed = forgotPasswordSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: emailRedirectUrl("/reset-password", input.locale),
  });

  // Do not reveal whether the email exists — always look successful. Only
  // surface a rate-limit (the user can retry later).
  if (error) {
    const key = authErrorKey(error);
    if (key === "rateLimited") return { ok: false, error: key };
  }
  return { ok: true };
}

export async function resetPassword(input: {
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const parsed = resetPasswordSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { ok: false, error: authErrorKey(error) };

  return { ok: true };
}
