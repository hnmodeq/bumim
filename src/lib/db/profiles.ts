import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";
import { getPublicProjects, type PublicProject } from "@/lib/db/portfolio";

/**
 * Profile repository — all profile-related reads live here so components and
 * server actions don't scatter raw Supabase queries.
 *
 * Reads run through the server client (user session or anonymous), so Supabase
 * RLS decides visibility: public visitors see public profiles; owners see their
 * own (even private) data.
 */

export type ProfileRow = Tables<"profiles">;
export type EditorProfileRow = Tables<"editor_profiles">;
export type SkillRow = Tables<"skills">;
export type SoftwareRow = Tables<"software">;
export type ServiceRow = Tables<"services">;

/** A single editor profile with everything the public page needs. */
export type PublicProfile = {
  profile: ProfileRow;
  editor: EditorProfileRow | null;
  skills: SkillRow[];
  software: SoftwareRow[];
  services: ServiceRow[];
  projects: PublicProject[];
};

/** The currently-authenticated user's own profile + editor extension. */
export type OwnProfile = {
  profile: ProfileRow;
  editor: EditorProfileRow | null;
  skills: SkillRow[]; // selected skills
  software: SoftwareRow[]; // selected software
  services: ServiceRow[];
};

/** Full skills/software catalog (for the picker). */
export type Catalog = {
  skills: SkillRow[];
  software: SoftwareRow[];
};

/** Fetch a public profile (and its editor data) by username, or null. */
export async function getPublicProfileByUsername(
  username: string,
): Promise<PublicProfile | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (!profile) return null;

  const { data: editor } = await supabase
    .from("editor_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  // `/editors/…` is the editor directory — a profile without an
  // editor_profiles row (e.g. an admin account) has no editor data to show.
  if (!editor) return null;

  const [skillsRes, softwareRes, servicesRes, projects] = await Promise.all([
    supabase
      .from("editor_skills")
      .select("skills(*)")
      .eq("editor_id", editor.id),
    supabase
      .from("editor_software")
      .select("software(*)")
      .eq("editor_id", editor.id),
    supabase
      .from("services")
      .select("*")
      .eq("editor_id", editor.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    getPublicProjects(editor.id),
  ]);

  const skills = (skillsRes.data ?? []).map((r) => r.skills as unknown as SkillRow);
  const software = (softwareRes.data ?? []).map((r) => r.software as unknown as SoftwareRow);

  return {
    profile,
    editor,
    skills,
    software,
    services: servicesRes.data ?? [],
    projects,
  };
}

/** Fetch the current user's own profile + editor extension + selected data. */
export async function getOwnProfile(userId: string): Promise<OwnProfile | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return null;

  const { data: editor } = await supabase
    .from("editor_profiles")
    .select("*")
    .eq("profile_id", userId)
    .maybeSingle();

  if (!editor) {
    return { profile, editor: null, skills: [], software: [], services: [] };
  }

  const [skillsRes, softwareRes, servicesRes] = await Promise.all([
    supabase
      .from("editor_skills")
      .select("skills(*)")
      .eq("editor_id", editor.id),
    supabase
      .from("editor_software")
      .select("software(*)")
      .eq("editor_id", editor.id),
    supabase
      .from("services")
      .select("*")
      .eq("editor_id", editor.id)
      .order("created_at", { ascending: true }),
  ]);

  return {
    profile,
    editor,
    skills: (skillsRes.data ?? []).map((r) => r.skills as unknown as SkillRow),
    software: (softwareRes.data ?? []).map((r) => r.software as unknown as SoftwareRow),
    services: servicesRes.data ?? [],
  };
}

/** Fetch the full skills/software catalog (for the editor picker). */
export async function getCatalog(): Promise<Catalog> {
  const supabase = await createClient();
  const [skillsRes, softwareRes] = await Promise.all([
    supabase.from("skills").select("*").order("category", { ascending: true }).order("name_fa", { ascending: true }),
    supabase.from("software").select("*").order("name", { ascending: true }),
  ]);
  return {
    skills: skillsRes.data ?? [],
    software: softwareRes.data ?? [],
  };
}
