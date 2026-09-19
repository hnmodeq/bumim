import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { getOwnQuoteWithItems } from "@/lib/db/quotes";
import { quoteTotalRial } from "@/lib/quote/pricing";
import { rial, formatMoney } from "@/lib/money";
import { formatCount } from "@/lib/format";
import { Logo } from "@/components/shared/logo";
import { PrintToolbar } from "@/components/quote/print-toolbar";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quoteDoc" });
  return { title: t("docTitle"), robots: { index: false, follow: false } };
}

/** Format a yyyy-mm-dd column for display (Jalali under fa). */
function formatDate(iso: string | null, locale: "fa" | "en"): string {
  if (!iso) return "—";
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return iso;
  }
}

/**
 * The client-facing document (Phase 8 PDF export).
 *
 * Persian glyph shaping and RTL bidi need a real text engine, so the PDF is
 * produced by the browser's print pipeline ("Save as PDF") from this print-
 * optimised view rather than by a JS PDF library that would render Persian
 * disconnected left-to-right. Ownership: the read runs on the caller session,
 * so anything but our own quote 404s.
 */
export default async function PrintQuotePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const loc = locale as "fa" | "en";
  const t = await getTranslations({ locale, namespace: "quoteDoc" });

  const [quote, editor] = await Promise.all([getOwnQuoteWithItems(id), getCurrentProfile()]);
  if (!quote || !editor) notFound();

  const money = (value: bigint) => formatMoney(rial(value), { locale: loc, unit: "toman" });
  const total = quoteTotalRial(
    quote.items.map((i) => ({ quantity: i.quantity, unitRial: BigInt(i.unit_rial) })),
  );
  const hasDiscount = quote.items.some((i) => i.unit_rial < 0);

  return (
    <div className="mx-auto flex w-full max-w-[210mm] flex-col gap-4 px-4 py-6 print:p-0">
      <PrintToolbar
        printLabel={t("print")}
        backLabel={t("back")}
        backHref={`/dashboard/quotes/${quote.id}`}
      />

      <article className="quote-doc bg-background p-8 shadow-sm print:shadow-none" lang={loc}>
        {/* header: subtle branding start-side, document identity end-side */}
        <header className="flex items-start justify-between gap-6 border-b pb-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Logo markOnly className="size-7" />
            <span className="text-sm font-semibold">بومیم</span>
          </div>
          <div className="text-end">
            <h1 className="text-2xl font-extrabold">{t("docTitle")}</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("issuedAt")}: {formatDate(new Date(quote.created_at).toISOString().slice(0, 10), loc)}
            </p>
          </div>
        </header>

        {/* parties + commercial shape */}
        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground">{t("from")}</h2>
            <p className="mt-1 text-sm font-bold">{editor.display_name}</p>
            <p className="text-xs text-muted-foreground">
              {t("editorContact", { username: editor.username })}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground">{t("to")}</h2>
            <p className="mt-1 text-sm font-bold">{quote.client_name}</p>
            {quote.client_company && (
              <p className="text-xs text-muted-foreground">{quote.client_company}</p>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-lg bg-muted/40 p-4 text-sm">
          <p className="font-bold">{quote.project_title}</p>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("expiresAt")}</dt>
              <dd className="font-medium">{formatDate(quote.expires_at, loc)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("deadline")}</dt>
              <dd className="font-medium">{formatDate(quote.deadline, loc)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("revisions")}</dt>
              <dd className="font-medium">
                {t("rounds", { count: formatCount(quote.revisions_included, loc) })}
              </dd>
            </div>
          </dl>
          {quote.deliverables && (
            <div className="mt-3 border-t pt-3">
              <h3 className="text-xs font-semibold text-muted-foreground">
                {t("deliverablesTitle")}
              </h3>
              <p className="mt-1 whitespace-pre-line text-xs leading-relaxed">{quote.deliverables}</p>
            </div>
          )}
        </section>

        {/* line items */}
        <table className="mt-6 w-full text-sm">
          <caption className="sr-only">{quote.project_title}</caption>
          <thead>
            <tr className="border-b-2 text-xs text-muted-foreground">
              <th scope="col" className="py-2 text-start font-semibold">{t("colDescription")}</th>
              <th scope="col" className="py-2 text-start font-semibold">{t("colQuantity")}</th>
              <th scope="col" className="py-2 text-end font-semibold">{t("colUnitPrice")}</th>
              <th scope="col" className="py-2 text-end font-semibold">{t("colTotal")}</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => {
              const line = BigInt(item.quantity) * BigInt(item.unit_rial);
              return (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2.5 pe-2">{item.description}</td>
                  <td className="py-2.5" dir="ltr">
                    {formatCount(item.quantity, loc)}
                  </td>
                  <td className="py-2.5 text-end" dir="ltr">
                    {money(BigInt(item.unit_rial))}
                  </td>
                  <td className="py-2.5 text-end font-medium" dir="ltr">
                    {line < 0n ? "−" : ""}
                    {money(line < 0n ? -line : line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-4 text-end text-sm font-bold">
                {t("total")}
              </td>
              <td className="pt-4 text-end text-base font-extrabold" dir="ltr">
                {total < 0n ? "−" : ""}
                {money(total < 0n ? -total : total)}{" "}
                <span className="text-xs font-normal text-muted-foreground">{t("toman")}</span>
              </td>
            </tr>
          </tfoot>
        </table>
        {hasDiscount && (
          <p className="mt-1 text-[11px] text-muted-foreground">{t("discountNote")}</p>
        )}

        {(quote.terms || quote.notes) && (
          <section className="mt-6 grid gap-4 text-xs leading-relaxed sm:grid-cols-2">
            {quote.terms && (
              <div>
                <h2 className="font-semibold">{t("termsTitle")}</h2>
                <p className="mt-1 whitespace-pre-line text-muted-foreground">{quote.terms}</p>
              </div>
            )}
            {quote.notes && (
              <div>
                <h2 className="font-semibold">{t("notesTitle")}</h2>
                <p className="mt-1 whitespace-pre-line text-muted-foreground">{quote.notes}</p>
              </div>
            )}
          </section>
        )}

        {/* footer: legal framing + one quiet brand line */}
        <footer className="mt-8 border-t pt-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">{t("disclaimer")}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{t("brandLine")}</p>
        </footer>
      </article>
    </div>
  );
}
