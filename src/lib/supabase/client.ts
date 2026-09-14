import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Browser Supabase client — used only in Client Components for interactivity
 * (auth state, realtime subscriptions, optimistic reads). Subject to RLS.
 * Never use this for privileged operations.
 *
 * `isSingleton: true` so every import shares one client instance (and one
 * auth listener), keeping subscriptions consistent across components.
 */
export function createClient() {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    isSingleton: true,
  });
}
