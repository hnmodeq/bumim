// Shared definition of services and pricing plans.
// This drives both the public pricing UI and the admin price editor.

export interface Plan {
  id: string;
  name: string;
  limit: string;
  features: string[];
}

export interface Service {
  id: string;
  label: string;
  categoryKey: string;
  portfolioTab: string;
  plans: Plan[];
}

export const services: Service[] = [
  {
    id: "short",
    label: "ادیت ویدیوی کوتاه",
    categoryKey: "short-video-edit",
    portfolioTab: "short-video-edit",
    plans: [
      {
        id: "shorteco",
        name: "اقتصادی",
        limit: "هر 60 ثانیه",
        features: [
          "راف کات",
          "حذف سکوت بین کلمات",
          "موزیک",
          "زیرنویس",
          "حذف نویز صدا",
          "تنظیم رنگ اولیه",
          "درج لوگو",
          "لوگو پایانی ویدیو",
        ],
      },
      {
        id: "shortadvanced",
        name: "پیشرفته",
        limit: "هر 60 ثانیه",
        features: [
          "همه موارد اقتصادی",
          "درجه‌بندی رنگ",
          "صداسازی",
          "تصاویر مکمل",
          "موشن گرافیک",
          "افکت‌های تصویری",
          "ترنزیشن‌",
          "طراحی هوک",
        ],
      },
    ],
  },
  {
    id: "long",
    label: "ادیت ویدیوی بلند",
    categoryKey: "long-video-edit",
    portfolioTab: "long-video-edit",
    plans: [
      {
        id: "roughcut",
        name: "ساده",
        limit: "هر 60 ثانیه",
        features: [
          "راف کات",
          "موزیک",
          "حذف نویز صدا",
          "تنظیم رنگ اولیه",
          "درج لوگو",
          "لوگو پایانی ویدیو",
        ],
      },
      {
        id: "typography",
        name: "تایپوگرافی",
        limit: "هر 60 ثانیه",
        features: [
          "همه موارد اقتصادی",
          "درجه‌بندی رنگ",
          "صداسازی",
          "تصاویر مکمل",
          "تایپوگرافی",
        ],
      },
    ],
  },
  {
    id: "motion",
    label: "طراحی موشن گرافیک",
    categoryKey: "motion-graphic-design",
    portfolioTab: "motion-graphic-design",
    plans: [
      {
        id: "motionstandard",
        name: "استاندارد",
        limit: "هر 30 ثانیه",
        features: [
          "دوربین مجازی",
          "رئالیسم متریال",
          "سناریونویسی",
          "استوری برد",
          "نریشن اختصاصی",
          "تایپوگرافی اختصاصی",
          "صداسازی",
          "افکت‌های تصویری",
          "ترنزیشن",
        ],
      },
      {
        id: "motionadvanced",
        name: "پیشرفته",
        limit: "هر 30 ثانیه",
        features: [
          "همه موارد استاندارد",
          "استفاده از کاراکتر",
          "لوکیشن دو و نیم",
          "دوربین سه بعدی",
          "مشاوره",
        ],
      },
    ],
  },
  {
    id: "graphic",
    label: "طراحی گرافیک",
    categoryKey: "graphic-design",
    portfolioTab: "graphic-design",
    plans: [
      {
        id: "story",
        name: "استوری",
        limit: "هر اسلاید",
        features: [
          "حفظ هویت بصری",
          "طراحی طبق اصول برند",
          "طراحی ماثر و هدفمند",
        ],
      },
      {
        id: "production",
        name: "کاور ویدیو",
        limit: "هر اسلاید",
        features: [
          "حفظ هویت بصری",
          "طراحی طبق اصول برند",
          "حفظ یک‌پارچگی",
        ],
      },
    ],
  },
  {
    id: "narration",
    label: "نریشن",
    categoryKey: "narration-voice",
    portfolioTab: "narration-voice",
    plans: [
      {
        id: "hatami",
        name: "عطیه حاتمی",
        limit: "هر 60 ثانیه",
        features: [
          "گوینده حرفه‌ای با بیش از ۵ سال تجربه کاری در زمینه گویندگی",
        ],
      },
    ],
  },
];

// Default base price (in Toman) and per-plan multipliers.
export const DEFAULT_BASE_PRICE = 180000;

export const DEFAULT_MULTIPLIERS: Record<string, number> = {
  shorteco: 6,
  shortadvanced: 8,
  roughcut: 5,
  typography: 7,
  motionstandard: 40,
  motionadvanced: 90,
  story: 4,
  production: 4,
  hatami: 8,
};

export function formatToman(value: number): string {
  return value.toLocaleString("fa-IR");
}
