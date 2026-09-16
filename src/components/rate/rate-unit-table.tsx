import { UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RateGroup } from "@/lib/db/rates";
import { rial, formatMoney } from "@/lib/money";
import { formatCount } from "@/lib/format";
import { MIN_SAMPLES_FOR_MEDIAN } from "@/lib/validators/rate";

/**
 * One (category × unit) table of the public rate guide.
 *
 * Market-reference rules this component encodes:
 *   * the TYPICAL RANGE is the primary figure and is always visible, including
 *     on mobile (the first version hid it below `sm`, dropping the single most
 *     useful number on the smallest screens);
 *   * a MEDIAN is only published once there are MIN_SAMPLES_FOR_MEDIAN approved
 *     samples — a median of one or two submissions looks like a market price but
 *     is really one person's quote. Below the threshold the row says so and
 *     shows the observed min–max of the samples we actually have.
 */
export function RateUnitTable({
  group,
  categoryName,
  locale,
}: {
  group: RateGroup;
  categoryName: string;
  locale: "fa" | "en";
}) {
  const t = useTranslations("marketing.rateGuide");
  const money = (rialStr: string) =>
    formatMoney(rial(rialStr), { locale, unit: "toman" });

  const unitLabel = t(`units.${group.unit}`);
  const hasThinRows = group.rows.some((r) => r.sampleCount < MIN_SAMPLES_FOR_MEDIAN);

  return (
    <div className="px-4 pb-4">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{unitLabel}</p>
      <table className="w-full text-sm">
        <caption className="sr-only">
          {t("tableCaption", { category: `${categoryName} — ${unitLabel}` })}
        </caption>
        <thead>
          <tr className="border-b text-xs text-muted-foreground">
            <th scope="col" className="py-2 text-start font-medium">
              {t("fields.experience")}
            </th>
            <th scope="col" className="py-2 text-start font-medium">
              {t("median")}
            </th>
            <th scope="col" className="hidden py-2 text-start font-medium sm:table-cell">
              {t("range")}
            </th>
            <th scope="col" className="py-2 text-end font-medium">
              {t("samples")}
            </th>
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row) => {
            const enough = row.sampleCount >= MIN_SAMPLES_FOR_MEDIAN;
            // With enough samples the middle 50% is the honest "typical range";
            // below that, show the observed extremes instead of implying a band.
            const range = enough
              ? `${money(row.p25Rial)} – ${money(row.p75Rial)}`
              : `${money(row.minRial)} – ${money(row.maxRial)}`;

            return (
              <tr key={row.experience} className="border-b align-top last:border-0">
                <td className="py-2.5">{t(`experience.${row.experience}`)}</td>
                <td className="py-2.5">
                  {enough ? (
                    <span className="font-semibold">
                      {money(row.medianRial)} {t("toman")}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {t("insufficientTitle")}
                    </span>
                  )}
                  {/* Range inline on mobile, where the range column is hidden.
                      Mutually exclusive with the desktop cell, so assistive tech
                      never hears the same figure twice. */}
                  <span
                    className="mt-0.5 block text-xs text-muted-foreground sm:hidden"
                    dir="ltr"
                  >
                    {range}
                  </span>
                </td>
                <td className="hidden py-2.5 text-muted-foreground sm:table-cell" dir="ltr">
                  {range}
                </td>
                <td className="py-2.5 text-end text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <UsersIcon className="size-3.5" aria-hidden />
                    {formatCount(row.sampleCount, locale)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {hasThinRows && (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("insufficientBody")}{" "}
          <span className="font-medium">{t("observedRange")}.</span>
        </p>
      )}
    </div>
  );
}
