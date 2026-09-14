import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // 1. Refresh the Supabase session (may set cookies on the response).
  const { response: supabaseResponse } = await updateSession(request);

  // 2. Run locale detection + routing.
  const response = handleI18nRouting(request);

  // 3. Merge any refreshed session cookies onto the final response.
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  return response;
}

export const config = {
  // Skip non-page paths: API routes, the auth callback, Next internals, and
  // static files.
  matcher: "/((?!api|_next|_vercel|auth|.*\\..*).*)",
};
