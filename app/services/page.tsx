import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تعرفه خدمات کندو — بومیم",
  description: "تعرفه‌های کندو برای ۳ ماه دوم ۱۴۰۵",
};

function toFa(n: number | string) {
  const s = String(n);
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  return s.replace(/\d/g, (d) => fa[Number(d)]);
}

export default function ServicesPage() {
  return (
    <main className="w-full min-h-[100dvh] bg-[#0a0a0a] px-4 md:px-6 py-8 md:py-10">
      <div className="w-full max-w-[980px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-full px-3.5 py-1.5 text-[11px] font-bold text-[#ffdf00] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffdf00] animate-pulse" />
            کندو • ۳ ماه دوم ۱۴۰۵
          </div>
          <h1 className="text-[26px] md:text-[32px] font-black tracking-tight text-white mt-4" style={{ letterSpacing: "-0.03em" }}>
            تعرفه‌های کندو
          </h1>
          <p className="text-[12px] md:text-[13px] text-[#9a9a9a] mt-2">
            مدت زمان راش محاسبه می‌شود • یک اصلاحیه رایگان
          </p>
        </div>

        {/* Short video - 3 tiers */}
        <div className="mb-6">
          <h2 className="text-[13px] font-black text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#ffdf00]" />
            ادیت ویدیوی کوتاه
            <span className="text-[11px] font-medium text-[#666] mr-2">محاسبه بر اساس هر دقیقه راش</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "اقتصادی", price: "۱.۴", sub: "میلیون", per: "/ دقیقه", desc: "کات و تدوین پایه" },
              { label: "پیشرفته", price: "۲.۳", sub: "میلیون", per: "/ دقیقه", desc: "تدوین حرفه‌ای + افکت", popular: true },
              { label: "موشن‌دار", price: "۳.۲", sub: "میلیون", per: "/ دقیقه", desc: "با گرافیک و موشن" },
            ].map((c) => (
              <div
                key={c.label}
                className={`relative bg-[#141414] border rounded-[20px] p-5 flex flex-col text-center ${
                  (c as any).popular ? "border-[#ffdf00]/40 shadow-[0_0_20px_rgba(255,223,0,0.08)]" : "border-[#2a2a2a]"
                }`}
              >
                {(c as any).popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#ffdf00] text-[#0a0a0a] text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                    پرطرفدار
                  </span>
                )}
                <div className="text-[13px] font-black text-white">{c.label}</div>
                <div className="text-[11px] text-[#888] mt-1">{c.desc}</div>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-[26px] font-black tracking-tight text-[#ffdf00]">{c.price}</span>
                  <span className="text-[11px] font-bold text-[#ffdf00]/80">{c.sub}</span>
                  <span className="text-[11px] text-[#666] mr-1">{c.per}</span>
                </div>
                <div className="text-[10px] text-[#555] mt-1">{toFa(c.price.replace(".", ""))}۰۰۰ تومان / دقیقه</div>
              </div>
            ))}
          </div>
        </div>

        {/* Teaser + Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-[20px] p-6 flex flex-col">
            <div className="text-[13px] font-black text-white">تیزر تبلیغاتی</div>
            <div className="text-[11px] text-[#888] mt-1">تا سقف ۴۵ ثانیه</div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[26px] font-black tracking-tight text-white">{toFa("4.4")}</span>
              <span className="text-[11px] font-bold text-white/60">میلیون تومان</span>
            </div>
            <div className="text-[11px] text-[#666] mt-1">۴,۴۰۰,۰۰۰ تومان / پروژه</div>
            <div className="mt-3 inline-flex self-start bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1 text-[11px] font-bold text-[#9a9a9a]">تا ۴۵ ثانیه</div>
          </div>
          <div className="bg-[#141414] border border-[#ffdf00]/20 rounded-[20px] p-6 flex flex-col">
            <div className="text-[13px] font-black text-white">طراحی موشن گرافیک ۲.۵ بعدی</div>
            <div className="text-[11px] text-[#888] mt-1">هر ۳۰ ثانیه</div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[26px] font-black tracking-tight text-[#ffdf00]">{toFa("8.6")}</span>
              <span className="text-[11px] font-bold text-[#ffdf00]/80">میلیون تومان</span>
            </div>
            <div className="text-[11px] text-[#666] mt-1">۸,۶۰۰,۰۰۰ تومان / ۳۰ ثانیه</div>
            <div className="mt-3 inline-flex self-start bg-[#ffdf00] text-[#0a0a0a] rounded-full px-3 py-1 text-[11px] font-black">۳۰ ثانیه</div>
          </div>
        </div>

        {/* Course */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-[20px] overflow-hidden">
          <div className="px-5 md:px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-[13px] font-black text-white">دوره آموزشی</div>
              <div className="text-[11px] text-[#888] mt-0.5">محاسبه بر اساس مجموع ساعات راش • هرچه دوره طولانی‌تر، قیمت هر ساعت کمتر</div>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-[#ffdf00] bg-[#ffdf00]/10 border border-[#ffdf00]/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffdf00]" />
              به ازای هر یک ساعت
            </div>
          </div>
          <div className="border-t border-[#2a2a2a] overflow-x-auto">
            <table className="w-full text-[12px] min-w-[520px]">
              <thead>
                <tr className="bg-[#0a0a0a] text-[#9a9a9a] text-[11px]">
                  <th className="text-right font-bold px-5 py-3">مدت دوره</th>
                  <th className="text-center font-bold px-3 py-3">قیمت هر ساعت</th>
                  <th className="text-left font-bold px-5 py-3 hidden md:table-cell">توضیح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {[
                  { range: "۱ تا ۲ ساعت", price: "۱,۶۰۰,۰۰۰", note: "دوره کوتاه" },
                  { range: "۳ تا ۵ ساعت", price: "۱,۴۰۰,۰۰۰", note: "دوره متوسط", popular: true },
                  { range: "۶ تا ۱۰ ساعت", price: "۱,۲۰۰,۰۰۰", note: "دوره بلند" },
                  { range: "بالای ۱۰ ساعت", price: "۱,۰۰۰,۰۰۰", note: "دوره جامع" },
                ].map((r) => (
                  <tr key={r.range} className={(r as any).popular ? "bg-[#ffdf00]/5" : "bg-transparent"}>
                    <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">
                      {r.range}
                      {(r as any).popular && <span className="mr-2 bg-[#ffdf00] text-[#0a0a0a] text-[9px] font-black px-1.5 py-0.5 rounded">به‌صرفه</span>}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="font-black text-[#ffdf00]">{r.price}</span>
                      <span className="text-[#666] mr-1 text-[11px]">تومان</span>
                    </td>
                    <td className="px-5 py-3.5 text-left text-[#888] text-[11px] hidden md:table-cell">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 md:px-6 py-3 bg-[#0a0a0a]/50 border-t border-[#2a2a2a] flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]">
            <span className="text-[#666]">مدت زمان راش محاسبه می‌شود</span>
            <span className="text-[#9a9a9a]">مثال: دوره ۴ ساعته = ۴ × ۱,۴۰۰,۰۰۰ = ۵,۶۰۰,۰۰۰ تومان</span>
          </div>
        </div>

        {/* Free revision + footer */}
        <div className="mt-5 flex flex-col md:flex-row gap-3">
          <div className="flex-1 bg-[#141414] border border-[#11ffba]/20 rounded-2xl px-5 py-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#11ffba]/15 border border-[#11ffba]/20 flex items-center justify-center text-[#11ffba] text-[13px] font-black">✓</span>
            <div>
              <div className="text-[12px] font-bold text-white">یک اصلاحیه رایگان</div>
              <div className="text-[11px] text-[#888]">برای هر پروژه یک بار اصلاح بدون هزینه</div>
            </div>
          </div>
          <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-2xl px-5 py-4">
            <div className="text-[11px] font-bold text-[#9a9a9a]">نکته</div>
            <div className="text-[11px] leading-5 text-[#666] mt-1">قیمت‌ها برای ۳ ماه دوم ۱۴۰۵ معتبر است. برای برآورد دقیق پروژه ترکیبی از ماشین‌حساب استفاده کنید.</div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-[#555]">بومیم — bumims.ir • کندو</div>
      </div>
    </main>
  );
}
