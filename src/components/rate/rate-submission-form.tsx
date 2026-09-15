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
} from "@/lib/validators/rate";
import type { RateSubmissionInput, RateSubmissionOutput } from "@/lib/validators/rate";
import type { RateCategory } from "@/lib/db/rates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RateSubmissionForm({
  categories,
  locale,
  isSignedIn,
}: {
  categories: RateCategory[];
  locale: "fa" | "en";
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
    });
  }

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
        <Input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label id="rate-category-label">{t("fields.category")}</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
                      {locale === "fa" ? c.name_fa : (c.name_en ?? c.name_fa)}
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
              <Select value={field.value} onValueChange={field.onChange}>
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
              <Select value={field.value} onValueChange={field.onChange}>
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
