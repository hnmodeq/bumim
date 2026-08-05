import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across hot reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only construct the client when a database is configured so the app can
// build & run before Neon is wired up (falls back to static seed data).
export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
