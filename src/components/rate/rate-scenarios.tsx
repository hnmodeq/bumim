import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Example scenarios, also required by the spec. Each one states the project
 * characteristics first and the money second, and every figure is phrased as a
 * range observed in the data — never "the correct price".
 */
export function RateScenarios() {
  const t = useTranslations("marketing.rateGuide");
  const items = t.raw("scenarios.items") as {
    title: string;
    summary: string;
    factors: string;
    price: string;
  }[];

  return (
    <section aria-labelledby="rate-scenarios-title" className="mt-12">
      <h2 id="rate-scenarios-title" className="text-xl font-bold">
        {t("scenarios.title")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {t("scenarios.intro")}
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 text-xs">
              <p className="leading-relaxed text-muted-foreground">{item.summary}</p>
              <p className="leading-relaxed text-muted-foreground">{item.factors}</p>
              <p className="mt-auto rounded-md bg-muted px-3 py-2 font-medium">
                {item.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
