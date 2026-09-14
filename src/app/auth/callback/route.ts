import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { defaultLocale, type AppLocale } from "@/i18n/routing";

/**
 * Auth callback: target of the confirmation / recovery links emailed by
 * Supabase. Exchanges the one-time code for a session, then redirects to the
 * localized page carried in the `next` query param.
 *
 * Kept OUTSIDE `[locale]` (and excluded from the i18n middleware) so the link
 * is a single stable URL: `${siteUrl}/auth/callback?code=…&next=/dashboard&locale=fa`.
 */

/** Build a localized path for the given locale (`fa` is unprefixed, `en` is `/en`). */
function localizedPath(href: string, locale: string): string {
  const clean = href.startsWith("/") ? href : `/${href}`;
  const path = clean === "/" ? "" : clean;
  return locale === defaultLocale ? (path || "/") : `/${locale}${path || ""}`;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";
  const locale = (searchParams.get("locale") ?? defaultLocale) as AppLocale;

  const supabase = await createClient();

  // Modern PKCE flow: a single-use `code`.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(localizedPath(next, locale), origin));
    }
  }

  // Legacy implicit flow: `token_hash` + `type` (signup/recovery/invite).
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "signup" | "recovery" | "email" | "invite",
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(localizedPath(next, locale), origin));
    }
  }

  // Exchange failed (expired / already used / missing) → back to login with
  // an error key the login page surfaces.
  const errorPath = localizedPath("/login", locale);
  return NextResponse.redirect(
    new URL(`${errorPath}?error=verificationExpired`, origin),
  );
}
