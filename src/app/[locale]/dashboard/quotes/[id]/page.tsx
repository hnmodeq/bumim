import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnQuoteWithItems } from "@/lib/db/quotes";
import { QuoteForm } from "@/components/quote/quote-form";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard.quotesPage" });
  return { title: t("editor.editTitle") };
}

/**
 * Edit one of our quotes. `getOwnQuoteWithItems` runs on the caller's session,
 * so a foreign id falls through RLS to null and becomes a 404 — there is no
 * branch here that could render someone else's document.
 */
export default async function EditQuotePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dashboard.quotesPage" });

  const quote = await getOwnQuoteWithItems(id);
  if (!quote) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("editor.editTitle")}</h1>
      <QuoteForm
        locale={locale as "fa" | "en"}
        defaultExpiresAt={quote.expires_at}
        initial={{
          id: quote.id,
          clientName: quote.client_name,
          clientCompany: quote.client_company ?? "",
          projectTitle: quote.project_title,
          deliverables: quote.deliverables ?? "",
          revisionsIncluded: quote.revisions_included,
          deadline: quote.deadline ?? "",
          expiresAt: quote.expires_at,
          terms: quote.terms ?? "",
          notes: quote.notes ?? "",
          items: quote.items.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            unitToman: (BigInt(i.unit_rial) / 10n).toString(),
          })),
        }}
      />
    </div>
  );
}
