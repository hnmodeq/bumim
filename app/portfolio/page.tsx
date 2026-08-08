import Portfolio from "@/components/sections/Portfolio";
import { getPortfolioContent, getProjectCategories } from "@/lib/content";
import { getProjects } from "@/lib/projects-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "نمونه کارها | بومیم" };

export default async function PortfolioPage() {
  const [projects, projectCategories, portfolioContent] = await Promise.all([
    getProjects(),
    getProjectCategories(),
    getPortfolioContent(),
  ]);
  return (
    <main className="grid grid-cols-1">
      <Portfolio
        projects={projects}
        projectCategories={projectCategories}
        titleText={portfolioContent.titleText}
        descriptionText={portfolioContent.descriptionText}
        showFilters={true}
      />
    </main>
  );
}
