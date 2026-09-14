/**
 * Typed access to environment variables.
 *
 * Secrets (SUPABASE_SERVICE_ROLE_KEY, etc.) must NEVER be read in a file that
 * is reachable by client code. This module is imported by server-only modules
 * which are themselves guarded with `import "server-only"` where needed.
 */

function getEnv(name: string): string | undefined {
  return process.env[name];
}

/** Throw a clear error when a required variable is missing. */
export function requireEnv(name: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Copy .env.example to .env.local and fill in the value.`,
    );
  }
  return value;
}

export const env = {
  get siteUrl() {
    return getEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
  },
  get supabaseUrl() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  /** Server-only. Never expose this to the browser. */
  get supabaseServiceRoleKey() {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
};
