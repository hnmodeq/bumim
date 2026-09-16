import { useTranslations } from "next-intl";

/**
 * The factors that move a price — required by the product spec so the guide
 * reads as a market reference rather than a price list. Static content; the same
 * factors are captured (as coarse buckets) on each submission.
 */
export function RateFactors() {
  const t = useTranslations("marketing.rateGuide");
  const items = t.raw("factors.items") as { name: string; detail: string }[];

  return (
    <section aria-labelledby="rate-factors-title" className="mt-12">
      <h2 id="rate-factors-title" className="text-xl font-bold">
        {t("factors.title")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {t("factors.intro")}
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="rounded-lg border bg-card p-4 text-sm shadow-xs"
          >
            <p className="font-semibold">{item.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
