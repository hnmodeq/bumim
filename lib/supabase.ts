import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Admin (service-role) Supabase client used for Storage uploads from the admin panel.
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!adminClient) adminClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return adminClient;
}

export interface UploadedFile {
  url: string;
  path: string;
}

/**
 * Upload a file buffer to the configured Supabase bucket.
 * Returns a public URL you can store on a Project (src / poster).
 */
export async function uploadToBucket(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<UploadedFile> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "bumim-media";

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType, upsert: true });

  if (error || !data) {
    throw new Error(error?.message || "Upload failed.");
  }

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: publicData.publicUrl, path: data.path };
}
