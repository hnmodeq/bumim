import About from "@/components/sections/About";
import { getAboutContent, getTeamMembers } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "درباره ما | بومیم" };

export default async function AboutPage() {
  const [content, teamMembers] = await Promise.all([
    getAboutContent(),
    getTeamMembers(),
  ]);
  return <About content={content} teamMembers={teamMembers} />;
}
