import PricingEditor from "@/components/admin/PricingEditor";
import { getServices } from "@/lib/content";
import { getPricing } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [pricing, services] = await Promise.all([getPricing(), getServices()]);
  return <PricingEditor initial={pricing} services={services} />;
}
