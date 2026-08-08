import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env locally or set it in your deployment environment."
    );
  }

  await prisma.$queryRaw`SELECT 1`;

  const [projectCount, pricingConfig] = await Promise.all([
    prisma.project.count(),
    prisma.pricingConfig.findUnique({ where: { id: 1 } }),
  ]);

  console.log("Database connection OK ✔");
  console.log(`Projects table OK ✔ (${projectCount} rows)`);
  console.log(
    pricingConfig
      ? `Pricing config OK ✔ (basePrice=${pricingConfig.basePrice})`
      : "Pricing config missing ⚠ Run `pnpm db:seed` to insert the default row."
  );
}

main()
  .catch((error) => {
    console.error("Database health check failed ✘");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
