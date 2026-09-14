import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

/**
 * Server-side helper that renders a translated placeholder page for a
 * dashboard/admin section, using the `<key>` and `<key>Desc` message keys.
 */
export async function SectionPlaceholder({
  locale,
  namespace,
  pageKey,
  icon,
  eyebrow,
}: {
  locale: string;
  namespace: "dashboard" | "admin";
  pageKey: string;
  icon: LucideIcon;
  eyebrow?: string;
}) {
  const t = await getTranslations({ locale, namespace });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <PlaceholderPage
      icon={icon}
      eyebrow={eyebrow}
      title={t(pageKey)}
      description={t(`${pageKey}Desc`)}
      emptyTitle={tc("comingSoon")}
      emptyDescription={tc("underConstruction")}
    />
  );
}
