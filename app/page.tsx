import Hero from "@/components/sections/Hero";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import { getPricing } from "@/lib/pricing";
import { getProjects } from "@/lib/projects-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [pricing, projects] = await Promise.all([getPricing(), getProjects()]);

  return (
    <>
      <Hero />
      <Pricing pricing={pricing} projects={projects} />
      <Contact />
    </>
  );
}
