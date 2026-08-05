import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_BASE_PRICE,
  DEFAULT_MULTIPLIERS,
} from "../lib/data/services";
import { projects as seedProjects } from "../lib/data/projects";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill in your Neon connection string, then run `pnpm db:seed`."
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

  // 2) Projects (idempotent upsert by slug)
  for (const p of seedProjects) {
    const { id, ...rest } = p;
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { ...rest, sortOrder: id },
      create: { ...rest, sortOrder: id },
    });
  }
  console.log(`Seeded ${seedProjects.length} projects.`);

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
