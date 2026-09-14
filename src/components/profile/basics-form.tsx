"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { updateBasics } from "@/lib/profile/actions";
import { basicsSchema, AVAILABILITY } from "@/lib/validators/profile";
import type { BasicsInput, BasicsOutput } from "@/lib/validators/profile";
import type { OwnProfile } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";
import { TagInput } from "@/components/profile/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BasicsForm({
  profile,
  onSaved,
}: {
  profile: OwnProfile;
  onSaved?: () => void;
}) {
  const t = useTranslations("profile");
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const schema = useMemo(() => basicsSchema((k) => t(`errors.${k}`)), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BasicsInput, unknown, BasicsOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: profile.profile.display_name,
      username: profile.profile.username,
      headline: profile.editor?.headline ?? "",
      bio: profile.profile.bio ?? "",
      location: profile.editor?.location ?? "",
      city: profile.editor?.city ?? "",
      yearsExperience: profile.editor?.years_experience ?? null,
      availability: profile.editor?.availability ?? "available",
      languages: profile.editor?.languages ?? [],
      industries: profile.editor?.industries ?? [],
      preferredProjectTypes: profile.editor?.preferred_project_types ?? [],
      isPublic: profile.profile.is_public,
    },
  });

  function onSubmit(values: BasicsOutput) {
    setServerError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateBasics(values);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5"
      noValidate
    >
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${serverError}`)}</AlertDescription>
        </Alert>
      )}
      {saved && (
        <Alert>
          <AlertDescription>{t("saved")}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="displayName">{t("fields.displayName")}</Label>
          <Input
            id="displayName"
            autoComplete="name"
            aria-invalid={errors.displayName ? true : undefined}
            aria-describedby={errors.displayName ? "displayName-error" : undefined}
            {...register("displayName")}
          />
          {errors.displayName && (
            <FieldError id="displayName-error">{errors.displayName.message}</FieldError>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">{t("fields.username")}</Label>
          <Input
            id="username"
            autoComplete="username"
            dir="ltr"
            aria-invalid={errors.username ? true : undefined}
            aria-describedby={errors.username ? "username-error" : undefined}
            {...register("username")}
          />
          {errors.username && (
            <FieldError id="username-error">{errors.username.message}</FieldError>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="headline">{t("fields.headline")}</Label>
        <Input
          id="headline"
          placeholder={t("placeholders.headline")}
          aria-invalid={errors.headline ? true : undefined}
          aria-describedby={errors.headline ? "headline-error" : undefined}
          {...register("headline")}
        />
        {errors.headline && (
          <FieldError id="headline-error">{errors.headline.message}</FieldError>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">{t("fields.bio")}</Label>
        <Textarea
          id="bio"
          rows={4}
          placeholder={t("placeholders.bio")}
          aria-invalid={errors.bio ? true : undefined}
          aria-describedby={errors.bio ? "bio-error" : undefined}
          {...register("bio")}
        />
        {errors.bio && <FieldError id="bio-error">{errors.bio.message}</FieldError>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">{t("fields.location")}</Label>
          <Input
            id="location"
            placeholder={t("placeholders.location")}
            aria-invalid={errors.location ? true : undefined}
            {...register("location")}
          />
          {errors.location && (
            <FieldError id="location-error">{errors.location.message}</FieldError>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">{t("fields.city")}</Label>
          <Input
            id="city"
            placeholder={t("placeholders.city")}
            aria-invalid={errors.city ? true : undefined}
            {...register("city")}
          />
          {errors.city && <FieldError id="city-error">{errors.city.message}</FieldError>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="yearsExperience">{t("fields.yearsExperience")}</Label>
          <Input
            id="yearsExperience"
            type="number"
            inputMode="numeric"
            min={0}
            max={60}
            aria-invalid={errors.yearsExperience ? true : undefined}
            aria-describedby={errors.yearsExperience ? "years-error" : undefined}
            {...register("yearsExperience", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
          />
          {errors.yearsExperience && (
            <FieldError id="years-error">{errors.yearsExperience.message}</FieldError>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label id="availability-label">{t("fields.availability")}</Label>
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger className="w-full" aria-labelledby="availability-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY.map((a) => (
                    <SelectItem key={a} value={a}>
                      {t(`availability.${a}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="languages">{t("fields.languages")}</Label>
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <TagInput
              id="languages"
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t("placeholders.languages")}
              suggestions={["فارسی", "English", "العربية"]}
              addLabel={t("addTag")}
              removeLabel={(tag) => t("removeTag", { tag })}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="industries">{t("fields.industries")}</Label>
        <Controller
          control={control}
          name="industries"
          render={({ field }) => (
            <TagInput
              id="industries"
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t("placeholders.industries")}
              addLabel={t("addTag")}
              removeLabel={(tag) => t("removeTag", { tag })}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="projectTypes">{t("fields.projectTypes")}</Label>
        <Controller
          control={control}
          name="preferredProjectTypes"
          render={({ field }) => (
            <TagInput
              id="projectTypes"
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t("placeholders.projectTypes")}
              addLabel={t("addTag")}
              removeLabel={(tag) => t("removeTag", { tag })}
            />
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          type="checkbox"
          className="size-4 accent-primary"
          {...register("isPublic")}
        />
        <Label htmlFor="isPublic" className="font-normal">
          {t("fields.isPublic")}
        </Label>
      </div>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Spinner />}
        {t("save")}
      </Button>
    </form>
  );
}
