import { UserRound } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function EditorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}) {
  const { locale, username } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "marketing.editorsDetail",
  });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <PlaceholderPage
        icon={UserRound}
        eyebrow={`@${username}`}
        title={t("title")}
        description={t("description")}
        emptyTitle={tc("comingSoon")}
        emptyDescription={tc("underConstruction")}
      />
    </div>
  );
}
