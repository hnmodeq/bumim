import { Settings } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { SectionPlaceholder } from "@/components/shared/section-placeholder";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SectionPlaceholder
      locale={locale}
      namespace="dashboard"
      pageKey="settings"
      icon={Settings}
    />
  );
}
