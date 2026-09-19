"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { quoteFormSchema, type QuoteFormInput } from "@/lib/validators/quote";
import { saveQuote } from "@/lib/quote/actions";
import { rial, formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";

const PREFILL_KEY = "bumim:quote-prefill";

export type QuoteFormInitial = {
  id?: string;
  clientName: string;
  clientCompany: string;
  projectTitle: string;
  deliverables: string;
  revisionsIncluded: number;
  deadline: string;
  expiresAt: string;
  terms: string;
  notes: string;
  items: { description: string; quantity: number; unitToman: string }[];
};

/** Blank document. The expiry default arrives as a prop so rendering stays pure. */
const blankInitial = (defaultExpiresAt: string): QuoteFormInitial => ({
  clientName: "",
  clientCompany: "",
  projectTitle: "",
  deliverables: "",
  revisionsIncluded: 2,
  deadline: "",
  expiresAt: defaultExpiresAt,
  terms: "",
  notes: "",
  items: [{ description: "", quantity: 1, unitToman: "" }],
});

/**
 * Quote editor (create + edit). Money is typed in Toman (what editors think
 * in) and converted to integer Rial only at the validation boundary; the live
 * total is bigint arithmetic, so the displayed sum is always exact.
 */
export function QuoteForm({
  initial,
  locale,
  defaultExpiresAt,
}: {
  initial: QuoteFormInitial | null;
  locale: "fa" | "en";
  defaultExpiresAt: string;
}) {
  const t = useTranslations("dashboard.quotesPage");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "error"; key: string } | null>(null);
  const [fromEstimate, setFromEstimate] = useState(false);

  const schema = useMemo(() => quoteFormSchema((k) => t(`errors.${k}`)), [t]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<QuoteFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initial?.id,
      clientName: initial?.clientName ?? "",
      clientCompany: initial?.clientCompany ?? "",
      projectTitle: initial?.projectTitle ?? "",
      deliverables: initial?.deliverables ?? "",
      revisionsIncluded: initial?.revisionsIncluded ?? 2,
      deadline: initial?.deadline ?? "",
      expiresAt: initial?.expiresAt || defaultExpiresAt,
      terms: initial?.terms ?? "",
      notes: initial?.notes ?? "",
      items: initial?.items?.length
        ? initial.items
        : blankInitial(defaultExpiresAt).items,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // A fresh editor picks up the calculator handoff exactly once.
  useEffect(() => {
    if (initial?.id) return;
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PREFILL_KEY);
    try {
      const prefill = JSON.parse(raw) as {
        items?: { description: string; quantity: number; unitToman: string }[];
        revisionsIncluded?: number;
        deliverables?: string;
      };
      const items = prefill.items;
      if (!items?.length) return;
      reset((current) => ({
        ...current,
        deliverables: prefill.deliverables ?? current.deliverables,
        revisionsIncluded: prefill.revisionsIncluded ?? current.revisionsIncluded,
        items,
      }));
      // One-shot browser-storage read; the banner flag cannot be derived
      // during render without tearing SSR hydration of the form values.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFromEstimate(true);
    } catch {
      /* a corrupted handoff is simply ignored */
    }
  }, [initial?.id, reset]);

  // useWatch (not watch) so the derived total stays memo-safe for the linter.
  const watchedItems = useWatch({ control, name: "items" });
  const totalRial = useMemo(() => {
    return (watchedItems ?? []).reduce((sum, item) => {
      const qty = Number.parseInt(String(item?.quantity ?? ""), 10);
      const toman = /^-?\d+$/.test(String(item?.unitToman ?? "").trim())
        ? BigInt(String(item.unitToman).trim())
        : 0n;
      if (!Number.isFinite(qty) || qty < 1) return sum;
      return sum + BigInt(qty) * toman * 10n;
    }, 0n);
  }, [watchedItems]);

  function onSubmit(values: QuoteFormInput) {
    setStatus(null);
    startTransition(async () => {
      const result = await saveQuote(values);
      if (result.ok) {
        setStatus({ kind: "ok", key: "saved" });
        router.push(locale === "fa" ? "/dashboard/quotes" : "/en/dashboard/quotes");
        router.refresh();
      } else {
        setStatus({ kind: "error", key: result.error });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {status?.kind === "ok" && (
        <Alert role="status">
          <AlertDescription>{t(`editor.${status.key}`)}</AlertDescription>
        </Alert>
      )}
      {status?.kind === "error" && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{t(`errors.${status.key}`)}</AlertDescription>
        </Alert>
      )}
      {fromEstimate && (
        <Alert role="status">
          <AlertDescription>{t("editor.fromEstimate")}</AlertDescription>
        </Alert>
      )}

      <section aria-labelledby="quote-client-title" className="flex flex-col gap-4">
        <h2 id="quote-client-title" className="text-base font-bold">
          {t("editor.clientTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clientName">{t("editor.clientName")}</Label>
            <Input id="clientName" aria-invalid={errors.clientName ? true : undefined} {...register("clientName")} />
            {errors.clientName && <FieldError id="clientName-error">{errors.clientName.message}</FieldError>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clientCompany">{t("editor.clientCompany")}</Label>
            <Input id="clientCompany" {...register("clientCompany")} />
            {errors.clientCompany && <FieldError id="clientCompany-error">{errors.clientCompany.message}</FieldError>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="projectTitle">{t("editor.projectTitle")}</Label>
            <Input id="projectTitle" aria-invalid={errors.projectTitle ? true : undefined} {...register("projectTitle")} />
            {errors.projectTitle && <FieldError id="projectTitle-error">{errors.projectTitle.message}</FieldError>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="revisionsIncluded">{t("editor.revisionsIncluded")}</Label>
            <Input id="revisionsIncluded" type="number" dir="ltr" min={0} max={50} {...register("revisionsIncluded")} />
            {errors.revisionsIncluded && (
              <FieldError id="revisionsIncluded-error">{errors.revisionsIncluded.message}</FieldError>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deliverables">{t("editor.deliverables")}</Label>
          <Textarea id="deliverables" rows={2} placeholder={t("editor.deliverablesHint")} {...register("deliverables")} />
          {errors.deliverables && <FieldError id="deliverables-error">{errors.deliverables.message}</FieldError>}
        </div>
      </section>

      <section aria-labelledby="quote-terms-title" className="flex flex-col gap-4">
        <h2 id="quote-terms-title" className="text-base font-bold">
          {t("editor.commercialTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deadline">{t("editor.deadline")}</Label>
            <Input id="deadline" type="date" dir="ltr" {...register("deadline")} />
            {errors.deadline && <FieldError id="deadline-error">{errors.deadline.message}</FieldError>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expiresAt">{t("editor.expiresAt")}</Label>
            <Input id="expiresAt" type="date" dir="ltr" aria-invalid={errors.expiresAt ? true : undefined} {...register("expiresAt")} />
            {errors.expiresAt && <FieldError id="expiresAt-error">{errors.expiresAt.message}</FieldError>}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="terms">{t("editor.terms")}</Label>
          <Textarea id="terms" rows={3} {...register("terms")} />
          {errors.terms && <FieldError id="terms-error">{errors.terms.message}</FieldError>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">{t("editor.notes")}</Label>
          <Textarea id="notes" rows={2} {...register("notes")} />
          {errors.notes && <FieldError id="notes-error">{errors.notes.message}</FieldError>}
        </div>
      </section>

      <section aria-labelledby="quote-items-title" className="flex flex-col gap-3">
        <h2 id="quote-items-title" className="text-base font-bold">
          {t("editor.itemsTitle")}
        </h2>
        <ul className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <li key={field.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[minmax(0,1fr)_5rem_9rem_8rem_2rem] sm:items-start">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`items.${index}.description`}>
                  {t("editor.itemDescription")}
                </Label>
                <Input
                  id={`items.${index}.description`}
                  aria-invalid={errors.items?.[index]?.description ? true : undefined}
                  {...register(`items.${index}.description`)}
                />
                {errors.items?.[index]?.description && (
                  <FieldError id={`items.${index}.description-error`}>
                    {errors.items[index]?.description?.message}
                  </FieldError>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`items.${index}.quantity`}>{t("editor.itemQuantity")}</Label>
                <Input
                  id={`items.${index}.quantity`}
                  type="number"
                  dir="ltr"
                  min={1}
                  max={10000}
                  aria-invalid={errors.items?.[index]?.quantity ? true : undefined}
                  {...register(`items.${index}.quantity`)}
                />
                {errors.items?.[index]?.quantity && (
                  <FieldError id={`items.${index}.quantity-error`}>
                    {errors.items[index]?.quantity?.message}
                  </FieldError>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`items.${index}.unitToman`}>{t("editor.itemUnitPrice")}</Label>
                <Input
                  id={`items.${index}.unitToman`}
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="0"
                  aria-invalid={errors.items?.[index]?.unitToman ? true : undefined}
                  {...register(`items.${index}.unitToman`)}
                />
                {errors.items?.[index]?.unitToman && (
                  <FieldError id={`items.${index}.unitToman-error`}>
                    {errors.items[index]?.unitToman?.message}
                  </FieldError>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">{t("editor.itemTotal")}</span>
                <span className="pt-1.5 text-sm font-semibold" dir="ltr">
                  {formatMoney(
                    rial(
                      (Number.parseInt(String(watchedItems?.[index]?.quantity ?? ""), 10) || 0) *
                        (/^-?\d+$/.test(String(watchedItems?.[index]?.unitToman ?? "").trim())
                          ? Number(BigInt(String(watchedItems[index].unitToman).trim()) * 10n)
                          : 0),
                    ),
                    { locale, unit: "toman" },
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="sr-only">{t("editor.removeItem")}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  <Trash2Icon className="size-4" aria-hidden />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: "", quantity: 1, unitToman: "" })}
          >
            <PlusIcon className="size-4" aria-hidden />
            {t("editor.addItem")}
          </Button>
          <p className="text-sm font-bold">
            {t("editor.total")}:{" "}
            <span dir="ltr">{formatMoney(rial(totalRial), { locale, unit: "toman" })}</span>{" "}
            <span className="text-xs font-normal text-muted-foreground">{t("editor.toman")}</span>
          </p>
        </div>
        {errors.items && typeof errors.items.message === "string" && (
          <FieldError id="items-error">{errors.items.message}</FieldError>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : <SaveIcon className="size-4" aria-hidden />}
          {t("editor.save")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(locale === "fa" ? "/dashboard/quotes" : "/en/dashboard/quotes")}
        >
          {t("editor.backToList")}
        </Button>
      </div>
    </form>
  );
}

