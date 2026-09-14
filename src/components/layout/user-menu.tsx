"use client";

import { LogInIcon, UserPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * User menu placeholder (guest state). Once auth lands, this becomes the
 * authenticated account menu (dashboard, profile, settings, sign out).
 */
export function UserMenu() {
  const t = useTranslations("auth");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-accent"
        aria-label={t("account")}
      >
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">ب</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem render={<Link href="/login" />} className="gap-2">
          <LogInIcon className="size-4" aria-hidden />
          {t("login")}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/register" />} className="gap-2">
          <UserPlusIcon className="size-4" aria-hidden />
          {t("register")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
