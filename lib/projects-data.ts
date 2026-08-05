import { getPrisma } from "@/lib/prisma";
import {
  projects as seedProjects,
  projectCategories,
  categoryMap,
} from "@/lib/data/projects";
import type { Project } from "@/lib/types";

/** Map a Prisma Project row to our Project type. */
function mapProject(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    type: row.type as Project["type"],
    src: row.src,
    poster: row.poster ?? "",
    orientation: row.orientation ?? "landscape",
    hasDescription: row.hasDescription ?? false,
    description: row.description ?? "",
    detailAutoplay: row.detailAutoplay ?? false,
    planId: row.planId ?? "",
    planLabel: row.planLabel ?? "",
    sortOrder: row.sortOrder ?? 0,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getProjects(): Promise<Project[]> {
  const prisma = getPrisma();
  if (!prisma) return seedProjects;

  try {
    const rows = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    if (!rows || rows.length === 0) return seedProjects;
    return rows.map(mapProject);
  } catch {
    return seedProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export { seedProjects, projectCategories, categoryMap };
