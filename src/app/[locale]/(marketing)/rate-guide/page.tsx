import type { Metadata } from "next";
import { BanknoteIcon, InfoIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getRateCategories,
  getRateAggregates,
  groupAggregates,
  type RateGroup,
} from "@/lib/db/rates";
import { RateUnitTable } from "@/components/rate/rate-unit-table";
import { RateFactors } from "@/components/rate/rate-factors";
import { RateScenarios } from "@/components/rate/rate-scenarios";
import { RateSubmissionForm } from "@/components/rate/rate-submission-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

/**
 * Public Rate Guide (Phase 7).
 *
 * Framing rule for this whole page: it is a MARKET REFERENCE, never a price list.
 * Nothing here says what something "should" cost — it shows the typical range,
 * a median only where enough approved samples exist, the factors that move a
 * price, and worked examples. All figures come from `rate_guide_aggregates()`,
 * which reads approved rows only and exposes no submitter data.
 */
export default async function RateGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fa" | "en";
  const t = await getTranslations({ locale, namespace: "marketing.rateGuide" });

  const [categories, aggregates, user] = await Promise.all([
    getRateCategories(),
    getRateAggregates(),
    getCurrentUser(),
  ]);

  const groups = groupAggregates(aggregates, categories);

  // One card per category, holding a table per pricing unit. `groupAggregates`
  // already sorted both by category order and by experience level.
  const byCategory = new Map<string, RateGroup[]>();
  for (const g of groups) {
    const list = byCategory.get(g.categoryId) ?? [];
    list.push(g);
    byCategory.set(g.categoryId, list);
  }
  const orderedCategories = categories.filter((c) => byCategory.has(c.id));
  const nameOf = (c: { name_fa: string; name_en: string | null }) =>
    loc === "fa" ? c.name_fa : (c.name_en ?? c.name_fa);

  const referencePoints = t.raw("reference.points") as string[];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BanknoteIcon className="size-6 text-primary" aria-hidden />
          <h1 className="text-3xl font-bold">{t("title")}</h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{t("description")}</p>
        {/* The "not a price list" framing sits above the numbers, not below them. */}
        <p className="flex max-w-3xl items-start gap-2 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          <InfoIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">{t("reference.title")}. </span>
            {t("methodology")}
          </span>
        </p>
      </header>

      {/* ── Categories, price ranges and medians ── */}
      <section className="mt-8" aria-label={t("title")}>
        {orderedCategories.length === 0 ? (
          <PlaceholderPage
            icon={BanknoteIcon}
            title={t("title")}
            description={t("description")}
            emptyTitle={t("emptyTitle")}
            emptyDescription={t("emptyDescription")}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {orderedCategories.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle className="text-base">{nameOf(c)}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 p-0 pb-0">
                  {byCategory.get(c.id)!.map((g) => (
                    <RateUnitTable
                      key={`${g.categoryId}-${g.unit}`}
                      group={g}
                      categoryName={nameOf(c)}
                      locale={loc}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Submission CTA ── */}
      <div className="mt-8 flex flex-col items-start gap-3 rounded-lg border bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">{t("ctaBody")}</p>
        {/* In-page anchor, so a plain <a> with the button styles — this project's
            Button is a base-ui primitive with no asChild/Slot support. */}
        <a href="#submit" className={`${buttonVariants()} shrink-0`}>
          {t("ctaButton")}
        </a>
      </div>

      {/* ── How to read these numbers ── */}
      <section aria-labelledby="rate-reference-title" className="mt-12">
        <h2 id="rate-reference-title" className="text-xl font-bold">
          {t("reference.title")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("reference.body")}</p>
        <ul className="mt-4 grid max-w-4xl gap-3 sm:grid-cols-2">
          {referencePoints.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <RateFactors />
      <RateScenarios />

      {/* ── Submission form ── */}
      <section id="submit" className="mt-12 scroll-mt-24" aria-labelledby="rate-submit-title">
        <Card>
          <CardHeader>
            <CardTitle id="rate-submit-title" className="text-base">
              {t("submitSection")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RateSubmissionForm categories={categories} locale={loc} isSignedIn={Boolean(user)} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
