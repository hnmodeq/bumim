import { Briefcase } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { SectionPlaceholder } from "@/components/shared/section-placeholder";

export default async function ProjectsPage({
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
      pageKey="projects"
      icon={Briefcase}
    />
  );
}
