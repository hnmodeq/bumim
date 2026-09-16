import type { Metadata } from "next";
import { BanknoteIcon, UsersIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getRateCategories,
  getRateAggregates,
  groupAggregates,
} from "@/lib/db/rates";
import { RateSubmissionForm } from "@/components/rate/rate-submission-form";
import { rial, formatMoney } from "@/lib/money";
import { formatCount } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

type Props = {
  params: Promise<{ locale: string }>;
};

/** SEO metadata for the public rate guide. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.rateGuide" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function RateGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "marketing.rateGuide" });

  const [categories, aggregates, user] = await Promise.all([
    getRateCategories(),
    getRateAggregates(),
    getCurrentUser(),
  ]);

  const groups = groupAggregates(aggregates, categories);
  const nameOf = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    if (!c) return slug;
    return locale === "fa" ? c.name_fa : (c.name_en ?? c.name_fa);
  };
  const money = (rialStr: string) =>
    formatMoney(rial(rialStr), { locale: locale as "fa" | "en", unit: "toman" });
  const count = (n: number) => formatCount(n, locale as "fa" | "en");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BanknoteIcon className="size-6 text-primary" aria-hidden />
          <h1 className="text-3xl font-bold">{t("title")}</h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{t("description")}</p>
        <p className="max-w-2xl text-xs text-muted-foreground">{t("methodology")}</p>
      </header>

      {/* ── Aggregates ── */}
      <section className="mt-8" aria-label={t("title")}>
        {groups.length === 0 ? (
          <PlaceholderPage
            icon={BanknoteIcon}
            title={t("title")}
            description={t("description")}
            emptyTitle={t("emptyTitle")}
            emptyDescription={t("emptyDescription")}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {groups.map((g) => (
              <Card key={`${g.categoryId}-${g.unit}`}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                    {nameOf(g.slug)}
                    <Badge variant="secondary">{t(`units.${g.unit}`)}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <table className="w-full text-sm">
                    <caption className="sr-only">
                      {t("tableCaption", { category: nameOf(g.slug) })}
                    </caption>
                    <thead>
                      <tr className="border-b text-start text-xs text-muted-foreground">
                        <th className="py-2 text-start font-medium">{t("fields.experience")}</th>
                        <th className="py-2 text-start font-medium">{t("median")}</th>
                        <th className="hidden py-2 text-start font-medium sm:table-cell">
                          {t("range")}
                        </th>
                        <th className="py-2 text-end font-medium">{t("samples")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map((r) => (
                        <tr key={r.experience} className="border-b last:border-0">
                          <td className="py-2.5">{t(`experience.${r.experience}`)}</td>
                          <td className="py-2.5 font-semibold">
                            {money(r.medianRial)} {t("toman")}
                          </td>
                          <td className="hidden py-2.5 text-muted-foreground sm:table-cell" dir="ltr">
                            {money(r.p25Rial)} – {money(r.p75Rial)}
                          </td>
                          <td className="py-2.5 text-end text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <UsersIcon className="size-3.5" aria-hidden />
                              {count(r.sampleCount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Submission ── */}
      <section className="mt-10" aria-label={t("submitSection")}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("submitSection")}</CardTitle>
          </CardHeader>
          <CardContent>
            <RateSubmissionForm
              categories={categories}
              locale={locale as "fa" | "en"}
              isSignedIn={Boolean(user)}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
