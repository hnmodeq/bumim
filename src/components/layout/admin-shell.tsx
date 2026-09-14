import { getTranslations } from "next-intl/server";
import { ShellFrame } from "@/components/layout/shell-frame";

export async function AdminShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "admin" });
  return (
    <ShellFrame namespace="admin" title={t("title")}>
      {children}
    </ShellFrame>
  );
}
