import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://twgkphwmbjtrjftsitxt.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, telegramOrId, serviceName, packageName, packagePrice, note } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, error: "نام و شماره تماس الزامی است." },
        { status: 400 }
      );
    }

    const persianDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date());

    // 1. Send via Telegram Bot API if configured
    let telegramSent = false;
    let telegramError = "";

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const messageText = `🔔 *درخواست سفارش جدید در بومیم*\n\n` +
        `👤 *نام مشتری:* ${name}\n` +
        `📞 *شماره تماس:* \`${phone}\`\n` +
        (telegramOrId ? `💬 *آیدی تلگرام / ایتا:* @${telegramOrId.replace(/^@/, "")}\n` : "") +
        `🎬 *دسته‌بندی:* ${serviceName || "سفارش کلی"}\n` +
        `⭐ *پکیج:* ${packageName || "ثبت نشده"}\n` +
        `💰 *تعرفه:* ${packagePrice || "ثبت نشده"}\n` +
        (note ? `📝 *توضیحات:* ${note}\n` : "") +
        `\n⏰ *زمان ثبت:* ${persianDate}`;

      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: messageText,
            parse_mode: "Markdown",
          }),
        });
        const tgJson = await tgRes.json();
        if (tgJson.ok) {
          telegramSent = true;
        } else {
          telegramError = tgJson.description || "خطای ارسال به تلگرام";
        }
      } catch (err) {
        telegramError = (err as Error)?.message || "ارتباط با تلگرام برقرار نشد";
      }
    }

    // 2. Persist order in Supabase if table exists
    if (SUPABASE_SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            "content-type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            customer_name: name,
            customer_phone: phone,
            customer_telegram: telegramOrId || null,
            service_name: serviceName || null,
            package_name: packageName || null,
            package_price: packagePrice || null,
            notes: note || null,
            created_at: new Date().toISOString(),
          }),
        });
      } catch {
        // non-blocking if table is not yet created
      }
    }

    return NextResponse.json({
      ok: true,
      telegramSent,
      telegramError: telegramSent ? null : telegramError,
      message: "درخواست شما با موفقیت ثبت شد.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error)?.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
