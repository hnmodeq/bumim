import type { OwnProfile } from "@/lib/db/profiles";

/**
 * Profile-completion scoring.
 *
 * A professional profile is "complete" when the fields that make it useful to
 * a prospective client are filled in. Each field contributes equally; the
 * result drives a progress indicator and a list of concrete recommendations.
 */

export type CompletionResult = {
  /** 0–100 integer. */
  percentage: number;
  /** i18n keys (under `profile.completion.*`) for each missing item. */
  recommendations: string[];
};

export function computeCompletion(
  data: Pick<OwnProfile, "profile" | "editor" | "skills" | "software" | "services">,
): CompletionResult {
  const { profile, editor } = data;

  const checks: [boolean, string][] = [
    [Boolean(profile.avatar_path), "avatar"],
    [Boolean(profile.cover_path), "cover"],
    [Boolean(editor?.headline?.trim()), "headline"],
    [Boolean(profile.bio?.trim()), "bio"],
    [Boolean(editor?.location?.trim() || editor?.city?.trim()), "location"],
    [Boolean(editor?.languages?.length), "languages"],
    [editor?.years_experience != null, "years"],
    [data.skills.length > 0, "skills"],
    [data.software.length > 0, "software"],
    [data.services.length > 0, "services"],
    [Boolean(editor?.industries?.length), "industries"],
    [Boolean(editor?.preferred_project_types?.length), "projectTypes"],
  ];

  const total = checks.length;
  const done = checks.filter(([ok]) => ok).length;
  const percentage = Math.round((done / total) * 100);

  return {
    percentage,
    recommendations: checks.filter(([ok]) => !ok).map(([, key]) => key),
  };
}
