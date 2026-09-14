/**
 * Maps Supabase Auth errors to a small set of UI-facing error keys so the
 * client can render localized messages. Keys resolve to `auth.errors.*`.
 */

export type AuthErrorKey =
  | "invalidCredentials"
  | "emailExists"
  | "usernameTaken"
  | "emailNotConfirmed"
  | "passwordWeak"
  | "verificationExpired"
  | "sessionExpired"
  | "rateLimited"
  | "samePassword"
  | "invalidInput"
  | "generic";

/** Inspect a Supabase Auth error and return a stable UI error key. */
export function authErrorKey(err: unknown): AuthErrorKey {
  const code = (err as { code?: string } | null)?.code;
  const msg = String((err as { message?: string } | null)?.message ?? "").toLowerCase();

  if (code === "invalid_credentials" || msg.includes("invalid login credentials")) {
    return "invalidCredentials";
  }
  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    msg.includes("already registered") ||
    msg.includes("already been registered") ||
    msg.includes("already exists")
  ) {
    return "emailExists";
  }
  if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
    return "emailNotConfirmed";
  }
  if (code === "weak_password" || msg.includes("password should be") || msg.includes("too weak")) {
    return "passwordWeak";
  }
  if (
    code === "otp_expired" ||
    code === "otp_invalid" ||
    msg.includes("token has expired") ||
    msg.includes("token is invalid")
  ) {
    return "verificationExpired";
  }
  if (
    code === "session_not_found" ||
    code === "session_expired" ||
    msg.includes("auth session missing") ||
    msg.includes("session expired")
  ) {
    return "sessionExpired";
  }
  if (
    code === "same_password" ||
    msg.includes("same password") ||
    msg.includes("different from the old password")
  ) {
    return "samePassword";
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    msg.includes("rate limit")
  ) {
    return "rateLimited";
  }
  if (code === "validation_failed" || msg.includes("invalid email")) {
    return "invalidInput";
  }
  return "generic";
}
