import ProjectsManager from "@/components/admin/ProjectsManager";
import { getProjectCategories } from "@/lib/content";
import { getProjects } from "@/lib/projects-data";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [projects, projectCategories] = await Promise.all([
    getProjects(),
    getProjectCategories(),
  ]);
  return <ProjectsManager initial={projects} projectCategories={projectCategories} />;
}
