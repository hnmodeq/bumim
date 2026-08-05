import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPricing, updatePricing } from "@/lib/pricing";

// Public — the site reads pricing with this.
export async function GET() {
  const pricing = await getPricing();
  return NextResponse.json(pricing);
}

// Protected — only logged-in admins can change prices.
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { basePrice?: number; multipliers?: Record<string, number> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.basePrice != null && (!Number.isFinite(body.basePrice) || body.basePrice < 0)) {
    return NextResponse.json(
      { error: "basePrice must be a non-negative number" },
      { status: 400 }
    );
  }

  try {
    const pricing = await updatePricing(body);
    return NextResponse.json(pricing);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to update pricing" },
      { status: 500 }
    );
  }
}
