"use client";

import { MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { adminNav, dashboardNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { NotificationsButton } from "@/components/layout/notifications-button";
import { UserMenu } from "@/components/layout/user-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";

/**
 * Shared application chrome for the dashboard and admin areas: a persistent
 * sidebar on desktop, a slide-in sheet on mobile, and a top bar.
 */
export function ShellFrame({
  namespace,
  title,
  children,
}: {
  namespace: "dashboard" | "admin";
  title: string;
  children: React.ReactNode;
}) {
  const t = useTranslations(namespace);
  const tc = useTranslations("common");
  const pathname = usePathname();
  const locale = useLocale();
  const sheetSide = locale === "fa" ? "left" : "right";
  const items: NavItem[] = namespace === "admin" ? adminNav : dashboardNav;

  const nav = (
    <nav className="flex flex-col gap-0.5" aria-label={title}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              active && "bg-accent text-foreground",
            )}
          >
            {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );

  return (
    // NOTE: dashboard/admin routes render no SiteHeader (that lives in the
    // (marketing) group only), so this shell owns the full viewport height and
    // its sticky bars anchor at top-0 — not top-16. Reserving 4rem for a
    // non-existent header pushed the sticky bar down over the first row of
    // page content, hiding it behind the translucent bar and blocking clicks.
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-e bg-card p-4 lg:flex">
        <Link href="/" className="px-3">
          <Logo />
        </Link>
        <div className="flex-1 overflow-y-auto">{nav}</div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <Sheet>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              aria-label={tc("menu")}
            >
              <MenuIcon className="size-5" aria-hidden />
            </SheetTrigger>
            <SheetContent side={sheetSide} className="w-64">
              <SheetHeader>
                <SheetTitle>{title}</SheetTitle>
              </SheetHeader>
              {nav}
            </SheetContent>
          </Sheet>
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <div className="ms-auto flex items-center gap-1">
            <LocaleSwitcher />
            <NotificationsButton />
            <UserMenu />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
