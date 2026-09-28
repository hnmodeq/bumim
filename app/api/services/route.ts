import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Supabase project (public by design — anon key only reads, RLS blocks writes).
const SUPABASE_URL = process.env.SUPABASE_URL || "https://twgkphwmbjtrjftsitxt.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Z2twaHdtYmp0cmpmdHNpdHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODY1MjEsImV4cCI6MjEwNjE2MjUyMX0.-e-ATHAfaxC6UHBKT-5bbzImhGcvzcj05qlNrQvUHHg";
// Service-role key: only on the server, never sent to the browser. Needed for writes.
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Password that unlocks /admin saving. If unset, saving is disabled (safe default).
const ADMIN_KEY = process.env.ADMIN_PANEL_KEY || "";

async function readPricing(): Promise<unknown[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pricing?select=data&id=eq.1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { data: unknown[] }[];
    const data = rows?.[0]?.data;
    return Array.isArray(data) && data.length ? data : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const services = await readPricing();
  return NextResponse.json({ ok: true, services });
}

export async function POST(req: NextRequest) {
  if (!ADMIN_KEY) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PANEL_KEY env is not set on the server — saving is disabled" },
      { status: 503 },
    );
  }
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ ok: false, error: "wrong admin key" }, { status: 401 });
  }
  if (!SUPABASE_SERVICE_KEY) {
    return NextResponse.json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY env is not set on the server — cannot write" },
      { status: 503 },
    );
  }

  let body: { services?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const services = body?.services;
  if (!Array.isArray(services)) {
    return NextResponse.json({ ok: false, error: "services must be an array" }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/pricing`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "content-type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    // updated_at must be sent explicitly — PostgREST upsert only touches given columns
    body: JSON.stringify({ id: 1, data: services, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ ok: false, error: `supabase write failed: ${res.status} ${text}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
