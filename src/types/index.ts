/**
 * Shared TypeScript types that are not tied to the database.
 *
 * Domain types for the application layer (API results, DTOs, etc.) belong
 * here. Database types live in ./database.types.ts (generated).
 */

/** Uniform result type returned by Server Actions and Route Handlers. */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        fields?: Record<string, string[] | undefined>;
      };
    };
