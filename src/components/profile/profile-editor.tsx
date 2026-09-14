"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ExternalLinkIcon } from "lucide-react";
import type { OwnProfile, Catalog } from "@/lib/db/profiles";
import { storagePublicUrl } from "@/lib/storage";
import { uploadAvatar, uploadCover } from "@/lib/profile/actions";
import { CompletionCard } from "@/components/profile/completion-card";
import { BasicsForm } from "@/components/profile/basics-form";
import { SkillsSoftwareForm } from "@/components/profile/skills-software-form";
import { ServicesManager } from "@/components/profile/services-manager";
import { PhotoUpload } from "@/components/profile/photo-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function ProfileEditor({
  profile,
  catalog,
}: {
  profile: OwnProfile;
  catalog: Catalog;
}) {
  const t = useTranslations("profile");
  const router = useRouter();
  const refresh = () => router.refresh();

  const avatarUrl = storagePublicUrl("avatars", profile.profile.avatar_path);
  const coverUrl = storagePublicUrl("covers", profile.profile.cover_path);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <Link href={`/editors/${profile.profile.username}`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <ExternalLinkIcon className="size-4" aria-hidden />
            {t("viewPublic")}
          </Button>
        </Link>
      </div>

      <CompletionCard profile={profile} />

      <Tabs defaultValue="basics" className="w-full">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="basics">{t("tabs.basics")}</TabsTrigger>
          <TabsTrigger value="skills">{t("tabs.skills")}</TabsTrigger>
          <TabsTrigger value="services">{t("tabs.services")}</TabsTrigger>
          <TabsTrigger value="photos">{t("tabs.photos")}</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="pt-4">
          <BasicsForm profile={profile} onSaved={refresh} />
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <SkillsSoftwareForm profile={profile} catalog={catalog} onSaved={refresh} />
        </TabsContent>

        <TabsContent value="services" className="pt-4">
          <ServicesManager profile={profile} onSaved={refresh} />
        </TabsContent>

        <TabsContent value="photos" className="pt-4">
          <div className="flex max-w-2xl flex-col gap-6">
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">{t("sections.avatar")}</h3>
              <PhotoUpload variant="avatar" currentUrl={avatarUrl} action={uploadAvatar} />
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">{t("sections.cover")}</h3>
              <PhotoUpload variant="cover" currentUrl={coverUrl} action={uploadCover} />
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
