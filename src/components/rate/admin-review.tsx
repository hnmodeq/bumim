import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getPendingSubmissions,
  getReviewedSubmissions,
  getRateCategories,
  type RateSubmissionRow,
} from "@/lib/db/rates";
import { rial, formatMoney } from "@/lib/money";
import { formatCount, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModerateActions } from "@/components/rate/moderate-actions";

type Locale = "fa" | "en";

/** The project characteristics, as compact chips — what a moderator judges by. */
function CharacteristicChips({ row, locale }: { row: RateSubmissionRow; locale: Locale }) {
  const t = useTranslations("marketing.rateGuide");
  const ta = useTranslations("admin.ratesPage");

  const chips: string[] = [];
  if (row.duration_bucket) chips.push(t(`durations.${row.duration_bucket}`));
  if (row.complexity) chips.push(t(`complexities.${row.complexity}`));
  if (row.turnaround) chips.push(t(`turnarounds.${row.turnaround}`));
  if (row.usage_rights) chips.push(t(`usageRightsOptions.${row.usage_rights}`));
  if (row.deliverable_count != null)
    chips.push(`${ta("deliverablesShort")}: ${formatCount(row.deliverable_count, locale)}`);
  if (row.revision_count != null)
    chips.push(`${ta("revisionsShort")}: ${formatCount(row.revision_count, locale)}`);
  if (row.includes_motion) chips.push(t("fields.includesMotion"));
  if (row.includes_color) chips.push(t("fields.includesColor"));
  if (row.includes_sound) chips.push(t("fields.includesSound"));

  if (chips.length === 0) {
    return <span className="text-xs text-muted-foreground">{ta("noCharacteristics")}</span>;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <li key={c}>
          <Badge variant="outline" className="text-xs font-normal">
            {c}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function SubmissionCard({
  row,
  categoryName,
  locale,
  showActions,
}: {
  row: RateSubmissionRow;
  categoryName: string;
  locale: Locale;
  showActions: boolean;
}) {
  const t = useTranslations("marketing.rateGuide");
  const ta = useTranslations("admin.ratesPage");
  const amount = formatMoney(rial(String(row.amount_rial)), { locale, unit: "toman" });

  return (
    <li className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">{categoryName}</span>
        <Badge variant="secondary">{t(`units.${row.unit}`)}</Badge>
        <Badge variant="secondary">{t(`experience.${row.experience}`)}</Badge>
        <Badge
          variant={
            row.status === "approved" ? "default" : row.status === "rejected" ? "destructive" : "outline"
          }
        >
          {ta(row.status)}
        </Badge>
        <span className="ms-auto text-sm font-bold" dir="ltr">
          {amount} {t("toman")}
        </span>
      </div>

      <div className="mt-3">
        <CharacteristicChips row={row} locale={locale} />
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>
          {ta("submittedAt")}: {formatDateTime(row.created_at, locale)}
        </span>
        {row.city && (
          <span>
            {ta("city")}: {row.city}
          </span>
        )}
        {/* Whether the submitter was signed in matters for moderation, but the
            identity itself is never shown — only admins can see raw rows, and
            the public aggregate exposes none of this. */}
        <span>{row.submitted_by ? ta("signedIn") : ta("anonymous")}</span>
      </p>

      {showActions && <ModerateActions submissionId={row.id} />}
    </li>
  );
}

/**
 * Minimal approve/reject queue (Phase 7). Reports, bulk actions, moderator notes
 * and an audit trail belong to the Phase 15 moderation tooling.
 */
export async function AdminRateReview({ locale }: { locale: Locale }) {
  // Async server component: getTranslations() rather than the useTranslations hook.
  const ta = await getTranslations("admin.ratesPage");
  const [pending, reviewed, categories] = await Promise.all([
    getPendingSubmissions(),
    getReviewedSubmissions(),
    getRateCategories(),
  ]);

  const nameOf = (categoryId: string) => {
    const c = categories.find((x) => x.id === categoryId);
    if (!c) return "—";
    return locale === "fa" ? c.name_fa : (c.name_en ?? c.name_fa);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{ta("title")}</h1>
        <p className="text-sm text-muted-foreground">{ta("description")}</p>
        <p className="max-w-3xl rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          {ta("guidance")}
        </p>
        <Link
          href="/rate-guide"
          className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowRightIcon className="size-3.5 rtl:rotate-180" aria-hidden />
          {ta("backToGuide")}
        </Link>
      </header>

      <section aria-labelledby="rate-queue-title">
        <CardHeader className="px-0">
          <CardTitle id="rate-queue-title" className="flex items-center gap-2 text-base">
            {ta("queueTitle")}
            <Badge variant="secondary">
              {ta("queueCount", { count: formatCount(pending.length, locale) })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {pending.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              {ta("queueEmpty")}
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {pending.map((row) => (
                <SubmissionCard
                  key={row.id}
                  row={row}
                  categoryName={nameOf(row.category_id)}
                  locale={locale}
                  showActions
                />
              ))}
            </ul>
          )}
        </CardContent>
      </section>

      <section aria-labelledby="rate-reviewed-title">
        <CardHeader className="px-0">
          <CardTitle id="rate-reviewed-title" className="text-base">
            {ta("reviewedTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {reviewed.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              {ta("reviewedEmpty")}
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {reviewed.map((row) => (
                <SubmissionCard
                  key={row.id}
                  row={row}
                  categoryName={nameOf(row.category_id)}
                  locale={locale}
                  showActions={false}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </section>
    </div>
  );
}
