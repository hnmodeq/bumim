import Hero from "@/components/sections/Hero";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import { getPricing } from "@/lib/pricing";
import { getProjects } from "@/lib/projects-data";
import { getContactContent, getHeroContent, getServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [pricing, projects, heroContent, contactContent, services] = await Promise.all([
    getPricing(),
    getProjects(),
    getHeroContent(),
    getContactContent(),
    getServices(),
  ]);

  return (
    <>
      <Hero content={heroContent} />
      <Pricing pricing={pricing} projects={projects} services={services} />
      <Contact content={contactContent} />
    </>
  );
}
