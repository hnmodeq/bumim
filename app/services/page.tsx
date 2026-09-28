import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تعرفه خدمات — بومیم",
  description: "لیست قیمت خدمات تدوین ویدیو - بومیم",
};

const services = [
  {
    label: "ریلز اینستاگرامی",
    price: 888_000,
    desc: "ویدیوی کوتاه عمودی برای اینستاگرام",
    popular: true,
  },
  {
    label: "ویدیو بلند یوتوبی",
    price: 1_068_000,
    desc: "ویدیوی افقی بلند برای یوتوب",
    popular: false,
  },
  {
    label: "ویدیوی موزیکال",
    price: 1_266_000,
    desc: "تدوین هماهنگ با ریتم موزیک",
    popular: false,
  },
  {
    label: "تیزر تبلیغاتی",
    price: 1_166_667,
    desc: "تیزر کوتاه و تاثیرگذار",
    popular: true,
  },
  {
    label: "موشن گرافیک ۲ بعدی",
    price: 1_498_000,
    desc: "انیمیش و گرافیک دوبعدی",
    popular: false,
  },
  {
    label: "موشن گرافیک ۲.۵ بعدی",
    price: 1_928_000,
    desc: "موشن پیشرفته با عمق",
    popular: false,
  },
  {
    label: "دوره آموزشی",
    price: 1_718_000,
    desc: "تدوین دوره و محتوای آموزشی",
    popular: false,
  },
];

function toFaPrice(n: number) {
  const s = Math.round(n).toLocaleString("en-US");
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  return s.replace(/\d/g, (d) => fa[Number(d)]);
}

export default function ServicesPage() {
  return (
    <main className="w-full min-h-[100dvh] bg-[#0a0a0a] px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-[980px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-[28px] md:text-[36px] font-black tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
            تعرفه خدمات
          </h1>
          <p className="text-[13px] md:text-[14px] text-[#9a9a9a] mt-2">
            قیمت پایه برای هر پروژه • بدون احتساب خدمات اضافی
          </p>
          <div className="mt-4 h-[2px] w-16 mx-auto rounded-full bg-[#ffdf00]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {services.map((s) => (
            <div
              key={s.label}
              className={`relative bg-[#141414] border rounded-[20px] p-5 md:p-6 flex flex-col ${
                s.popular ? "border-[#ffdf00]/40 shadow-[0_0_20px_rgba(255,223,0,0.08)]" : "border-[#2a2a2a]"
              }`}
            >
              {s.popular && (
                <span className="absolute -top-2.5 right-4 bg-[#ffdf00] text-[#0a0a0a] text-[10px] font-black px-2.5 py-1 rounded-full tracking-wide">
                  پرطرفدار
                </span>
              )}
              <div className="text-[13px] font-bold text-[#9a9a9a] mb-1">{s.desc}</div>
              <div className="text-[16px] md:text-[17px] font-black text-white leading-none mb-4">{s.label}</div>
              <div className="mt-auto flex items-baseline gap-2">
                <span className="text-[11px] text-[#666] font-medium">از</span>
                <span className="text-[22px] md:text-[24px] font-black tracking-tight text-[#ffdf00]" style={{ letterSpacing: "-0.03em" }}>
                  {toFaPrice(s.price)}
                </span>
                <span className="text-[12px] font-bold text-white/70">تومان</span>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 md:mt-10 bg-[#141414] border border-[#2a2a2a] rounded-2xl px-5 py-4">
          <p className="text-[11px] md:text-[12px] leading-6 text-[#9a9a9a] text-center">
            * قیمت‌های فوق برای پروژه با مدت زمان ۴۵ ثانیه و بدون خدمات اضافی است.
            <br className="hidden md:block" />
            هزینه نهایی با توجه به مدت زمان، تعداد ویدیو و خدمات انتخابی متغیر خواهد بود.
          </p>
        </div>

        {/* Footer mini */}
        <div className="mt-8 text-center text-[10px] text-[#555]">
          بومیم — bumims.ir
        </div>
      </div>
    </main>
  );
}
