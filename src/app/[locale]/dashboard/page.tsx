import { LayoutDashboard } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function DashboardOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <PlaceholderPage
      icon={LayoutDashboard}
      title={t("overview")}
      description={t("overviewDesc")}
      emptyTitle={tc("comingSoon")}
      emptyDescription={tc("underConstruction")}
    />
  );
}
