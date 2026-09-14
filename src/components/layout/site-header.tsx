"use client";

import { MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { publicNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { NotificationsButton } from "@/components/layout/notifications-button";
import { UserMenu } from "@/components/layout/user-menu";

export function SiteHeader() {
  const t = useTranslations("nav");
  const ta = useTranslations("auth");
  const pathname = usePathname();
  const locale = useLocale();
  const sheetSide = locale === "fa" ? "left" : "right";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="بومیم" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={t("primary")}
        >
          {publicNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "bg-accent text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="ms-auto flex items-center gap-1">
          <LocaleSwitcher />
          <div className="hidden sm:block">
            <NotificationsButton />
          </div>
          <div className="hidden sm:block">
            <UserMenu />
          </div>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden md:inline-flex",
            )}
          >
            {ta("getStarted")}
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
              aria-label={t("menu")}
            >
              <MenuIcon className="size-5" aria-hidden />
            </SheetTrigger>
            <SheetContent side={sheetSide} className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1" aria-label={t("primary")}>
                {publicNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                        active && "bg-accent text-foreground",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {ta("login")}
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ size: "sm" })}
                >
                  {ta("getStarted")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
