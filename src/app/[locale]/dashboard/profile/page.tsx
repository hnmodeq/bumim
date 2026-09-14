import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getOwnProfile, getCatalog } from "@/lib/db/profiles";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { SectionPlaceholder } from "@/components/shared/section-placeholder";
import { UserRound } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    return (
      <SectionPlaceholder
        locale={locale}
        namespace="dashboard"
        pageKey="profile"
        icon={UserRound}
      />
    );
  }

  const [own, catalog] = await Promise.all([
    getOwnProfile(user.id),
    getCatalog(),
  ]);

  if (!own) {
    return (
      <SectionPlaceholder
        locale={locale}
        namespace="dashboard"
        pageKey="profile"
        icon={UserRound}
      />
    );
  }

  return <ProfileEditor profile={own} catalog={catalog} />;
}
