"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { CameraIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";

type UploadAction = (
  formData: FormData,
) => Promise<{ ok: boolean; error?: string; data?: { url: string } }>;

/**
 * Avatar / cover photo uploader. Uploads to Supabase Storage via a server
 * action (subject to storage RLS) and previews the result.
 */
export function PhotoUpload({
  variant,
  currentUrl,
  action,
}: {
  variant: "avatar" | "cover";
  currentUrl: string | null;
  action: UploadAction;
}) {
  const t = useTranslations("profile.photos");
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onFileChange(file: File | undefined) {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const result = await action(fd);
      if (!result.ok) {
        setError(result.error ?? "generic");
        return;
      }
      if (result.data?.url) {
        setUrl(result.data.url);
      }
    });
  }

  const isAvatar = variant === "avatar";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {isAvatar ? (
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full border bg-muted">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={t("avatarAlt")} className="size-full object-cover" />
            ) : (
              <ImageIcon className="absolute inset-0 m-auto size-8 text-muted-foreground" aria-hidden />
            )}
          </div>
        ) : (
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border bg-muted">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={t("coverAlt")} className="size-full object-cover" />
            ) : (
              <ImageIcon className="absolute inset-0 m-auto size-8 text-muted-foreground" aria-hidden />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            onFileChange(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? <Spinner /> : <CameraIcon className="size-4" aria-hidden />}
          {isAvatar ? t("changeAvatar") : t("changeCover")}
        </Button>
        <p className="text-xs text-muted-foreground">{t("hint")}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {t(`errors.${error}`, { fallback: error })}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
