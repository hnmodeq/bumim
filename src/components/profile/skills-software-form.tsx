"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { updateSkills, updateSoftware } from "@/lib/profile/actions";
import type { OwnProfile, Catalog } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";
import { MultiSelectChips, type ChipOption } from "@/components/profile/multi-select-chips";

export function SkillsSoftwareForm({
  profile,
  catalog,
  onSaved,
}: {
  profile: OwnProfile;
  catalog: Catalog;
  onSaved?: () => void;
}) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [skillIds, setSkillIds] = useState<string[]>(
    profile.skills.map((s) => s.id),
  );
  const [softwareIds, setSoftwareIds] = useState<string[]>(
    profile.software.map((s) => s.id),
  );

  const skillOptions: ChipOption[] = catalog.skills.map((s) => ({
    id: s.id,
    label: locale === "fa" ? s.name_fa : (s.name_en ?? s.name_fa),
    group: s.category ? t(`skillCategories.${s.category}`) : null,
  }));

  const softwareOptions: ChipOption[] = catalog.software.map((s) => ({
    id: s.id,
    label: s.name,
  }));

  function toggleSkill(id: string) {
    setSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleSoftware(id: string) {
    setSoftwareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function onSubmit() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const [skillsRes, softwareRes] = await Promise.all([
        updateSkills(skillIds),
        updateSoftware(softwareIds),
      ]);
      if (!skillsRes.ok || !softwareRes.ok) {
        setError(skillsRes.ok ? (softwareRes as { error: string }).error : (skillsRes as { error: string }).error);
        return;
      }
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${error}`)}</AlertDescription>
        </Alert>
      )}
      {saved && (
        <Alert>
          <AlertDescription>{t("saved")}</AlertDescription>
        </Alert>
      )}

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">{t("sections.skills")}</h3>
        <p className="text-sm text-muted-foreground">{t("skillsHint")}</p>
        <MultiSelectChips
          options={skillOptions}
          selectedIds={skillIds}
          onToggle={toggleSkill}
          emptyLabel={t("emptySkills")}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">{t("sections.software")}</h3>
        <p className="text-sm text-muted-foreground">{t("softwareHint")}</p>
        <MultiSelectChips
          options={softwareOptions}
          selectedIds={softwareIds}
          onToggle={toggleSoftware}
          emptyLabel={t("emptySoftware")}
        />
      </section>

      <Button type="button" onClick={onSubmit} disabled={isPending} className="w-fit">
        {isPending && <Spinner />}
        {t("save")}
      </Button>
    </div>
  );
}
