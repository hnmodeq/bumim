import PricingEditor from "@/components/admin/PricingEditor";
import { getPricing } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const pricing = await getPricing();
  return <PricingEditor initial={pricing} />;
}
