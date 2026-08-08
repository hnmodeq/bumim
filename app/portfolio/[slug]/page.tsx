import ProjectDetails from "@/components/sections/ProjectDetails";
import { getCategoryMap } from "@/lib/content";
import { getProjects } from "@/lib/projects-data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  return { title: `${project?.title ?? "پروژه"} | بومیم` };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [projects, categoryMap] = await Promise.all([getProjects(), getCategoryMap()]);
  return <ProjectDetails projects={projects} slug={slug} categoryMap={categoryMap} />;
}
