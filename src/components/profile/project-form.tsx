"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CameraIcon, StarIcon } from "lucide-react";
import { createProject, updateProject, uploadProjectThumbnail } from "@/lib/profile/portfolio-actions";
import { projectSchema, PROJECT_CATEGORIES } from "@/lib/validators/portfolio";
import type { ProjectInput, ProjectOutput } from "@/lib/validators/portfolio";
import { storagePublicUrl } from "@/lib/storage";
import type { OwnProject } from "@/lib/db/portfolio";
import type { ServiceRow, SoftwareRow } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";
import { MultiSelectChips } from "@/components/profile/multi-select-chips";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectForm({
  project,
  services,
  software,
  onDone,
}: {
  project?: OwnProject;
  services: ServiceRow[];
  software: SoftwareRow[];
  onDone: () => void;
}) {
  const t = useTranslations("portfolio");
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    project ? storagePublicUrl("portfolio", project.thumbnail_path) : null,
  );
  const thumbnailInput = useRef<HTMLInputElement>(null);

  const schema = useMemo(() => projectSchema((k) => t(`errors.${k}`)), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectInput, unknown, ProjectOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      role: project?.role ?? "",
      client: project?.client ?? "",
      category: (project?.category ?? "") as ProjectInput["category"],
      projectDate: project?.project_date ?? "",
      externalUrl: project?.external_url ?? "",
      videoUrl: project?.video_url ?? "",
      isPublished: project ? project.status === "published" : true,
      isFeatured: project?.is_featured ?? false,
      services: project?.serviceIds ?? [],
      software: project?.softwareIds ?? [],
    },
  });

  function onThumbnailChange(file: File | undefined) {
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: ProjectOutput) {
    setServerError(null);
    startTransition(async () => {
      const input: ProjectInput = {
        ...values,
        projectDate: values.projectDate ?? "",
        category: (values.category ?? "") as ProjectInput["category"],
      };
      const result = project
        ? await updateProject(project.id, input)
        : await createProject(input);

      if (!result.ok) {
        setServerError(result.error);
        return;
      }

      // Upload the thumbnail (if a new file was chosen).
      const projectId = project?.id ?? (result.ok && result.data ? result.data.id : null);
      if (projectId && thumbnailFile) {
        const fd = new FormData();
        fd.set("file", thumbnailFile);
        const upload = await uploadProjectThumbnail(projectId, fd);
        if (!upload.ok) {
          setServerError(upload.error);
          return;
        }
      }

      onDone();
    });
  }

  const serviceOptions = services.map((s) => ({ id: s.id, label: s.title }));
  const softwareOptions = software.map((s) => ({ id: s.id, label: s.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${serverError}`)}</AlertDescription>
        </Alert>
      )}

      {/* Thumbnail */}
      <div className="flex flex-col gap-2">
        <Label>{t("fields.thumbnail")}</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border bg-muted">
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailPreview} alt="" className="size-full object-cover" />
            ) : (
              <CameraIcon className="absolute inset-0 m-auto size-6 text-muted-foreground" aria-hidden />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              ref={thumbnailInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                onThumbnailChange(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => thumbnailInput.current?.click()}
            >
              {t(project ? "changeThumbnail" : "uploadThumbnail")}
            </Button>
            <p className="text-xs text-muted-foreground">{t("thumbnailHint")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">{t("fields.title")}</Label>
        <Input
          id="title"
          placeholder={t("placeholders.title")}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
          {...register("title")}
        />
        {errors.title && <FieldError id="title-error">{errors.title.message}</FieldError>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label id="category-label">{t("fields.category")}</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(v) => field.onChange(v === "" ? undefined : v)}
              >
                <SelectTrigger className="w-full" aria-labelledby="category-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("categoryNone")}</SelectItem>
                  {PROJECT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {t(`categories.${c}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="projectDate">{t("fields.projectDate")}</Label>
          <Input
            id="projectDate"
            type="date"
            dir="ltr"
            aria-invalid={errors.projectDate ? true : undefined}
            aria-describedby={errors.projectDate ? "projectDate-error" : undefined}
            {...register("projectDate")}
          />
          {errors.projectDate && (
            <FieldError id="projectDate-error">{errors.projectDate.message}</FieldError>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">{t("fields.role")}</Label>
          <Input
            id="role"
            placeholder={t("placeholders.role")}
            {...register("role")}
          />
          {errors.role && <FieldError id="role-error">{errors.role.message}</FieldError>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="client">{t("fields.client")}</Label>
          <Input
            id="client"
            placeholder={t("placeholders.client")}
            {...register("client")}
          />
          {errors.client && <FieldError id="client-error">{errors.client.message}</FieldError>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">{t("fields.description")}</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder={t("placeholders.description")}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "description-error" : undefined}
          {...register("description")}
        />
        {errors.description && (
          <FieldError id="description-error">{errors.description.message}</FieldError>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="videoUrl">{t("fields.videoUrl")}</Label>
        <Input
          id="videoUrl"
          type="url"
          inputMode="url"
          dir="ltr"
          placeholder="https://…"
          aria-invalid={errors.videoUrl ? true : undefined}
          aria-describedby={errors.videoUrl ? "videoUrl-error" : undefined}
          {...register("videoUrl")}
        />
        <p className="text-xs text-muted-foreground">{t("videoUrlHint")}</p>
        {errors.videoUrl && <FieldError id="videoUrl-error">{errors.videoUrl.message}</FieldError>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="externalUrl">{t("fields.externalUrl")}</Label>
        <Input
          id="externalUrl"
          type="url"
          inputMode="url"
          dir="ltr"
          placeholder="https://…"
          aria-invalid={errors.externalUrl ? true : undefined}
          aria-describedby={errors.externalUrl ? "externalUrl-error" : undefined}
          {...register("externalUrl")}
        />
        {errors.externalUrl && (
          <FieldError id="externalUrl-error">{errors.externalUrl.message}</FieldError>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("fields.servicesUsed")}</Label>
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <MultiSelectChips
              options={serviceOptions}
              selectedIds={field.value ?? []}
              onToggle={(id) => {
                const current = field.value ?? [];
                field.onChange(
                  current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
                );
              }}
              emptyLabel={t("noServices")}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("fields.softwareUsed")}</Label>
        <Controller
          control={control}
          name="software"
          render={({ field }) => (
            <MultiSelectChips
              options={softwareOptions}
              selectedIds={field.value ?? []}
              onToggle={(id) => {
                const current = field.value ?? [];
                field.onChange(
                  current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
                );
              }}
              emptyLabel={t("noSoftware")}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            type="checkbox"
            className="size-4 accent-primary"
            {...register("isPublished")}
          />
          <Label htmlFor="isPublished" className="font-normal">
            {t("fields.isPublished")}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isFeatured"
            type="checkbox"
            className="size-4 accent-primary"
            {...register("isFeatured")}
          />
          <Label htmlFor="isFeatured" className="inline-flex items-center gap-1 font-normal">
            <StarIcon className="size-3.5" aria-hidden />
            {t("fields.isFeatured")}
          </Label>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Spinner />}
        {t(project ? "save" : "create")}
      </Button>
    </form>
  );
}
