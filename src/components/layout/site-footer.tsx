import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { footerNav } from "@/lib/navigation";
import { Logo } from "@/components/shared/logo";

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {tSite("tagline")}
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-8 gap-y-2"
          aria-label={t("footer")}
        >
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <p>
            © {new Date().getFullYear()} {tSite("name")}
          </p>
        </div>
      </div>
    </footer>
  );
}
