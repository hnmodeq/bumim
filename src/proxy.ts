import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Locale detection + routing. Supabase session refresh will be composed into
// this middleware in Phase 4 (Authentication) via src/lib/supabase/middleware.ts.
export default createMiddleware(routing);

export const config = {
  // Skip non-page paths: API routes, Next internals, and static files.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
