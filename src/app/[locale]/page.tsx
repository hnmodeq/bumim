import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

const FEATURES = ["profile", "portfolio", "pricing", "collaboration"] as const;

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-12 px-6 py-20">
      <header className="flex w-full items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">
          {tSite("name")}
        </span>
        <Badge variant="secondary">{t("badge")}</Badge>
      </header>

      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
          {t("heroSubtitle")}
        </p>
        <Button size="lg" disabled>
          {t("comingSoon")}
        </Button>
      </section>

      <section aria-labelledby="features-heading" className="w-full">
        <h2 id="features-heading" className="sr-only">
          {t("featuresTitle")}
        </h2>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map((key) => (
            <Card key={key}>
              <CardHeader>
                <h3 className="text-base font-semibold tracking-tight">
                  {t(`features.${key}`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`features.${key}Desc`)}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <footer className="text-sm text-muted-foreground">
        {tSite("tagline")}
      </footer>
    </main>
  );
}
