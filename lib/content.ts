import { getPrisma } from "@/lib/prisma";
import {
  projectCategories as fallbackProjectCategories,
} from "@/lib/data/projects";
import { services as fallbackServices } from "@/lib/data/services";
import { teamMembers as fallbackTeamMembers } from "@/lib/data/aboutus";
import {
  defaultAboutContent,
  defaultContactContent,
  defaultFooterContent,
  defaultHeroContent,
  defaultLogoContent,
  defaultHomePortfolioContent,
  defaultNavLinks,
  defaultPortfolioContent,
  defaultSeoContent,
  defaultTerms,
  defaultTermsContent,
  type AboutContent,
  type ContactContent,
  type FooterContent,
  type HeroContent,
  type LogoContent,
  type NavLinkData,
  type PortfolioContent,
  type SeoContent,
  type TermsContent,
} from "@/lib/data/site";
import type { Service } from "@/lib/data/services";
import type { ProjectCategory, TeamMember } from "@/lib/types";

function normalizeFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

function fallbackIfEmpty<T>(items: T[], fallback: T[]): T[] {
  return items.length > 0 ? items : fallback;
}

async function getSiteContentValue<T>(key: string, fallback: T): Promise<T> {
  const prisma = getPrisma();
  if (!prisma) return fallback;

  try {
    const row = await prisma.siteContent.findUnique({ where: { key } });
    return (row?.value as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getNavLinks(): Promise<NavLinkData[]> {
  return getSiteContentValue("navLinks", defaultNavLinks);
}

export async function getLogoContent(): Promise<LogoContent> {
  return getSiteContentValue("logo", defaultLogoContent);
}

export async function getHeroContent(): Promise<HeroContent> {
  return getSiteContentValue("hero", defaultHeroContent);
}

export async function getAboutContent(): Promise<AboutContent> {
  return getSiteContentValue("about", defaultAboutContent);
}

export async function getContactContent(): Promise<ContactContent> {
  return getSiteContentValue("contact", defaultContactContent);
}

export async function getTermsContent(): Promise<TermsContent> {
  return getSiteContentValue("terms", defaultTermsContent);
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  return getSiteContentValue("portfolioPage", defaultPortfolioContent);
}

export async function getHomePortfolioContent(): Promise<PortfolioContent> {
  return getSiteContentValue("homePortfolio", defaultHomePortfolioContent);
}

export async function getFooterContent(): Promise<FooterContent> {
  return getSiteContentValue("footer", defaultFooterContent);
}

export async function getSeoContent(): Promise<SeoContent> {
  return getSiteContentValue("seo", defaultSeoContent);
}

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const prisma = getPrisma();
  if (!prisma) return fallbackProjectCategories;

  try {
    const rows = await prisma.projectCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
    });
    return fallbackIfEmpty(
      rows.map((row) => ({ key: row.key, label: row.label, sortOrder: row.sortOrder })),
      fallbackProjectCategories
    );
  } catch {
    return fallbackProjectCategories;
  }
}

export async function getCategoryMap(): Promise<Record<string, string>> {
  const categories = await getProjectCategories();
  return Object.fromEntries(categories.map((item) => [item.key, item.label]));
}

export async function getServices(): Promise<Service[]> {
  const prisma = getPrisma();
  if (!prisma) return fallbackServices;

  try {
    const rows = await prisma.serviceDefinition.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: {
        plans: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    });

    const services = rows.map((row) => ({
      id: row.id,
      label: row.label,
      categoryKey: row.categoryKey,
      portfolioTab: row.portfolioTab,
      plans: row.plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        limit: plan.limit,
        features: normalizeFeatures(plan.features),
      })),
    }));

    return fallbackIfEmpty(services, fallbackServices);
  } catch {
    return fallbackServices;
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const prisma = getPrisma();
  if (!prisma) return fallbackTeamMembers;

  try {
    const rows = await prisma.teamMember.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    return fallbackIfEmpty(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        description: row.description,
        image: row.image,
        socials: row.socials as unknown as TeamMember["socials"],
      })),
      fallbackTeamMembers
    );
  } catch {
    return fallbackTeamMembers;
  }
}

export async function getTerms(): Promise<string[]> {
  const prisma = getPrisma();
  if (!prisma) return defaultTerms;

  try {
    const rows = await prisma.termItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    return fallbackIfEmpty(rows.map((row) => row.text), defaultTerms);
  } catch {
    return defaultTerms;
  }
}
