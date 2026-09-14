/**
 * Typed access to environment variables.
 *
 * IMPORTANT: `NEXT_PUBLIC_*` variables must be read via STATIC property access
 * (e.g. `process.env.NEXT_PUBLIC_SUPABASE_URL`) so Next.js inlines them into
 * the client bundle at build time. Dynamic access (`process.env[name]`) is
 * never inlined and would be `undefined` in the browser.
 *
 * Secrets (SUPABASE_SERVICE_ROLE_KEY) must NEVER be read in a file reachable
 * by client code. The server-only modules that use it are guarded with
 * `import "server-only"`.
 */

function missing(name: string): string {
  throw new Error(
    `Missing required environment variable "${name}". ` +
      `Copy .env.example to .env.local and fill in the value.`,
  );
}

export const env = {
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
  get supabaseUrl() {
    return (
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      missing("NEXT_PUBLIC_SUPABASE_URL")
    );
  },
  get supabaseAnonKey() {
    return (
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      missing("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    );
  },
  /** Server-only. Never expose this to the browser. */
  get supabaseServiceRoleKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ?? missing("SUPABASE_SERVICE_ROLE_KEY");
  },
};
