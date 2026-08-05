import { getPrisma } from "@/lib/prisma";
import {
  DEFAULT_BASE_PRICE,
  DEFAULT_MULTIPLIERS,
  formatToman,
} from "@/lib/data/services";
import type { PricingData } from "@/lib/types";

export async function getPricing(): Promise<PricingData> {
  const defaults: PricingData = {
    basePrice: DEFAULT_BASE_PRICE,
    multipliers: { ...DEFAULT_MULTIPLIERS },
  };

  const prisma = getPrisma();
  if (!prisma) return defaults;

  try {
    const row = await prisma.pricingConfig.findUnique({ where: { id: 1 } });
    if (!row) return defaults;

    const dbMultipliers = (row.multipliers as Record<string, number>) ?? {};

    return {
      basePrice: row.basePrice ?? DEFAULT_BASE_PRICE,
      multipliers: { ...defaults.multipliers, ...dbMultipliers },
      updatedAt: row.updatedAt?.toISOString(),
    };
  } catch {
    return defaults;
  }
}

export async function updatePricing(
  data: { basePrice?: number; multipliers?: Record<string, number> }
): Promise<PricingData> {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("DATABASE_URL is not configured. Set it to persist pricing.");
  }

  const existing =
    (await prisma.pricingConfig.findUnique({ where: { id: 1 } })) ?? {
      basePrice: DEFAULT_BASE_PRICE,
      multipliers: { ...DEFAULT_MULTIPLIERS },
    };

  const next = {
    basePrice:
      typeof data.basePrice === "number"
        ? data.basePrice
        : (existing.basePrice ?? DEFAULT_BASE_PRICE),
    multipliers: {
      ...(existing.multipliers as Record<string, number>),
      ...(data.multipliers ?? {}),
    },
  };

  await prisma.pricingConfig.upsert({
    where: { id: 1 },
    update: next,
    create: { id: 1, ...next },
  });

  return {
    basePrice: next.basePrice,
    multipliers: next.multipliers,
  };
}

/** Price (in Toman, formatted) for a given plan id based on the loaded pricing. */
export function priceFor(planId: string, pricing: PricingData): string {
  const multiplier = pricing.multipliers[planId];
  if (multiplier == null) return "0";
  return formatToman(pricing.basePrice * multiplier);
}
