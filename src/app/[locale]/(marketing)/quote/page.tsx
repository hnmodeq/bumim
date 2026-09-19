import type { Metadata } from "next";
import { CalculatorIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getRateCategories, getRateAggregates } from "@/lib/db/rates";
import {
  QuoteCalculator,
  type SerializedAnchor,
} from "@/components/quote/quote-calculator";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.quote" });
  const title = t("title");
  const description = t("description");
  return { title, description, openGraph: { title, description, type: "website" } };
}

/**
 * Public quote calculator (Phase 8). The estimate is grounded in the same
 * approved-only aggregates as the rate guide, so the calculator and the guide
 * can never disagree about what the market says.
 */
export default async function QuotePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fa" | "en";
  const t = await getTranslations({ locale, namespace: "marketing.quote" });

  const [categories, aggregates, user] = await Promise.all([
    getRateCategories(),
    getRateAggregates(),
    getCurrentUser(),
  ]);

  const anchors: SerializedAnchor[] = aggregates.map((a) => ({
    categoryId: a.categoryId,
    experience: a.experience,
    unit: a.unit,
    p25Rial: a.p25Rial,
    medianRial: a.medianRial,
    p75Rial: a.p75Rial,
    samples: a.sampleCount,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CalculatorIcon className="size-6 text-primary" aria-hidden />
          <h1 className="text-3xl font-bold">{t("title")}</h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{t("description")}</p>
      </header>

      <div className="mt-8">
        <QuoteCalculator
          categories={categories.map((c) => ({
            id: c.id,
            slug: c.slug,
            name_fa: c.name_fa,
            name_en: c.name_en,
          }))}
          anchors={anchors}
          locale={loc}
          isSignedIn={Boolean(user)}
        />
      </div>
    </div>
  );
}
