import { env } from "@/lib/env";

/**
 * Supabase Storage helpers that are safe to use from BOTH server and client
 * code. (Kept separate from the server-only repository modules so that client
 * components don't pull `next/headers` into the browser bundle.)
 */

/** The public Supabase Storage buckets used for user imagery. */
export type StorageBucket = "avatars" | "covers" | "portfolio";

/** Build a public storage object URL (all three buckets are public). */
export function storagePublicUrl(
  bucket: StorageBucket,
  path: string | null,
): string | null {
  if (!path) return null;
  return `${env.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
