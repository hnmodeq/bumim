import type { Metadata } from "next";
import { CalculatorIcon, PlusIcon, ReceiptText } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnQuotesWithItems, type QuoteWithItems } from "@/lib/db/quotes";
import { quoteTotalRial } from "@/lib/quote/pricing";
import { rial, formatMoney } from "@/lib/money";
import { formatCount, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { QuoteRowActions } from "@/components/quote/quote-row-actions";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard.quotesPage" });
  return { title: t("title"), description: t("description") };
}

function QuoteTable({
  quotes,
  locale,
  t,
}: {
  quotes: QuoteWithItems[];
  locale: "fa" | "en";
  t: (key: string) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <caption className="sr-only">{t("title")}</caption>
        <thead>
          <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
            <th scope="col" className="px-3 py-2 text-start font-medium">{t("columns.client")}</th>
            <th scope="col" className="px-3 py-2 text-start font-medium">{t("columns.project")}</th>
            <th scope="col" className="px-3 py-2 text-start font-medium">{t("columns.total")}</th>
            <th scope="col" className="hidden px-3 py-2 text-start font-medium sm:table-cell">
              {t("columns.updated")}
            </th>
            <th scope="col" className="px-3 py-2 text-end font-medium">{t("columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => {
            const total = quoteTotalRial(
              q.items.map((i) => ({ quantity: i.quantity, unitRial: BigInt(i.unit_rial) })),
            );
            return (
              <tr key={q.id} className="border-b align-top last:border-0">
                <td className="px-3 py-2.5">
                  <span className="block font-medium">{q.client_name}</span>
                  {q.client_company && (
                    <span className="block text-xs text-muted-foreground">{q.client_company}</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className="block">{q.project_title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {t("items").replace("{count}", formatCount(q.items.length, locale))}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-semibold" dir="ltr">
                  {formatMoney(rial(total), { locale, unit: "toman" })}
                </td>
                <td className="hidden px-3 py-2.5 text-xs text-muted-foreground sm:table-cell">
                  {formatDateTime(q.updated_at, locale)}
                </td>
                <td className="px-3 py-2.5 text-end">
                  <QuoteRowActions quoteId={q.id} status={q.status} locale={locale} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The editor's private quote workspace. */
export default async function DashboardQuotesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fa" | "en";
  const t = await getTranslations({ locale, namespace: "dashboard.quotesPage" });
  const tr = (key: string) => t(key);

  const quotes = await getOwnQuotesWithItems();
  const drafts = quotes.filter((q) => q.status === "draft");
  const archived = quotes.filter((q) => q.status === "archived");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <ReceiptText className="size-5 text-primary" aria-hidden />
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/quote"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <CalculatorIcon className="size-4" aria-hidden />
            {t("calculatorCta")}
          </Link>
          <Link href="/dashboard/quotes/new" className={buttonVariants({ size: "sm" })}>
            <PlusIcon className="size-4" aria-hidden />
            {t("new")}
          </Link>
        </div>
      </header>

      {drafts.length === 0 && archived.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <>
          {drafts.length > 0 && (
            <section aria-label={t("status.draft")}>
              <QuoteTable quotes={drafts} locale={loc} t={tr} />
            </section>
          )}
          {archived.length > 0 && (
            <details className="rounded-lg border bg-muted/20 px-4 py-3">
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                {t("showArchived")}
                <Badge variant="secondary">{formatCount(archived.length, loc)}</Badge>
              </summary>
              <div className="mt-3">
                <QuoteTable quotes={archived} locale={loc} t={tr} />
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}
