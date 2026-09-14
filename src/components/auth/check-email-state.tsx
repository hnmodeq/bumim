"use client";

import { MailCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

/** Success state shown after signup / password-reset request. */
export function CheckEmailState() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <MailCheckIcon className="size-10 text-primary" aria-hidden />
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-base font-medium">
          {t("checkEmailTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("checkEmailDesc")}</p>
      </div>
    </div>
  );
}
