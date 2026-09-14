import { getTranslations, setRequestLocale } from "next-intl/server";
import { User, FolderKanban, LineChart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

const FEATURES = [
  { key: "profile", icon: User },
  { key: "portfolio", icon: FolderKanban },
  { key: "pricing", icon: LineChart },
  { key: "collaboration", icon: Users },
] as const;

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const ta = await getTranslations({ locale, namespace: "auth" });
  const tn = await getTranslations({ locale, namespace: "nav" });

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
        <Badge variant="secondary">{t("badge")}</Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
          {t("heroSubtitle")}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            {ta("getStarted")}
          </Link>
          <Link
            href="/how-it-works"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            {tn("howItWorks")}
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="border-t bg-card/50"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2
            id="features-heading"
            className="mb-8 text-center text-2xl font-bold tracking-tight"
          >
            {t("featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ key, icon: Icon }) => (
              <Card key={key} className="gap-3 p-5">
                <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-base font-semibold tracking-tight">
                  {t(`features.${key}`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`features.${key}Desc`)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
