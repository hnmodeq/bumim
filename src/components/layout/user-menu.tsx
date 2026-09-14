"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldIcon,
  UserPlusIcon,
  UserRoundIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AccountInfo = {
  displayName: string;
  username: string;
  isAdmin: boolean;
};

/**
 * Auth-aware account menu. Reads the session from the browser Supabase client
 * and renders either the guest menu (login / sign up) or the signed-in account
 * menu (dashboard, profile, settings, admin, sign out).
 */
export function UserMenu() {
  const t = useTranslations("auth");
  const router = useRouter();
  const supabase = createClient();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;

      if (!user) {
        setAccount(null);
        setReady(true);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      setAccount(
        profile
          ? {
              displayName: profile.display_name,
              username: profile.username,
              isAdmin: profile.role === "admin",
            }
          : null,
      );
      setReady(true);
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  const initial = account
    ? (account.displayName.charAt(0) || account.username.charAt(0) || "ب")
    : "ب";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-accent"
        aria-label={t("account")}
      >
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {ready && account ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate">
                {account.displayName}
                <span className="block text-xs font-normal text-muted-foreground">
                  @{account.username}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href="/dashboard" />}
              className="gap-2"
            >
              <LayoutDashboardIcon className="size-4" aria-hidden />
              {t("dashboard")}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/dashboard/profile" />}
              className="gap-2"
            >
              <UserRoundIcon className="size-4" aria-hidden />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/dashboard/settings" />}
              className="gap-2"
            >
              <SettingsIcon className="size-4" aria-hidden />
              {t("settings")}
            </DropdownMenuItem>
            {account.isAdmin && (
              <DropdownMenuItem render={<Link href="/admin" />} className="gap-2">
                <ShieldIcon className="size-4" aria-hidden />
                {t("adminPanel")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="gap-2"
              onClick={handleSignOut}
            >
              <LogOutIcon className="size-4" aria-hidden />
              {t("signOut")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem render={<Link href="/login" />} className="gap-2">
              <LogInIcon className="size-4" aria-hidden />
              {t("login")}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/register" />} className="gap-2">
              <UserPlusIcon className="size-4" aria-hidden />
              {t("register")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
