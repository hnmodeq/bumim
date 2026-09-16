"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { submitRate } from "@/lib/rate/actions";
import {
  rateSubmissionSchema,
  EXPERIENCES,
  RATE_UNITS,
  DURATION_BUCKETS,
  COMPLEXITY_LEVELS,
  TURNAROUNDS,
  USAGE_RIGHTS,
} from "@/lib/validators/rate";
import type { RateSubmissionInput, RateSubmissionOutput } from "@/lib/validators/rate";
import type { RateCategory } from "@/lib/db/rates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, selectItems } from "@/components/ui/select";

type Locale = "fa" | "en";

/** A labelled Select wired to React Hook Form, with an "unspecified" option. */
function EnumField({
  control,
  name,
  labelId,
  label,
  options,
  labelOf,
  notSpecified,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  labelId: string;
  label: string;
  options: readonly string[];
  labelOf: (value: string) => string;
  notSpecified: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label id={labelId}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            items={{ "": notSpecified, ...selectItems(options, labelOf) }}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger className="w-full" aria-labelledby={labelId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{notSpecified}</SelectItem>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {labelOf(o)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

export function RateSubmissionForm({
  categories,
  locale,
  isSignedIn,
}: {
  categories: RateCategory[];
  locale: Locale;
  isSignedIn: boolean;
}) {
  const t = useTranslations("marketing.rateGuide");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "error"; key: string } | null>(null);

  const schema = useMemo(() => rateSubmissionSchema((k) => t(`errors.${k}`)), [t]);

  // Mint the page-load token the submission action requires (anti-bot throttle).
  // Fetched on mount from the Route Handler, which is the only place a cookie
  // may be set outside a Server Action.
  useEffect(() => {
    fetch("/api/rate-token", { method: "GET" }).catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RateSubmissionInput, unknown, RateSubmissionOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: "",
      experience: "mid",
      unit: "project",
      amount: "",
      city: "",
      isAnonymous: true,
      durationBucket: "",
      complexity: "",
      turnaround: "",
      usageRights: "",
      deliverables: "",
      revisions: "",
      includesMotion: false,
      includesColor: false,
      includesSound: false,
      website: "",
    },
  });

  function onSubmit(values: RateSubmissionOutput) {
    setStatus(null);
    startTransition(async () => {
      const result = await submitRate({
        ...values,
        city: values.city ?? "",
        website: values.website ?? "",
      });
      setStatus(result.ok ? { kind: "ok", key: "submitted" } : { kind: "error", key: result.error });
      if (result.ok) {
        // Keep the throttle honest: a fresh token was issued on success, so the
        // next submission has to wait again.
        fetch("/api/rate-token", { method: "GET" }).catch(() => {});
      }
    });
  }

  /** Localized category label, shared by the option list and the closed trigger. */
  const categoryName = (c: RateCategory) =>
    locale === "fa" ? c.name_fa : (c.name_en ?? c.name_fa);
  const categoryLabel = (id: string) => {
    const c = categories.find((x) => x.id === id);
    return c ? categoryName(c) : "";
  };

  const includes: { name: "includesMotion" | "includesColor" | "includesSound"; label: string }[] = [
    { name: "includesMotion", label: t("fields.includesMotion") },
    { name: "includesColor", label: t("fields.includesColor") },
    { name: "includesSound", label: t("fields.includesSound") },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {status?.kind === "ok" && (
        <Alert>
          <AlertDescription>{t("submittedNotice")}</AlertDescription>
        </Alert>
      )}
      {status?.kind === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${status.key}`)}</AlertDescription>
        </Alert>
      )}

      {/* Honeypot — visually hidden from humans (1px clipped box), never filled. */}
      <div className="sr-only" aria-hidden="true">
        <Label htmlFor="website">{t("fields.website")}</Label>
        <Input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label id="rate-category-label">{t("fields.category")}</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                items={{
                  // categoryId starts as "" (nothing chosen): map it to a
                  // placeholder so the closed trigger is never blank.
                  "": t("fields.categoryPlaceholder"),
                  ...selectItems(
                    categories.map((c) => c.id),
                    (id) => categoryLabel(id),
                  ),
                }}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className="w-full"
                  aria-labelledby="rate-category-label"
                  aria-describedby={errors.categoryId ? "categoryId-error" : undefined}
                  aria-invalid={errors.categoryId ? true : undefined}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {categoryName(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <FieldError id="categoryId-error">{errors.categoryId.message}</FieldError>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label id="rate-experience-label">{t("fields.experience")}</Label>
          <Controller
            control={control}
            name="experience"
            render={({ field }) => (
              <Select
                items={selectItems(EXPERIENCES, (e) => t(`experience.${e}`))}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full" aria-labelledby="rate-experience-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCES.map((e) => (
                    <SelectItem key={e} value={e}>
                      {t(`experience.${e}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label id="rate-unit-label">{t("fields.unit")}</Label>
          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <Select
                items={selectItems(RATE_UNITS, (u) => t(`units.${u}`))}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full" aria-labelledby="rate-unit-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RATE_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {t(`units.${u}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">{t("fields.amount")}</Label>
          <Input
            id="amount"
            inputMode="numeric"
            dir="ltr"
            placeholder="25000000"
            aria-invalid={errors.amount ? true : undefined}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            {...register("amount")}
          />
          {errors.amount && <FieldError id="amount-error">{errors.amount.message}</FieldError>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="city">{t("fields.city")}</Label>
        <Input
          id="city"
          placeholder={t("placeholders.city")}
          aria-invalid={errors.city ? true : undefined}
          aria-describedby={errors.city ? "city-error" : undefined}
          {...register("city")}
        />
        {errors.city && <FieldError id="city-error">{errors.city.message}</FieldError>}
      </div>

      {/* ---- optional project characteristics ---------------------------- */}
      <details className="rounded-lg border bg-muted/30 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium">
          {t("fields.detailsLegend")}
        </summary>
        <p className="mt-2 text-xs text-muted-foreground">{t("fields.detailsHint")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <EnumField
            control={control}
            name="durationBucket"
            labelId="rate-duration-label"
            label={t("fields.duration")}
            options={DURATION_BUCKETS}
            labelOf={(v) => t(`durations.${v}`)}
            notSpecified={t("fields.notSpecified")}
          />
          <EnumField
            control={control}
            name="complexity"
            labelId="rate-complexity-label"
            label={t("fields.complexity")}
            options={COMPLEXITY_LEVELS}
            labelOf={(v) => t(`complexities.${v}`)}
            notSpecified={t("fields.notSpecified")}
          />
          <EnumField
            control={control}
            name="turnaround"
            labelId="rate-turnaround-label"
            label={t("fields.turnaround")}
            options={TURNAROUNDS}
            labelOf={(v) => t(`turnarounds.${v}`)}
            notSpecified={t("fields.notSpecified")}
          />
          <EnumField
            control={control}
            name="usageRights"
            labelId="rate-usage-label"
            label={t("fields.usageRights")}
            options={USAGE_RIGHTS}
            labelOf={(v) => t(`usageRightsOptions.${v}`)}
            notSpecified={t("fields.notSpecified")}
          />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deliverables">{t("fields.deliverables")}</Label>
            <Input
              id="deliverables"
              inputMode="numeric"
              dir="ltr"
              placeholder="1"
              aria-invalid={errors.deliverables ? true : undefined}
              aria-describedby={errors.deliverables ? "deliverables-error" : undefined}
              {...register("deliverables")}
            />
            {errors.deliverables && (
              <FieldError id="deliverables-error">{errors.deliverables.message}</FieldError>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="revisions">{t("fields.revisions")}</Label>
            <Input
              id="revisions"
              inputMode="numeric"
              dir="ltr"
              placeholder="2"
              aria-invalid={errors.revisions ? true : undefined}
              aria-describedby={errors.revisions ? "revisions-error" : undefined}
              {...register("revisions")}
            />
            {errors.revisions && (
              <FieldError id="revisions-error">{errors.revisions.message}</FieldError>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {includes.map((inc) => (
            <div key={inc.name} className="flex items-center gap-2">
              <input
                id={inc.name}
                type="checkbox"
                className="size-4 accent-primary"
                {...register(inc.name)}
              />
              <Label htmlFor={inc.name} className="font-normal">
                {inc.label}
              </Label>
            </div>
          ))}
        </div>
      </details>

      {isSignedIn && (
        <div className="flex items-center gap-2">
          <input
            id="isAnonymous"
            type="checkbox"
            className="size-4 accent-primary"
            {...register("isAnonymous")}
          />
          <Label htmlFor="isAnonymous" className="font-normal">
            {t("fields.isAnonymous")}
          </Label>
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Spinner />}
        {t("submit")}
      </Button>

      <p className="text-xs text-muted-foreground">{t("privacyNote")}</p>
    </form>
  );
}
