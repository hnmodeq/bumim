"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CalendarIcon,
  ExternalLinkIcon,
  FilmIcon,
  PlayIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { storagePublicUrl } from "@/lib/storage";
import { toEmbedUrl, safeExternalUrl, formatProjectDate } from "@/lib/media";
import type { PublicProject } from "@/lib/db/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Public portfolio grid. Renders project cards; clicking one opens a detail
 * dialog with the full information and (where possible) an embedded video.
 */
export function PortfolioGrid({
  projects,
  locale,
}: {
  projects: PublicProject[];
  locale: "fa" | "en";
}) {
  const t = useTranslations("portfolio");
  const [selected, setSelected] = useState<PublicProject | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const thumbnail = storagePublicUrl("portfolio", p.thumbnail_path);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="group flex flex-col gap-3 rounded-xl border p-3 text-start transition-colors hover:bg-accent"
            >
              <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnail} alt="" className="size-full object-cover" />
                ) : (
                  <FilmIcon className="size-8 text-muted-foreground" aria-hidden />
                )}
                {p.video_url && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <PlayIcon className="size-10 text-white" aria-hidden />
                  </span>
                )}
                {p.is_featured && (
                  <Badge variant="secondary" className="absolute top-2 start-2 gap-1">
                    <StarIcon className="size-3" aria-hidden />
                    {t("featured")}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                  {p.title}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {[
                    p.category ? t(`categories.${p.category}`) : null,
                    formatProjectDate(p.project_date, locale),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {selected.title}
                  {selected.is_featured && (
                    <Badge variant="secondary" className="gap-1">
                      <StarIcon className="size-3" aria-hidden />
                      {t("featured")}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {selected.category && (
                    <span>{t(`categories.${selected.category}`)}</span>
                  )}
                  {selected.project_date && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="size-3.5" aria-hidden />
                      {formatProjectDate(selected.project_date, locale)}
                    </span>
                  )}
                  {selected.client && (
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="size-3.5" aria-hidden />
                      {selected.client}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {/* Embedded video (YouTube/Vimeo) or sanitized outbound link.
                    Never render the raw stored URL into an href. */}
                {(() => {
                  const embed = toEmbedUrl(selected.video_url);
                  if (embed) {
                    return (
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                        <iframe
                          src={embed}
                          title={selected.title}
                          className="size-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    );
                  }
                  const videoLink = safeExternalUrl(selected.video_url);
                  if (videoLink) {
                    return (
                      <a href={videoLink} target="_blank" rel="noreferrer">
                        <Button variant="outline" className="w-full gap-2">
                          <PlayIcon className="size-4" aria-hidden />
                          {t("watchVideo")}
                        </Button>
                      </a>
                    );
                  }
                  return null;
                })()}

                {selected.description && (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {selected.description}
                  </p>
                )}

                {selected.role && (
                  <p className="text-sm">
                    <span className="font-medium">{t("fields.role")}: </span>
                    {selected.role}
                  </p>
                )}

                {selected.services.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("fields.servicesUsed")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.services.map((s) => (
                        <Badge key={s.id} variant="secondary">
                          {s.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.software.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("fields.softwareUsed")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.software.map((s) => (
                        <Badge key={s.id} variant="outline">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(() => {
                  const externalLink = safeExternalUrl(selected.external_url);
                  if (!externalLink) return null;
                  return (
                    <a href={externalLink} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="w-full gap-2">
                        <ExternalLinkIcon className="size-4" aria-hidden />
                        {t("visitProject")}
                      </Button>
                    </a>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
