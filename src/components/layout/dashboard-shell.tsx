import { getTranslations } from "next-intl/server";
import { ShellFrame } from "@/components/layout/shell-frame";

export async function DashboardShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return (
    <ShellFrame namespace="dashboard" title={t("title")}>
      {children}
    </ShellFrame>
  );
}
