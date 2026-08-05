const container = `w-full px-5 mt-15 md:px-20 lg:px-25 xl:px-30 2xl:px-100`;
const wrapper = `space-y-3`;
const title = `text-[length:var(--font-size-small)] text-[var(--font-color-third)]`;
const description = `text-justify leading-relaxed text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const list = `space-y-1 p-10 md:space-y-5 lg:space-y-1 xl:space-y-5 rounded-[var(--rounded-small)] border-[var(--border-main)] bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] shadow-[var(--shadow-small)] list-disc marker:text-[var(--font-color-third)]`;
const item = `leading-7 text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] text-justify transition-colors duration-200 hover:text-[var(--font-color-secondary)]`;

const terms = [
  "یک مرحله اصلاحیه جهت رفع ایرادات فنی یا جزئی به‌صورت رایگان انجام می‌شود.",
  "از مرحله دوم به بعد، هر اصلاحیه شامل ۲۰٪ افزایش نسبت به دستمزد توافق‌شده پروژه خواهد بود.",
  "در صورت سپردن پروژه به صورت فورس 20% بر روی تعرفه فعلی اضافه میشود.",
  "تغییرات اساسی در سناریو، استایل، ساختار یا مدت زمان خروجی، اصلاحیه محسوب نشده و به‌عنوان هزینه جداگانه محاسبه می‌گردد.",
  "با توجه به شرایط اقتصادی و نوسانات بازار، تعرفه‌ها به‌صورت مقطعی تعیین شده و امکان تغییر آن‌ها وجود دارد. مبلغی که در شروع پروژه توافق میشود لحاظ میگردد.",
  "مدت زمان تحویل پروژه بر اساس حجم کار و توافق اولیه مشخص می‌شود. تأخیر در ارسال متریال یا بازخورد از سوی کارفرما، موجب تغییر در زمان تحویل خواهد شد.",
  "شروع پروژه پس از واریز پیش‌پرداخت انجام می‌شود و تسویه نهایی پیش از تحویل فایل خروجی نهایی صورت می‌گیرد.",
  "پس از تسویه کامل، حق استفاده از خروجی نهایی به کارفرما منتقل می‌شود.",
  "ثبت و انتشار پروژه‌ها به عنوان نمونه کارهای بومیم با حفظ حقوق کارفرما مجاز است، مگر اینکه به‌صورت کتبی توافق دیگری انجام شده باشد.",
];

export default function Terms() {
  return (
    <main className={container}>
      <div className={wrapper}>
        <h1 className={title}>شرایط همکاری</h1>
        <p className={description}>
          شروع همکاری با تیم بومیم به معنای پذیرش شرایط موارد زیر است؛ که برای حفظ
          کیفیت و شفافیت در همکاری تهیه شده است.
        </p>
        <ul className={list}>
          {terms.map((t, i) => (
            <li key={i} className={item}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
