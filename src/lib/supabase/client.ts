import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Browser Supabase client — used only in Client Components for interactivity
 * (realtime subscriptions, optimistic reads). Subject to Row Level Security.
 * Never use this for privileged operations.
 */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
