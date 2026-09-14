"use client";

import { BellIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Notification placeholder — a bell with an empty "no notifications" menu. */
export function NotificationsButton() {
  const t = useTranslations("common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label={t("notifications")}
      >
        <BellIcon className="size-5" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
        <p className="px-1.5 pb-1 text-sm text-muted-foreground">
          {t("noNotifications")}
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
