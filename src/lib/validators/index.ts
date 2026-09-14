/**
 * Validation schemas — one module per domain entity, all using Zod.
 *
 * The same schema is used in two places:
 *  1. Server Actions / Route Handlers  → authoritative, security boundary.
 *  2. Client forms (react-hook-form)   → UX-only convenience validation.
 *
 * Re-export domain schemas here as they are added in later phases.
 */

export { moneySchema, tomanSchema } from "@/lib/money";
