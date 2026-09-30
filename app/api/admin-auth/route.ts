import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = body?.password;
    const ADMIN_KEY = process.env.ADMIN_PANEL_KEY || "asdasd123";

    if (!password || password.trim() !== ADMIN_KEY.trim()) {
      return NextResponse.json(
        { ok: false, error: "رمز عبور وارد شده نادرست است." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error)?.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
