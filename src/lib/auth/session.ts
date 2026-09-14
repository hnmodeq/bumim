import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { Tables } from "@/types/database.types";

/** Locale-aware redirect helper (narrows correctly via next/navigation). */
function redirectLocalized(href: string, locale: string): never {
  redirect(getPathname({ href, locale: locale as AppLocale }));
}

/**
 * Server-side session helpers and route guards.
 *
 * Guards run in layouts (server components), never client-side — client checks
 * are UX only, the real authorization boundary is here + Supabase RLS.
 */

type Profile = Tables<"profiles">;

/** The authenticated user, or null. Memoized per request. */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
});

/** The authenticated user's profile row, or null. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data ?? null;
});

/** Require a logged-in user; otherwise redirect to login. */
export async function requireUser(locale: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirectLocalized("/login", locale);
  }
  return user;
}

/** Require a logged-in admin; redirect to login or dashboard otherwise. */
export async function requireAdmin(locale: string): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirectLocalized("/login", locale);
  }
  if (profile.role !== "admin") {
    redirectLocalized("/dashboard", locale);
  }
  return profile;
}
