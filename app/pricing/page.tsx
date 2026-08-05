import Pricing from "@/components/sections/Pricing";
import { getPricing } from "@/lib/pricing";
import { getProjects } from "@/lib/projects-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "تعرفه‌ها | بومیم" };

export default async function PricingPage() {
  const [pricing, projects] = await Promise.all([getPricing(), getProjects()]);
  return <Pricing pricing={pricing} projects={projects} />;
}
