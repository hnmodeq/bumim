"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CalculatorIcon, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  COMPLEXITY_LEVELS,
  DURATION_BUCKETS,
  EXPERIENCES,
  TURNAROUNDS,
  USAGE_RIGHTS,
  type Complexity,
  type DurationBucket,
  type Experience,
  type Turnaround,
  type UsageRights,
} from "@/lib/validators/rate";
import {
  calculateEstimate,
  estimateToQuoteItems,
  INCLUDED_REVISIONS,
  PRIMARY_UNIT_BY_SLUG,
  type EstimateLineCode,
  type MarketAnchor,
} from "@/lib/quote/pricing";
import { rial, formatMoney } from "@/lib/money";
import { formatCount } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectItems,
} from "@/components/ui/select";

export type CalculatorCategory = {
  id: string;
  slug: string;
  name_fa: string;
  name_en: string | null;
};

/** Serialized rate_guide_aggregates rows (money as strings, never numbers). */
export type SerializedAnchor = {
  categoryId: string;
  experience: Experience;
  unit: "project" | "hour" | "day" | "minute" | "second";
  p25Rial: string;
  medianRial: string;
  p75Rial: string;
  samples: number;
};

const PREFILL_KEY = "bumim:quote-prefill";

/**
 * The acquisition surface of Phase 8: specs in, market-grounded estimate out,
 * then a one-click handoff into the quote editor.
 *
 * All pricing lives in `@/lib/quote/pricing`; this component only collects
 * inputs and renders what the service returns. The same module runs on the
 * server for the quote handoff, so the numbers can never diverge.
 */
export function QuoteCalculator({
  categories,
  anchors,
  locale,
  isSignedIn,
}: {
  categories: CalculatorCategory[];
  anchors: SerializedAnchor[];
  locale: "fa" | "en";
  isSignedIn: boolean;
}) {
  const t = useTranslations("marketing.quote");
  const tr = useTranslations("marketing.rateGuide");
  const router = useRouter();

  const [categoryId, setCategoryId] = useState("");
  const [experience, setExperience] = useState<Experience>("mid");
  const [videoCount, setVideoCount] = useState(1);
  const [durationBucket, setDurationBucket] = useState<DurationBucket>("min_1_5");
  const [complexity, setComplexity] = useState<Complexity>("standard");
  const [includesMotion, setIncludesMotion] = useState(false);
  const [includesColor, setIncludesColor] = useState(false);
  const [includesSound, setIncludesSound] = useState(false);
  const [revisionRounds, setRevisionRounds] = useState(INCLUDED_REVISIONS);
  const [turnaround, setTurnaround] = useState<Turnaround>("standard");
  const [usageRights, setUsageRights] = useState<UsageRights>("none");

  const anchorFor = useMemo(() => {
    const byKey = new Map<string, SerializedAnchor>();
    for (const a of anchors) byKey.set(`${a.categoryId}|${a.experience}|${a.unit}`, a);
    return (catId: string, exp: Experience, slug: string): MarketAnchor | null => {
      const preferred = PRIMARY_UNIT_BY_SLUG[slug] ?? "project";
      const order = [preferred, "project", "minute", "second", "hour", "day"] as const;
      for (const unit of order) {
        const hit = byKey.get(`${catId}|${exp}|${unit}`);
        if (hit) {
          return {
            unit: hit.unit,
            p25Rial: BigInt(hit.p25Rial),
            medianRial: BigInt(hit.medianRial),
            p75Rial: BigInt(hit.p75Rial),
            samples: hit.samples,
          };
        }
      }
      return null;
    };
  }, [anchors]);

  const category = categories.find((c) => c.id === categoryId) ?? null;

  const estimate = useMemo(() => {
    if (!category) return null;
    return calculateEstimate(
      {
        categorySlug: category.slug,
        experience,
        videoCount,
        durationBucket,
        complexity,
        includesMotion,
        includesColor,
        includesSound,
        revisionRounds,
        turnaround,
        usageRights,
      },
      anchorFor(category.id, experience, category.slug),
    );
  }, [
    category,
    experience,
    videoCount,
    durationBucket,
    complexity,
    includesMotion,
    includesColor,
    includesSound,
    revisionRounds,
    turnaround,
    usageRights,
    anchorFor,
  ]);

  const money = (value: bigint) =>
    formatMoney(rial(value), { locale, unit: "toman" });
  const lineLabel = (code: EstimateLineCode) => t(`lines.${code}`);

  /** Hand the estimate to the quote editor through sessionStorage. */
  function createQuoteFromEstimate() {
    if (!estimate || !category) return;
    const items = estimateToQuoteItems(estimate, videoCount, lineLabel);
    const addons = [
      includesMotion ? t("fields.includesMotion") : null,
      includesColor ? t("fields.includesColor") : null,
      includesSound ? t("fields.includesSound") : null,
    ].filter(Boolean);
    const deliverables = [
      `${formatCount(videoCount, locale)} × ${tr(`durations.${durationBucket}`)}`,
      addons.length ? addons.join("، ") : null,
    ]
      .filter(Boolean)
      .join(" — ");
    sessionStorage.setItem(
      PREFILL_KEY,
      JSON.stringify({
        items: items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unitToman: (i.unitRial / 10n).toString(),
        })),
        revisionsIncluded: revisionRounds,
        deliverables,
      }),
    );
    router.push(locale === "fa" ? "/dashboard/quotes/new" : "/en/dashboard/quotes/new");
  }

  const numberInput = (
    id: string,
    label: string,
    value: number,
    min: number,
    max: number,
    onChange: (v: number) => void,
  ) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        dir="ltr"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          onChange(Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)));
        }}
      />
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ------------------------------ inputs ------------------------------ */}
      <section
        aria-labelledby="quote-calc-fields"
        className="flex flex-col gap-4 rounded-xl border bg-card p-5"
      >
        <h2 id="quote-calc-fields" className="flex items-center gap-2 text-base font-bold">
          <CalculatorIcon className="size-4 text-primary" aria-hidden />
          {t("fieldsTitle")}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label id="qc-category-label">{t("fields.projectType")}</Label>
            <Select
              items={selectItems(categories.map((c) => c.id), (id) => {
                const c = categories.find((x) => x.id === id);
                if (!c) return "";
                return locale === "fa" ? c.name_fa : (c.name_en ?? c.name_fa);
              })}
              value={categoryId}
              onValueChange={(v) => setCategoryId(String(v))}
            >
              <SelectTrigger className="w-full" aria-labelledby="qc-category-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {locale === "fa" ? c.name_fa : (c.name_en ?? c.name_fa)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label id="qc-experience-label">{t("fields.experience")}</Label>
            <Select
              items={selectItems(EXPERIENCES, (e) => tr(`experience.${e}`))}
              value={experience}
              onValueChange={(v) => setExperience(v as Experience)}
            >
              <SelectTrigger className="w-full" aria-labelledby="qc-experience-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCES.map((e) => (
                  <SelectItem key={e} value={e}>
                    {tr(`experience.${e}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {numberInput("qc-videos", t("fields.videoCount"), videoCount, 1, 50, setVideoCount)}

          <div className="flex flex-col gap-1.5">
            <Label id="qc-duration-label">{t("fields.duration")}</Label>
            <Select
              items={selectItems(DURATION_BUCKETS, (d) => tr(`durations.${d}`))}
              value={durationBucket}
              onValueChange={(v) => setDurationBucket(v as DurationBucket)}
            >
              <SelectTrigger className="w-full" aria-labelledby="qc-duration-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_BUCKETS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {tr(`durations.${d}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label id="qc-complexity-label">{t("fields.complexity")}</Label>
            <Select
              items={selectItems(COMPLEXITY_LEVELS, (c) => tr(`complexities.${c}`))}
              value={complexity}
              onValueChange={(v) => setComplexity(v as Complexity)}
            >
              <SelectTrigger className="w-full" aria-labelledby="qc-complexity-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPLEXITY_LEVELS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {tr(`complexities.${c}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {numberInput(
            "qc-revisions",
            t("fields.revisionRounds"),
            revisionRounds,
            0,
            20,
            setRevisionRounds,
          )}

          <div className="flex flex-col gap-1.5">
            <Label id="qc-turnaround-label">{t("fields.turnaround")}</Label>
            <Select
              items={selectItems(TURNAROUNDS, (x) => tr(`turnarounds.${x}`))}
              value={turnaround}
              onValueChange={(v) => setTurnaround(v as Turnaround)}
            >
              <SelectTrigger className="w-full" aria-labelledby="qc-turnaround-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TURNAROUNDS.map((x) => (
                  <SelectItem key={x} value={x}>
                    {tr(`turnarounds.${x}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label id="qc-usage-label">{t("fields.usageRights")}</Label>
            <Select
              items={selectItems(USAGE_RIGHTS, (u) => tr(`usageRightsOptions.${u}`))}
              value={usageRights}
              onValueChange={(v) => setUsageRights(v as UsageRights)}
            >
              <SelectTrigger className="w-full" aria-labelledby="qc-usage-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USAGE_RIGHTS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {tr(`usageRightsOptions.${u}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {(
            [
              ["includesMotion", includesMotion, setIncludesMotion],
              ["includesColor", includesColor, setIncludesColor],
              ["includesSound", includesSound, setIncludesSound],
            ] as const
          ).map(([key, value, set]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                id={`qc-${key}`}
                type="checkbox"
                className="size-4 accent-primary"
                checked={value}
                onChange={(e) => set(e.target.checked)}
              />
              <Label htmlFor={`qc-${key}`} className="font-normal">
                {t(`fields.${key}`)}
              </Label>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ results ----------------------------- */}
      <section
        aria-labelledby="quote-calc-results"
        aria-live="polite"
        className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-5"
      >
        <h2 id="quote-calc-results" className="text-base font-bold">
          {t("results.title")}
        </h2>

        {!estimate ? (
          <p className="text-sm text-muted-foreground">{t("results.empty")}</p>
        ) : (
          <>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("results.range")}</p>
              <p className="mt-1 text-lg font-bold" dir="ltr">
                {money(estimate.lowRial)} – {money(estimate.highRial)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {t("results.perVideo") === "" ? "" : ""}
                </span>
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{t("results.recommended")}</p>
              <p className="mt-0.5 text-2xl font-extrabold text-primary">
                {money(estimate.recommendedRial)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {tr("toman")}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("results.perVideo")}: {money(estimate.perVideoRial)} {tr("toman")}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">{t("results.breakdown")}</h3>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                {estimate.lines.map((line, i) => (
                  <li key={`${line.code}-${i}`} className="flex items-baseline justify-between gap-3">
                    <span className="text-muted-foreground">{lineLabel(line.code)}</span>
                    <span dir="ltr" className={line.amountRial < 0n ? "text-emerald-700" : ""}>
                      {line.amountRial < 0n ? "−" : ""}
                      {money(line.amountRial < 0n ? -line.amountRial : line.amountRial)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <InfoIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                {estimate.source === "market"
                  ? t("results.sourceMarket", { count: formatCount(estimate.samples, locale) })
                  : t("results.sourceReference")}{" "}
                {t("estimateNote")}
              </span>
            </p>

            {isSignedIn ? (
              <Button onClick={createQuoteFromEstimate} className="w-full">
                {t("results.ctaCreate")}
              </Button>
            ) : (
              <Button
                onClick={() => router.push(locale === "fa" ? "/login" : "/en/login")}
                variant="outline"
                className="w-full"
              >
                <ArrowLeftIcon className="size-4 rtl:rotate-180" aria-hidden />
                {t("results.ctaLogin")}
              </Button>
            )}

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {t("results.disclaimer")}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
