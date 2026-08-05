import ProjectsManager from "@/components/admin/ProjectsManager";
import { getProjects } from "@/lib/projects-data";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsManager initial={projects} />;
}
