import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Try fetching live Tether/USD rate in Tomans from multiple Iranian crypto/currency APIs
  const sources = [
    {
      name: "Nobitex",
      url: "https://api.nobitex.ir/market/stats",
      parse: (data: any) => {
        const val = data?.stats?.["usdt-rls"]?.latest;
        if (val) return Math.round(Number(val) / 10); // Rials to Tomans
        return null;
      },
    },
    {
      name: "Wallex",
      url: "https://api.wallex.ir/v1/currencies/stats",
      parse: (data: any) => {
        const usdt = data?.result?.find?.((c: any) => c.key === "USDT" || c.symbol === "USDTTMN");
        if (usdt?.price) return Math.round(Number(usdt.price));
        return null;
      },
    },
    {
      name: "Tetherland",
      url: "https://api.tetherland.com/currencies",
      parse: (data: any) => {
        const t = data?.data?.currencies?.USDT;
        if (t?.price) return Math.round(Number(t.price));
        return null;
      },
    },
  ];

  for (const src of sources) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(src.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Bumim/1.0)" },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const price = src.parse(json);
        if (price && price > 10000) {
          return NextResponse.json({
            ok: true,
            rate: price,
            source: src.name,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch {
      // try next source
    }
  }

  // Fallback default USD rate if all external APIs are blocked/timeout
  return NextResponse.json({
    ok: true,
    rate: 100000,
    source: "default",
    updatedAt: new Date().toISOString(),
  });
}
