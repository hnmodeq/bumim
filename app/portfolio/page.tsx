import Portfolio from "@/components/sections/Portfolio";
import { getProjects } from "@/lib/projects-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "نمونه کارها | بومیم" };

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <main className="grid grid-cols-1">
      <Portfolio
        projects={projects}
        titleText="نمونه کارها"
        descriptionText="بخشی از نمونه‌کارهای ما برای آشنایی بیشتر با سبک روایت، ریتم و نگاه ما به محتوای دیجیتال."
        showFilters={true}
      />
    </main>
  );
}
