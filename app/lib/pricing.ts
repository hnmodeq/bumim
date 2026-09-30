// Single source of truth for the /services pricelist + /admin panel.
export type Package = {
  id: string;
  name: string;
  price: string;
  per: string;
  popular?: boolean;
  features: string[];
  color: string;
};

export type Service = {
  id: string;
  name: string;
  packages: Package[];
};

export const featureNames = [
  "کات و تدوین پایه",
  "اصلاح رنگ",
  "میکس و مسترینگ صدا",
  "افکت و موشن",
  "خروجی و تحویل",
];

export const colorOptions = [
  "from-[#7c3aed] to-[#4f46e5]",
  "from-[#f97316] to-[#eab308]",
  "from-[#06b6d4] to-[#10b981]",
  "from-[#ec4899] to-[#f43f5e]",
  "from-[#8b5cf6] to-[#ec4899]",
  "from-[#6366f1] to-[#8b5cf6]",
  "from-[#f59e0b] to-[#f97316]",
  "from-[#10b981] to-[#06b6d4]",
  "from-[#ef4444] to-[#ec4899]",
];

export const TELEGRAM_SUPPORT_USERNAME = "bumimsupport";

export const defaultServices: Service[] = [
  {
    id: "short",
    name: "ادیت ویدیوی کوتاه",
    packages: [
      { id: "eco", name: "اقتصادی", price: "۱.۴", per: "میلیون / دقیقه", features: ["کات و تدوین پایه", "اصلاح رنگ اولیه", "میکس صدا ساده", "—", "—"], color: "from-[#7c3aed] to-[#4f46e5]" },
      { id: "pro", name: "پیشرفته", price: "۲.۳", per: "میلیون / دقیقه", popular: true, features: ["کات و تدوین پایه", "اصلاح رنگ حرفه‌ای", "میکس و مسترینگ صدا", "افکت صوتی", "—"], color: "from-[#f97316] to-[#eab308]" },
      { id: "motion", name: "موشن‌دار", price: "۳.۲", per: "میلیون / دقیقه", features: ["کات و تدوین پایه", "اصلاح رنگ حرفه‌ای", "میکس و مسترینگ", "موشن گرافیک سبک", "افکت تصویری"], color: "from-[#06b6d4] to-[#10b981]" },
    ],
  },
  {
    id: "teaser",
    name: "تیزر و موشن",
    packages: [
      { id: "teaser", name: "تیزر تبلیغاتی", price: "۴.۴", per: "تا ۴۵ ثانیه", features: ["سناریو کوتاه", "تدوین ریتمیک", "موزیک و افکت", "اصلاح رنگ", "لوگو موشن"], color: "from-[#ec4899] to-[#f43f5e]" },
      { id: "motion25", name: "موشن ۲.۵ بعدی", price: "۸.۶", per: "/ ۳۰ ثانیه", popular: true, features: ["طراحی وکتور", "انیمیت ۲.۵ بعدی", "موزیک اختصاصی", "صداگذاری", "خروجی 4K"], color: "from-[#8b5cf6] to-[#ec4899]" },
    ],
  },
  {
    id: "course",
    name: "دوره آموزشی",
    packages: [
      { id: "c1", name: "۱ تا ۲ ساعت", price: "۱.۶", per: "میلیون / ساعت", features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "—"], color: "from-[#6366f1] to-[#8b5cf6]" },
      { id: "c2", name: "۳ تا ۵ ساعت", price: "۱.۴", per: "میلیون / ساعت", popular: true, features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "کاور ویدیو"], color: "from-[#f59e0b] to-[#f97316]" },
      { id: "c3", name: "۶ تا ۱۰ ساعت", price: "۱.۲", per: "میلیون / ساعت", features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "کاور + اینترو"], color: "from-[#10b981] to-[#06b6d4]" },
      { id: "c4", name: "بالای ۱۰ ساعت", price: "۱", per: "میلیون / ساعت", features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "پشتیبانی کامل"], color: "from-[#ef4444] to-[#ec4899]" },
    ],
  },
];
