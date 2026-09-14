import { env } from "@/lib/env";

/**
 * Supabase Storage helpers that are safe to use from BOTH server and client
 * code. (Kept separate from the server-only repository modules so that client
 * components don't pull `next/headers` into the browser bundle.)
 */

/** Build a public storage object URL (avatars/covers are in public buckets). */
export function storagePublicUrl(
  bucket: "avatars" | "covers",
  path: string | null,
): string | null {
  if (!path) return null;
  return `${env.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
