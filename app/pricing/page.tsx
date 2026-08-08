import Pricing from "@/components/sections/Pricing";
import { getPricing } from "@/lib/pricing";
import { getProjects } from "@/lib/projects-data";
import { getServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "تعرفه‌ها | بومیم" };

export default async function PricingPage() {
  const [pricing, projects, services] = await Promise.all([
    getPricing(),
    getProjects(),
    getServices(),
  ]);
  return <Pricing pricing={pricing} projects={projects} services={services} />;
}
