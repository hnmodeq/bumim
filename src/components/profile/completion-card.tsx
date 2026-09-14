"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2Icon, CircleDashedIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { computeCompletion } from "@/lib/profile/completion";
import type { OwnProfile } from "@/lib/db/profiles";

/**
 * Profile-completeness meter with concrete recommendations for missing items.
 */
export function CompletionCard({ profile }: { profile: OwnProfile }) {
  const t = useTranslations("profile.completion");
  const { percentage, recommendations } = computeCompletion(profile);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div
            className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-full"
            role="img"
            aria-label={t("percentLabel", { percent: percentage })}
            style={{
              background: `conic-gradient(var(--primary) ${percentage}%, var(--border) 0)`,
            }}
          >
            <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-card">
              <span className="text-sm font-semibold">{percentage}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">{t("title")}</p>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {recommendations.length > 0 && (
          <ul className="flex flex-col gap-1">
            {recommendations.map((key) => (
              <li
                key={key}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CircleDashedIcon className="size-4 shrink-0" aria-hidden />
                {t(key)}
              </li>
            ))}
          </ul>
        )}
        {recommendations.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2Icon className="size-4 shrink-0 text-primary" aria-hidden />
            {t("done")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
