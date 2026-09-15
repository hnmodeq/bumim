"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { storagePublicUrl } from "@/lib/storage";
import { getContext, requireEditor } from "@/lib/profile/actions";
import type { ProfileActionResult } from "@/lib/profile/actions";
import { projectSchema } from "@/lib/validators/portfolio";
import type { ProjectInput } from "@/lib/validators/portfolio";

/**
 * Portfolio project server actions. Authoritative security boundary: input is
 * re-validated with Zod here, and every write runs through the user-session
 * Supabase client so RLS is the final arbiter of ownership ("users can only
 * modify their own portfolio").
 */

const noop = (key: string) => key;

const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Validate service ids (editor-owned) and software ids (catalog) exist. */
async function resolveLinks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  editorId: string,
  serviceIds: string[],
  softwareIds: string[],
): Promise<{ serviceIds: string[]; softwareIds: string[] }> {
  const [svcRes, swRes] = await Promise.all([
    serviceIds.length
      ? supabase.from("services").select("id").eq("editor_id", editorId).in("id", serviceIds)
      : Promise.resolve({ data: [] as { id: string }[] }),
    softwareIds.length
      ? supabase.from("software").select("id").in("id", softwareIds)
      : Promise.resolve({ data: [] as { id: string }[] }),
  ]);
  return {
    serviceIds: (svcRes.data ?? []).map((s) => s.id),
    softwareIds: (swRes.data ?? []).map((s) => s.id),
  };
}

/** Replace a project's service/software links. */
async function replaceLinks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  serviceIds: string[],
  softwareIds: string[],
): Promise<boolean> {
  const { error: delSvc } = await supabase
    .from("portfolio_project_services")
    .delete()
    .eq("project_id", projectId);
  if (delSvc) return false;
  const { error: delSw } = await supabase
    .from("portfolio_project_software")
    .delete()
    .eq("project_id", projectId);
  if (delSw) return false;

  if (serviceIds.length) {
    const { error } = await supabase
      .from("portfolio_project_services")
      .insert(serviceIds.map((serviceId) => ({ project_id: projectId, service_id: serviceId })));
    if (error) return false;
  }
  if (softwareIds.length) {
    const { error } = await supabase
      .from("portfolio_project_software")
      .insert(softwareIds.map((softwareId) => ({ project_id: projectId, software_id: softwareId })));
    if (error) return false;
  }
  return true;
}

/** Create a new portfolio project for the current editor. */
export async function createProject(
  input: ProjectInput,
): Promise<ProfileActionResult<{ id: string }>> {
  const parsed = projectSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();
  const values = parsed.data;

  const { serviceIds, softwareIds } = await resolveLinks(
    supabase,
    editor.editorId,
    values.services,
    values.software,
  );

  // Append at the end of the editor's current ordering.
  const { data: last } = await supabase
    .from("portfolio_projects")
    .select("sort_order")
    .eq("editor_id", editor.editorId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: created, error } = await supabase
    .from("portfolio_projects")
    .insert({
      editor_id: editor.editorId,
      title: values.title,
      description: values.description ?? null,
      role: values.role ?? null,
      client: values.client ?? null,
      category: values.category ?? null,
      project_date: values.projectDate ?? null,
      external_url: values.externalUrl ?? null,
      video_url: values.videoUrl ?? null,
      status: values.isPublished ? "published" : "draft",
      is_featured: values.isFeatured,
      sort_order: (last?.sort_order ?? -1) + 1,
    })
    .select("id")
    .maybeSingle();

  if (error || !created) return { ok: false, error: "updateFailed" };

  if (!(await replaceLinks(supabase, created.id, serviceIds, softwareIds))) {
    return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/", "layout");
  return { ok: true, data: { id: created.id } };
}

/** Update a portfolio project (owned by the current editor). */
export async function updateProject(
  projectId: string,
  input: ProjectInput,
): Promise<ProfileActionResult> {
  const parsed = projectSchema(noop).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalidInput" };

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();
  const values = parsed.data;

  // Ownership pre-check for a clean error (RLS is the real backstop).
  const { data: owned } = await supabase
    .from("portfolio_projects")
    .select("id")
    .eq("id", projectId)
    .eq("editor_id", editor.editorId)
    .maybeSingle();
  if (!owned) return { ok: false, error: "notFound" };

  const { serviceIds, softwareIds } = await resolveLinks(
    supabase,
    editor.editorId,
    values.services,
    values.software,
  );

  const { error } = await supabase
    .from("portfolio_projects")
    .update({
      title: values.title,
      description: values.description ?? null,
      role: values.role ?? null,
      client: values.client ?? null,
      category: values.category ?? null,
      project_date: values.projectDate ?? null,
      external_url: values.externalUrl ?? null,
      video_url: values.videoUrl ?? null,
      status: values.isPublished ? "published" : "draft",
      is_featured: values.isFeatured,
    })
    .eq("id", projectId);

  if (error) return { ok: false, error: "updateFailed" };

  if (!(await replaceLinks(supabase, projectId, serviceIds, softwareIds))) {
    return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Delete a portfolio project (owned by the current editor). */
export async function deleteProject(projectId: string): Promise<ProfileActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", projectId)
    .eq("editor_id", editor.editorId);
  if (error) return { ok: false, error: "updateFailed" };

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Toggle a project's featured flag (owned by the current editor). */
export async function setProjectFeatured(
  projectId: string,
  featured: boolean,
): Promise<ProfileActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();
  const { data: owned } = await supabase
    .from("portfolio_projects")
    .select("id")
    .eq("id", projectId)
    .eq("editor_id", editor.editorId)
    .maybeSingle();
  if (!owned) return { ok: false, error: "notFound" };

  const { error } = await supabase
    .from("portfolio_projects")
    .update({ is_featured: featured })
    .eq("id", projectId);
  if (error) return { ok: false, error: "updateFailed" };

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Reorder the editor's projects (sets sort_order from the given id order). */
export async function reorderProjects(orderedIds: string[]): Promise<ProfileActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const supabase = await createClient();

  // Only touch rows that actually belong to this editor.
  const { data: owned } = await supabase
    .from("portfolio_projects")
    .select("id")
    .eq("editor_id", editor.editorId)
    .in("id", orderedIds);
  const ownedIds = new Set((owned ?? []).map((r) => r.id));

  for (const [index, id] of orderedIds.entries()) {
    if (!ownedIds.has(id)) continue;
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ sort_order: index })
      .eq("id", id);
    if (error) return { ok: false, error: "updateFailed" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Upload (or replace) a project thumbnail to the `portfolio` bucket. */
export async function uploadProjectThumbnail(
  projectId: string,
  formData: FormData,
): Promise<ProfileActionResult<{ url: string }>> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const editor = await requireEditor(ctx.ctx);
  if (!editor.ok) return editor;

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "invalidFile" };
  if (!ALLOWED_TYPES.has(file.type)) return { ok: false, error: "invalidFileType" };
  if (file.size > MAX_THUMBNAIL_BYTES) return { ok: false, error: "fileTooLarge" };

  const supabase = await createClient();

  const { data: owned } = await supabase
    .from("portfolio_projects")
    .select("id, thumbnail_path")
    .eq("id", projectId)
    .eq("editor_id", editor.editorId)
    .maybeSingle();
  if (!owned) return { ok: false, error: "notFound" };

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${ctx.ctx.userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return { ok: false, error: "uploadFailed" };

  // Best-effort cleanup of the previous thumbnail (if it was ours).
  if (owned.thumbnail_path) {
    await supabase.storage.from("portfolio").remove([owned.thumbnail_path]);
  }

  const { error: updateError } = await supabase
    .from("portfolio_projects")
    .update({ thumbnail_path: path })
    .eq("id", projectId);
  if (updateError) return { ok: false, error: "updateFailed" };

  revalidatePath("/", "layout");
  return { ok: true, data: { url: storagePublicUrl("portfolio", path)! } };
}
