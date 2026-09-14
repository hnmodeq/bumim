import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublicProfileByUsername } from "@/lib/db/profiles";
import { storagePublicUrl } from "@/lib/storage";
import { PublicProfile } from "@/components/profile/public-profile";

type Props = {
  params: Promise<{ locale: string; username: string }>;
};

/** SEO metadata for a public editor profile. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, username } = await params;
  const data = await getPublicProfileByUsername(username);
  if (!data) return {};

  const t = await getTranslations({ locale, namespace: "marketing.editorsDetail" });
  const title = data.editor?.headline
    ? `${data.profile.display_name} — ${data.editor.headline}`
    : data.profile.display_name;
  const description =
    data.profile.bio ?? data.editor?.headline ?? t("description");
  const avatar = storagePublicUrl("avatars", data.profile.avatar_path);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(avatar ? { images: [{ url: avatar }] } : {}),
    },
    alternates: {
      canonical: `/${locale === "fa" ? "" : locale + "/"}editors/${username}`,
    },
  };
}

export default async function EditorDetailPage({ params }: Props) {
  const { locale, username } = await params;
  setRequestLocale(locale);

  const data = await getPublicProfileByUsername(username);
  if (!data) notFound();

  return <PublicProfile data={data} locale={locale} />;
}
