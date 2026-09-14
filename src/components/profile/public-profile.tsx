import { getTranslations } from "next-intl/server";
import {
  BadgeCheckIcon,
  CalendarIcon,
  ClapperboardIcon,
  ClockIcon,
  FilmIcon,
  GlobeIcon,
  LanguagesIcon,
  MapPinIcon,
  MessageSquareIcon,
  PackageIcon,
  SendIcon,
  ShieldCheckIcon,
  StarIcon,
} from "lucide-react";
import type { PublicProfile } from "@/lib/db/profiles";
import { storagePublicUrl } from "@/lib/storage";
import { rial, formatMoney } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AVAILABILITY_BADGE: Record<string, string> = {
  available: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
  limited: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  booked: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

export async function PublicProfile({
  data,
  locale,
}: {
  data: PublicProfile;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "marketing.editorsDetail" });
  const tp = await getTranslations({ locale, namespace: "profile" });

  const { profile, editor } = data;
  const avatarUrl = storagePublicUrl("avatars", profile.avatar_path);
  const coverUrl = storagePublicUrl("covers", profile.cover_path);
  const availability = editor?.availability ?? "available";
  const location = [editor?.location, editor?.city].filter(Boolean).join("، ");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* ── Header ── */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="relative h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-muted sm:h-52">
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" className="size-full object-cover" />
          )}
        </div>
        <div className="flex flex-col gap-4 px-4 pb-5 sm:px-6">
          <div className="-mt-12 flex items-end justify-between">
            <div className="size-24 overflow-hidden rounded-full border-4 border-card bg-muted">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={profile.display_name} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-3xl font-bold text-muted-foreground">
                  {profile.display_name.charAt(0)}
                </div>
              )}
            </div>
            <Button className="hidden sm:inline-flex">
              <SendIcon className="size-4" aria-hidden />
              {t("requestCta")}
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              {profile.is_verified && (
                <BadgeCheckIcon className="size-5 text-primary" aria-label={t("verified")} />
              )}
            </div>
            <p className="text-sm text-muted-foreground" dir="ltr">
              @{profile.username}
            </p>
            {editor?.headline && (
              <p className="text-base font-medium">{editor.headline}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className={AVAILABILITY_BADGE[availability]}>
                <ClockIcon className="size-3.5" aria-hidden />
                {tp(`availability.${availability}`)}
              </Badge>
              {location && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPinIcon className="size-4" aria-hidden />
                  {location}
                </span>
              )}
            </div>
          </div>

          {/* Mobile CTA */}
          <Button className="sm:hidden">
            <SendIcon className="size-4" aria-hidden />
            {t("requestCta")}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* ── Main column ── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {profile.bio && (
            <Section title={t("bio")}>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            </Section>
          )}

          {data.services.length > 0 && (
            <Section title={t("services")}>
              <ul className="flex flex-col divide-y">
                {data.services.map((s) => (
                  <li key={s.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <PackageIcon className="size-4 text-muted-foreground" aria-hidden />
                        <span className="text-sm font-semibold">{s.title}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatMoney(rial(String(s.rate_rial)), { locale: locale as "fa" | "en", unit: "toman" })}{" "}
                        {tp("toman")} · {tp(`rateUnits.${s.rate_unit}`)}
                      </span>
                    </div>
                    {s.description && (
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {data.projects.length > 0 && (
            <Section title={t("portfolio")}>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.projects.map((p) => (
                  <a
                    key={p.id}
                    href={p.cover && p.cover.kind !== "image" ? p.cover.url : undefined}
                    target={p.cover && p.cover.kind !== "image" ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {p.cover?.kind === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.cover.url} alt="" className="size-full object-cover" />
                      ) : (
                        <FilmIcon className="size-8 text-muted-foreground" aria-hidden />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold group-hover:text-primary">
                          {p.title}
                        </span>
                        {p.is_featured && (
                          <Badge variant="secondary">{t("featured")}</Badge>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                      {(p.client || p.year) && (
                        <p className="text-xs text-muted-foreground">
                          {[p.client, p.year].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-6">
          <Section title={t("experience")}>
            <ul className="flex flex-col gap-3 text-sm">
              {editor?.years_experience != null && (
                <li className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
                  {t("yearsExperience", { years: editor.years_experience })}
                </li>
              )}
              {editor?.languages?.length ? (
                <li className="flex items-start gap-2">
                  <LanguagesIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>{editor.languages.join("، ")}</span>
                </li>
              ) : null}
              {editor?.industries?.length ? (
                <li className="flex items-start gap-2">
                  <GlobeIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>{editor.industries.join("، ")}</span>
                </li>
              ) : null}
              {editor?.preferred_project_types?.length ? (
                <li className="flex items-start gap-2">
                  <ClapperboardIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>{editor.preferred_project_types.join("، ")}</span>
                </li>
              ) : null}
            </ul>
          </Section>

          {data.skills.length > 0 && (
            <Section title={t("skills")}>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((s) => (
                  <Badge key={s.id} variant="secondary">
                    {locale === "fa" ? s.name_fa : (s.name_en ?? s.name_fa)}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {data.software.length > 0 && (
            <Section title={t("software")}>
              <div className="flex flex-wrap gap-1.5">
                {data.software.map((s) => (
                  <Badge key={s.id} variant="outline">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {/* Placeholders (future phases) */}
          <Section title={t("verification")}>
            <Placeholder icon={ShieldCheckIcon} label={t("verificationPlaceholder")} />
          </Section>
          <Section title={t("reviews")}>
            <Placeholder icon={StarIcon} label={t("reviewsPlaceholder")} />
          </Section>
          <Section title={t("collaboration")}>
            <Placeholder icon={MessageSquareIcon} label={t("collaborationPlaceholder")} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Placeholder({ icon: Icon, label }: { icon: typeof StarIcon; label: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
        <Icon className="size-5 shrink-0" aria-hidden />
        <span>{label}</span>
      </CardContent>
    </Card>
  );
}
