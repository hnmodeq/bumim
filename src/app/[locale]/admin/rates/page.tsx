import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminRateReview } from "@/components/rate/admin-review";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.ratesPage" });
  return { title: t("title"), description: t("description") };
}

/**
 * Rate submission moderation (Phase 7). The layout already enforces `requireAdmin`
 * server-side, and the queries run on the admin's own session so RLS is the
 * actual authorization boundary — not this page.
 */
export default async function AdminRatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminRateReview locale={locale as "fa" | "en"} />;
}
