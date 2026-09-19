import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { QuoteForm } from "@/components/quote/quote-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard.quotesPage" });
  return { title: t("editor.newTitle") };
}

/** Blank quote; picks up the calculator handoff from sessionStorage. */
export default async function NewQuotePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dashboard.quotesPage" });
  // Computed here (server) so the client component's render stays pure.
  // "Now" is inherent to a validity window; a server component renders once per
  // request, so the value is stable for the whole response.
  // eslint-disable-next-line react-hooks/purity
  const defaultExpiresAt = new Date(Date.now() + 30 * 86400000)
    .toISOString()
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("editor.newTitle")}</h1>
      <QuoteForm
        initial={null}
        locale={locale as "fa" | "en"}
        defaultExpiresAt={defaultExpiresAt}
      />
    </div>
  );
}
