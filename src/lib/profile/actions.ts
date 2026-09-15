"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getOwnProfile } from "@/lib/db/profiles";
import { basicsSchema, serviceSchema } from "@/lib/validators/profile";
import type { BasicsInput, ServiceInput } from "@/lib/validators/profile";
import { storagePublicUrl } from "@/lib/storage";

/**
 * Profile server actions. Authoritative security boundary: every input is
 * re-validated with Zod here, and all writes run through the user-session
 * Supabase client so Supabase RLS is the final arbiter of ownership
 * ("users can only edit their own profile").
 */

export type ProfileActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string }; // i18n key under `profile.errors.*`

const noop = (key: string) => key;

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const MAX_COVER_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type EditorContext = {
  userId: string;
  profileId: string;
  editorId: string | null;
};

export async function getContext(): Promise<
  { ok: true; ctx: EditorContext } | { ok: false; error: string }
> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "sessionExpired" };

  const own = await getOwnProfile(user.id);
  if (!own) return { ok: false, error: "sessionExpired" };

  return {
    ok: true,
    ctx: {
      userId: user.id,
      profileId: own.profile.id,
      editorId: own.editor?.id ?? null,
    },
  };
}

export async function requireEditor(
  ctx: EditorContext,
): Promise<{ ok: true; editorId: string } | { ok: false; error: string }> {
  if (!ctx.editorId) return { ok: false, error: "notEditor" };
  return { ok: true, editorId: ctx.editorId };
}

/** Update the basic identity + editor fields in one action. */
export async function updateBasics(
  input: BasicsInput,
): Promise<ProfileActionResult> {
  const parsed = basicsSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { userId, editorId } = ctx.ctx;
  const values = parsed.data;

  const supabase = await createClient();

  // Username uniqueness (only when it changed) — the unique constraint is the
  // real backstop; this gives a clear, localized error instead.
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", values.username)
    .neq("id", userId)
    .maybeSingle();
  if (existing) return { ok: false, error: "usernameTaken" };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: values.displayName,
      username: values.username,
      bio: values.bio || null,
      is_public: values.isPublic,
    })
    .eq("id", userId);

  if (profileError) return { ok: false, error: "updateFailed" };

  if (editorId) {
    const { error: editorError } = await supabase
      .from("editor_profiles")
      .update({
        headline: values.headline || null,
        years_experience: values.yearsExperience ?? null,
        location: values.location || null,
        city: values.city || null,
        availability: values.availability,
        languages: values.languages,
        industries: values.industries,
        preferred_project_types: values.preferredProjectTypes,
      })
      .eq("id", editorId);

    if (editorError) return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Replace the editor's skill selections. */
export async function updateSkills(
  skillIds: string[],
): Promise<ProfileActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();

  // Keep only ids that actually exist in the catalog (prevents FK violations).
  const { data: valid } = await supabase
    .from("skills")
    .select("id")
    .in("id", skillIds);

  const validIds = (valid ?? []).map((s) => s.id);

  const { error: delError } = await supabase
    .from("editor_skills")
    .delete()
    .eq("editor_id", editor.editorId);
  if (delError) return { ok: false, error: "updateFailed" };

  if (validIds.length > 0) {
    const { error: insError } = await supabase
      .from("editor_skills")
      .insert(validIds.map((skillId) => ({ editor_id: editor.editorId, skill_id: skillId })));
    if (insError) return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Replace the editor's software selections. */
export async function updateSoftware(
  softwareIds: string[],
): Promise<ProfileActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();

  const { data: valid } = await supabase
    .from("software")
    .select("id")
    .in("id", softwareIds);
  const validIds = (valid ?? []).map((s) => s.id);

  const { error: delError } = await supabase
    .from("editor_software")
    .delete()
    .eq("editor_id", editor.editorId);
  if (delError) return { ok: false, error: "updateFailed" };

  if (validIds.length > 0) {
    const { error: insError } = await supabase
      .from("editor_software")
      .insert(validIds.map((softwareId) => ({ editor_id: editor.editorId, software_id: softwareId })));
    if (insError) return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Create or update a service. */
export async function upsertService(
  input: ServiceInput,
  serviceId?: string,
): Promise<ProfileActionResult> {
  const parsed = serviceSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();
  const values = parsed.data;

  // Convert the integer Toman string to integer Rial (1 Toman = 10 Rial).
  const rateRial = BigInt(values.rate) * 10n;
  if (rateRial > BigInt(Number.MAX_SAFE_INTEGER)) {
    return { ok: false, error: "invalidInput" };
  }

  const payload = {
    editor_id: editor.editorId,
    category: values.category,
    title: values.title,
    description: values.description || null,
    rate_rial: Number(rateRial),
    rate_unit: values.rateUnit,
    is_active: true,
  };

  if (serviceId) {
    // Ownership is enforced by RLS (`services_owner_write`), but double-check
    // the row exists for this editor to return a clean error.
    const { data: owned } = await supabase
      .from("services")
      .select("id")
      .eq("id", serviceId)
      .eq("editor_id", editor.editorId)
      .maybeSingle();
    if (!owned) return { ok: false, error: "notFound" };

    const { error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", serviceId);
    if (error) return { ok: false, error: "updateFailed" };
  } else {
    const { error } = await supabase.from("services").insert(payload);
    if (error) return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Delete a service (owned by the current editor). */
export async function deleteService(
  serviceId: string,
): Promise<ProfileActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId)
    .eq("editor_id", editor.editorId);
  if (error) return { ok: false, error: "updateFailed" };

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Shared image-upload helper (avatar + cover). */
async function uploadImage(
  formData: FormData,
  bucket: "avatars" | "covers",
  maxBytes: number,
): Promise<ProfileActionResult<{ url: string }>> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { userId } = ctx.ctx;

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "invalidFile" };
  if (!ALLOWED_TYPES.has(file.type)) return { ok: false, error: "invalidFileType" };
  if (file.size > maxBytes) return { ok: false, error: "fileTooLarge" };

  const supabase = await createClient();
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return { ok: false, error: "uploadFailed" };

  // Point the profile at the new file.
  const updatePayload =
    bucket === "avatars" ? { avatar_path: path } : { cover_path: path };
  const { error: updateError } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId);
  if (updateError) return { ok: false, error: "updateFailed" };

  revalidatePath("/", "layout");
  // `path` is always set here, so the public URL is non-null.
  return { ok: true, data: { url: storagePublicUrl(bucket, path)! } };
}

export async function uploadAvatar(
  formData: FormData,
): Promise<ProfileActionResult<{ url: string }>> {
  return uploadImage(formData, "avatars", MAX_AVATAR_BYTES);
}

export async function uploadCover(
  formData: FormData,
): Promise<ProfileActionResult<{ url: string }>> {
  return uploadImage(formData, "covers", MAX_COVER_BYTES);
}
