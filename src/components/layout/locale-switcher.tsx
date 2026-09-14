"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** Toggles between Persian (fa) and English (en) on the current route. */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const next = locale === "fa" ? "en" : "fa";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 text-xs font-medium"
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={locale === "fa" ? "Switch to English" : "تغییر به فارسی"}
    >
      {locale === "fa" ? "EN" : "فا"}
    </Button>
  );
}
