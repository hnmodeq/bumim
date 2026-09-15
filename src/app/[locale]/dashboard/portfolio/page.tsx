import { FolderKanban } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getOwnProfile, getCatalog } from "@/lib/db/profiles";
import { getOwnProjects } from "@/lib/db/portfolio";
import { PortfolioManager } from "@/components/profile/portfolio-manager";
import { SectionPlaceholder } from "@/components/shared/section-placeholder";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });

  const user = await getCurrentUser();
  if (!user) {
    return (
      <SectionPlaceholder
        locale={locale}
        namespace="dashboard"
        pageKey="portfolio"
        icon={FolderKanban}
      />
    );
  }

  const own = await getOwnProfile(user.id);
  if (!own || !own.editor) {
    return (
      <SectionPlaceholder
        locale={locale}
        namespace="dashboard"
        pageKey="portfolio"
        icon={FolderKanban}
      />
    );
  }

  let projects;
  let catalog;
  try {
    [projects, catalog] = await Promise.all([getOwnProjects(own.editor.id), getCatalog()]);
  } catch {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
        {t("portfolioLoadError")}
      </div>
    );
  }

  return (
    <PortfolioManager
      projects={projects}
      services={own.services}
      software={catalog.software}
    />
  );
}
