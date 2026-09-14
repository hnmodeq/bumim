"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { upsertService, deleteService } from "@/lib/profile/actions";
import {
  serviceSchema,
  SERVICE_CATEGORIES,
  RATE_UNITS,
} from "@/lib/validators/profile";
import type { ServiceInput, ServiceOutput } from "@/lib/validators/profile";
import { rial, formatMoney } from "@/lib/money";
import type { OwnProfile } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ServicesManager({
  profile,
  onSaved,
}: {
  profile: OwnProfile;
  onSaved?: () => void;
}) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(id: string) {
    setEditing({ id });
    setOpen(true);
  }

  function handleRemove(id: string) {
    setBusy(true);
    deleteService(id).then((result) => {
      setBusy(false);
      if (!result.ok) setError(result.error);
      else onSaved?.();
    });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${error}`)}</AlertDescription>
        </Alert>
      )}

      {profile.services.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t("emptyServices")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {profile.services.map((s) => (
            <li key={s.id} className="flex flex-col gap-2 rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{s.title}</span>
                    <Badge variant="secondary">
                      {t(`serviceCategories.${s.category}`)}
                    </Badge>
                  </div>
                  {s.description && (
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("editService")}
                    onClick={() => openEdit(s.id)}
                  >
                    <PencilIcon className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("deleteService")}
                    disabled={busy}
                    onClick={() => handleRemove(s.id)}
                  >
                    <TrashIcon className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
              <p className="text-sm font-medium">
                {formatMoney(rial(String(s.rate_rial)), { locale: locale as "fa" | "en", unit: "toman" })}{" "}
                {t("toman")} · {t(`rateUnits.${s.rate_unit}`)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button type="button" variant="outline" className="w-fit" onClick={openAdd} />
          }
        >
          <PlusIcon className="size-4" aria-hidden />
          {t("addService")}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t("editService") : t("addService")}</DialogTitle>
            <DialogDescription>{t("serviceHint")}</DialogDescription>
          </DialogHeader>
          <ServiceForm
            service={editing ? profile.services.find((s) => s.id === editing.id) : undefined}
            onDone={() => {
              setOpen(false);
              onSaved?.();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceForm({
  service,
  onDone,
}: {
  service?: NonNullable<OwnProfile["services"]>[number];
  onDone: () => void;
}) {
  const t = useTranslations("profile");
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(() => serviceSchema((k) => t(`errors.${k}`)), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceInput, unknown, ServiceOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: (service?.category ?? "editing") as ServiceInput["category"],
      title: service?.title ?? "",
      description: service?.description ?? "",
      rate: service ? String(Math.floor(Number(service.rate_rial) / 10)) : "",
      rateUnit: (service?.rate_unit ?? "project") as ServiceInput["rateUnit"],
    },
  });

  function onSubmit(values: ServiceOutput) {
    setServerError(null);
    startTransition(async () => {
      const result = await upsertService(values, service?.id);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${serverError}`)}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label id="category-label">{t("fields.serviceCategory")}</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
              <SelectTrigger className="w-full" aria-labelledby="category-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t(`serviceCategories.${c}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <FieldError id="category-error">{errors.category.message}</FieldError>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="serviceTitle">{t("fields.serviceTitle")}</Label>
        <Input
          id="serviceTitle"
          placeholder={t("placeholders.serviceTitle")}
          aria-invalid={errors.title ? true : undefined}
          {...register("title")}
        />
        {errors.title && <FieldError id="title-error">{errors.title.message}</FieldError>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="serviceDescription">{t("fields.serviceDescription")}</Label>
        <Textarea
          id="serviceDescription"
          rows={2}
          placeholder={t("placeholders.serviceDescription")}
          {...register("description")}
        />
        {errors.description && (
          <FieldError id="description-error">{errors.description.message}</FieldError>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rate">{t("fields.rate")}</Label>
          <Input
            id="rate"
            inputMode="numeric"
            dir="ltr"
            placeholder="0"
            aria-invalid={errors.rate ? true : undefined}
            {...register("rate")}
          />
          {errors.rate && <FieldError id="rate-error">{errors.rate.message}</FieldError>}
          <p className="text-xs text-muted-foreground">{t("toman")}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label id="rateUnit-label">{t("fields.rateUnit")}</Label>
          <Controller
            control={control}
            name="rateUnit"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger className="w-full" aria-labelledby="rateUnit-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RATE_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {t(`rateUnits.${u}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Spinner />}
        {t("save")}
      </Button>
    </form>
  );
}
