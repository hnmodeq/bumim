import { NextResponse } from "next/server";
import { issueRateToken } from "@/lib/rate/token";

/**
 * Mints the Rate Guide page-load token (httpOnly cookie) used by the
 * submission throttle. Called by the submission form on mount.
 */
export async function GET() {
  await issueRateToken();
  return new NextResponse(null, { status: 204 });
}
