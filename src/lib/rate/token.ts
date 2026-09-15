import { cookies } from "next/headers";

/**
 * Page-load token for the Rate Guide submission throttle.
 *
 * The token cookie records when the form page was rendered. A submission is
 * rejected unless the cookie is at least MIN_DELAY_MS old, and the cookie is
 * rotated on every successful submission — so flooding requires a fresh page
 * render plus a human-scale delay each time. It is httpOnly so client script
 * (and trivial bots) cannot forge an old timestamp.
 *
 * Issuing happens in the `/api/rate-token` Route Handler (cookies may only be
 * *set* from a Server Action or Route Handler, never during render); the form
 * fetches it on mount.
 */

export const RATE_TOKEN_COOKIE = "rate_guide_token";
export const MIN_DELAY_MS = 3000;

export async function issueRateToken(): Promise<void> {
  const store = await cookies();
  store.set(RATE_TOKEN_COOKIE, `${crypto.randomUUID()}.${Date.now()}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
}

/** True when the token is old enough; rotates it so the next submit waits. */
export async function consumeRateToken(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(RATE_TOKEN_COOKIE)?.value;
  if (!raw) return false;
  const issuedAt = Number(raw.split(".").pop());
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt < MIN_DELAY_MS) return false;
  await issueRateToken();
  return true;
}
