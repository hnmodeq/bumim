import { UserPlus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <Card className="w-full max-w-sm p-6">
      <EmptyState
        icon={UserPlus}
        title={t("register")}
        description={`${tc("comingSoon")} — ${tc("underConstruction")}`}
        headingLevel="h1"
      />
    </Card>
  );
}
