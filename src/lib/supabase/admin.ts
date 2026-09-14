import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Service-role Supabase client. BYPASSES Row Level Security.
 *
 * Use only on the server for:
 *  - seeding / migrations
 *  - admin & moderation actions
 *  - verification review
 *  - background jobs
 *
 * `import "server-only"` guarantees this module can never be bundled into
 * client code. The service-role key is a server-side secret.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
