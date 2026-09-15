import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/**
 * Portfolio repository — reads for the editor's own portfolio (management) and
 * the public portfolio (profile display). All reads run through the Supabase
 * server client, so RLS decides visibility (published+public vs owner).
 */

export type PortfolioProjectRow = Tables<"portfolio_projects">;

/** A project as seen by its owner (management view). */
export type OwnProject = {
  id: string;
  title: string;
  description: string | null;
  role: string | null;
  client: string | null;
  category: string | null;
  project_date: string | null;
  external_url: string | null;
  video_url: string | null;
  thumbnail_path: string | null;
  status: "draft" | "published" | "private";
  is_featured: boolean;
  sort_order: number;
  /** Selected service ids (for form pre-selection). */
  serviceIds: string[];
  /** Selected software ids (for form pre-selection). */
  softwareIds: string[];
};

/** A project as shown on the public profile. */
export type PublicProject = {
  id: string;
  title: string;
  description: string | null;
  role: string | null;
  client: string | null;
  category: string | null;
  project_date: string | null;
  external_url: string | null;
  video_url: string | null;
  thumbnail_path: string | null;
  is_featured: boolean;
  sort_order: number;
  services: { id: string; title: string; category: string }[];
  software: { id: string; name: string }[];
};

const PROJECT_COLUMNS =
  "id, title, description, role, client, category, project_date, external_url, video_url, thumbnail_path, status, is_featured, sort_order";

type ProjectBase = Omit<OwnProject, "serviceIds" | "softwareIds">;

async function fetchProjects(
  editorId: string,
  statuses: ("draft" | "published" | "private")[],
): Promise<ProjectBase[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_projects")
    .select(PROJECT_COLUMNS)
    .eq("editor_id", editorId)
    .in("status", statuses)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as ProjectBase[];
}

/** The editor's full portfolio (every status), with selected ids. */
export async function getOwnProjects(editorId: string): Promise<OwnProject[]> {
  const supabase = await createClient();
  const projects = await fetchProjects(editorId, ["draft", "published", "private"]);
  if (projects.length === 0) return [];

  const ids = projects.map((p) => p.id);
  const [svcRes, swRes] = await Promise.all([
    supabase.from("portfolio_project_services").select("project_id, service_id").in("project_id", ids),
    supabase.from("portfolio_project_software").select("project_id, software_id").in("project_id", ids),
  ]);

  const serviceByProject = new Map<string, string[]>();
  for (const r of svcRes.data ?? []) {
    const arr = serviceByProject.get(r.project_id) ?? [];
    arr.push(r.service_id);
    serviceByProject.set(r.project_id, arr);
  }
  const softwareByProject = new Map<string, string[]>();
  for (const r of swRes.data ?? []) {
    const arr = softwareByProject.get(r.project_id) ?? [];
    arr.push(r.software_id);
    softwareByProject.set(r.project_id, arr);
  }

  return projects.map((p) => ({
    ...p,
    serviceIds: serviceByProject.get(p.id) ?? [],
    softwareIds: softwareByProject.get(p.id) ?? [],
  }));
}

/** The editor's *published* projects (public profile), with names resolved. */
export async function getPublicProjects(editorId: string): Promise<PublicProject[]> {
  const supabase = await createClient();
  const projects = await fetchProjects(editorId, ["published"]);
  if (projects.length === 0) return [];

  const ids = projects.map((p) => p.id);
  const [svcRes, swRes] = await Promise.all([
    supabase.from("portfolio_project_services").select("project_id, service_id").in("project_id", ids),
    supabase.from("portfolio_project_software").select("project_id, software_id").in("project_id", ids),
  ]);

  const svcLinks = svcRes.data ?? [];
  const swLinks = swRes.data ?? [];

  const serviceIds = [...new Set(svcLinks.map((r) => r.service_id))];
  const softwareIds = [...new Set(swLinks.map((r) => r.software_id))];

  const [svcNamesRes, swNamesRes] = await Promise.all([
    serviceIds.length
      ? supabase.from("services").select("id, title, category").in("id", serviceIds)
      : Promise.resolve({ data: [] }),
    softwareIds.length
      ? supabase.from("software").select("id, name").in("id", softwareIds)
      : Promise.resolve({ data: [] }),
  ]);

  const svcNames = new Map((svcNamesRes.data ?? []).map((s) => [s.id, s]));
  const swNames = new Map((swNamesRes.data ?? []).map((s) => [s.id, s]));

  return projects.map((p) => ({
    ...p,
    services: svcLinks
      .filter((l) => l.project_id === p.id)
      .map((l) => svcNames.get(l.service_id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    software: swLinks
      .filter((l) => l.project_id === p.id)
      .map((l) => swNames.get(l.software_id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s)),
  }));
}
