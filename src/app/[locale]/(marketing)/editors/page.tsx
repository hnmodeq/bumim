import { Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function EditorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "marketing.editors" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <PlaceholderPage
        icon={Users}
        title={t("title")}
        description={t("description")}
        emptyTitle={tc("comingSoon")}
        emptyDescription={tc("underConstruction")}
      />
    </div>
  );
}
