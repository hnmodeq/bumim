import { USD_PRICE, PRICE_MULTIPLIERS } from "@/data/pricingConfig";

export function getPrice(planId) {
    const multiplier = PRICE_MULTIPLIERS[planId];

    if (!multiplier) return "0";

    const price = USD_PRICE * multiplier;

    return price.toLocaleString("fa-IR");
}
