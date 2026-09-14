import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Browser Supabase client — used only in Client Components for interactivity
 * (realtime subscriptions, optimistic reads). Subject to Row Level Security.
 * Never use this for privileged operations.
 */
export function createClient() {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
