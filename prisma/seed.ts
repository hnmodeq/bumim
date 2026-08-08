import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_BASE_PRICE,
  DEFAULT_MULTIPLIERS,
  services,
} from "../lib/data/services";
import { projects as seedProjects, projectCategories } from "../lib/data/projects";
import { teamMembers } from "../lib/data/aboutus";
import { defaultSiteContent, defaultTerms } from "../lib/data/site";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill in your Prisma Postgres connection string, then run `pnpm db:seed`."
    );
  }

  // 1) Pricing config (single row)
  await prisma.pricingConfig.upsert({
    where: { id: 1 },
    update: {
      basePrice: DEFAULT_BASE_PRICE,
      multipliers: DEFAULT_MULTIPLIERS as any,
    },
    create: {
      id: 1,
      basePrice: DEFAULT_BASE_PRICE,
      multipliers: DEFAULT_MULTIPLIERS as any,
    },
  });
  console.log("Seeded pricing config.");

  // 2) Portfolio categories
  for (const [index, category] of projectCategories.entries()) {
    await prisma.projectCategory.upsert({
      where: { key: category.key },
      update: { label: category.label, sortOrder: index },
      create: { key: category.key, label: category.label, sortOrder: index },
    });
  }
  console.log(`Seeded ${projectCategories.length} project categories.`);

  // 3) Projects (idempotent upsert by slug)
  for (const p of seedProjects) {
    const { id, ...rest } = p;
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { ...rest, sortOrder: id },
      create: { ...rest, sortOrder: id },
    });
  }
  console.log(`Seeded ${seedProjects.length} projects.`);

  // 4) Pricing service/plan structure
  for (const [serviceIndex, service] of services.entries()) {
    await prisma.serviceDefinition.upsert({
      where: { id: service.id },
      update: {
        label: service.label,
        categoryKey: service.categoryKey,
        portfolioTab: service.portfolioTab,
        sortOrder: serviceIndex,
      },
      create: {
        id: service.id,
        label: service.label,
        categoryKey: service.categoryKey,
        portfolioTab: service.portfolioTab,
        sortOrder: serviceIndex,
      },
    });

    for (const [planIndex, plan] of service.plans.entries()) {
      await prisma.servicePlan.upsert({
        where: { id: plan.id },
        update: {
          serviceId: service.id,
          name: plan.name,
          limit: plan.limit,
          features: plan.features as any,
          sortOrder: planIndex,
        },
        create: {
          id: plan.id,
          serviceId: service.id,
          name: plan.name,
          limit: plan.limit,
          features: plan.features as any,
          sortOrder: planIndex,
        },
      });
    }
  }
  console.log(`Seeded ${services.length} services and ${services.flatMap((s) => s.plans).length} plans.`);

  // 5) About/team members
  for (const [index, member] of teamMembers.entries()) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {
        name: member.name,
        role: member.role,
        description: member.description,
        image: member.image,
        socials: member.socials as any,
        sortOrder: index,
      },
      create: {
        id: member.id,
        name: member.name,
        role: member.role,
        description: member.description,
        image: member.image,
        socials: member.socials as any,
        sortOrder: index,
      },
    });
  }
  console.log(`Seeded ${teamMembers.length} team members.`);

  // 6) Terms page items
  for (const [index, text] of defaultTerms.entries()) {
    await prisma.termItem.upsert({
      where: { id: index + 1 },
      update: { text, sortOrder: index },
      create: { id: index + 1, text, sortOrder: index },
    });
  }
  console.log(`Seeded ${defaultTerms.length} terms.`);

  // 7) Generic site content/settings
  for (const [key, value] of Object.entries(defaultSiteContent)) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value: value as any },
      create: { key, value: value as any },
    });
  }
  console.log(`Seeded ${Object.keys(defaultSiteContent).length} site content records.`);

  console.log("Done ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
