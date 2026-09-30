export type PickerOption = { label: string; factor?: number; base?: number };

export const typeOptions: PickerOption[] = [
  { label: "ریلز اینستاگرامی", base: 888_000 },
  { label: "ویدیو بلند یوتوبی", base: 1_068_000 },
  { label: "ویدیوی موزیکال", base: 1_266_000 },
  { label: "تیزر تبلیغاتی", base: 1_166_667 },
  { label: "موشن گرافیک ۲ بعدی", base: 1_498_000 },
  { label: "موشن گرافیک ۲.۵ بعدی", base: 1_928_000 },
  { label: "دوره آموزشی", base: 1_718_000 },
];

export const durationOptions: PickerOption[] = [
  { label: "ثانیه ۱۰", factor: 0.62 },
  { label: "ثانیه ۱۵", factor: 0.78 },
  { label: "ثانیه ۳۰", factor: 0.90 },
  { label: "ثانیه ۴۵", factor: 1.0 },
  { label: "ثانیه ۶۰", factor: 1.27 },
  { label: "دقیقه ۲", factor: 1.94 },
  { label: "دقیقه ۳", factor: 2.4 },
  { label: "دقیقه ۴", factor: 2.85 },
  { label: "دقیقه ۵", factor: 3.25 },
  { label: "دقیقه ۱۵", factor: 5.5 },
  { label: "دقیقه ۳۰", factor: 8.0 },
  { label: "دقیقه ۶۰", factor: 11.5 },
  { label: "ساعت ۲", factor: 16 },
  { label: "ساعت ۳", factor: 20 },
  { label: "ساعت ۴", factor: 23 },
  { label: "ساعت ۵", factor: 26 },
  { label: "ساعت ۶", factor: 29 },
  { label: "ساعت ۷", factor: 32 },
  { label: "ساعت ۸", factor: 35 },
  { label: "ساعت ۹", factor: 38 },
  { label: "ساعت ۱۰", factor: 41 },
  { label: "ساعت ۱۵", factor: 52 },
  { label: "ساعت ۲۰", factor: 62 },
  { label: "ساعت ۳۰", factor: 80 },
  { label: "ساعت ۴۰", factor: 96 },
  { label: "ساعت ۵۰", factor: 112 },
  { label: "ساعت ۷۵", factor: 145 },
  { label: "ساعت ۱۰۰", factor: 175 },
  { label: "ساعت ۲۵۰", factor: 320 },
  { label: "ساعت ۵۰۰", factor: 520 },
  { label: "ساعت ۷۵۰", factor: 680 },
  { label: "ساعت ۱۰۰۰", factor: 820 },
];

export const countOptions: PickerOption[] = [
  { label: "ویدیو ۱", factor: 1.0 },
  { label: "ویدیو ۲", factor: 1.85 },
  { label: "ویدیو ۳", factor: 2.65 },
  { label: "ویدیو ۴", factor: 3.35 },
  { label: "ویدیو ۵", factor: 4.0 },
  { label: "ویدیو ۶", factor: 4.65 },
  { label: "ویدیو ۷", factor: 5.25 },
  { label: "ویدیو ۸", factor: 5.85 },
  { label: "ویدیو ۹", factor: 6.40 },
];

export const countMultiplier: Record<string, number> = {
  "ویدیو ۱": 0.90,
  "ویدیو ۲": 0.96,
  "ویدیو ۳": 1.02,
  "ویدیو ۴": 1.11,
  "ویدیو ۵": 1.20,
  "ویدیو ۶": 1.32,
  "ویدیو ۷": 1.44,
  "ویدیو ۸": 1.56,
  "ویدیو ۹": 1.68,
};

export type Service = {
  id: string;
  label: string;
  percent: number;
};

export function hashPercent(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 33 + id.charCodeAt(i)) >>> 0;
  }
  h = (h ^ (h >>> 16)) >>> 0;
  return 6 + (h % 13);
}

export const basicServices: Service[] = [
  { id: "rough_cut", label: "راف کات", percent: hashPercent("rough_cut") },
  { id: "logo", label: "درج لوگو", percent: hashPercent("logo") },
  { id: "music", label: "موزیک", percent: hashPercent("music") },
  { id: "subtitle", label: "زیرنویس", percent: hashPercent("subtitle") },
  { id: "transition", label: "ترنزیشن", percent: hashPercent("transition") },
  { id: "intro_outro", label: "اینترو / آترو", percent: hashPercent("intro_outro") },
];

export const advancedServices: Service[] = [
  { id: "sfx", label: "افکت صوتی", percent: hashPercent("sfx") },
  { id: "vfx", label: "افکت تصویری", percent: hashPercent("vfx") },
  { id: "motion_light", label: "موشن گرافیک سبک", percent: hashPercent("motion_light") },
  { id: "motion_heavy", label: "موشن گرافیک سنگین", percent: hashPercent("motion_heavy") },
  { id: "rotoscope", label: "روتوسکپی", percent: hashPercent("rotoscope") },
  { id: "color", label: "اصلاح رنگ", percent: hashPercent("color") },
  { id: "typo", label: "تایپوگرافی", percent: hashPercent("typo") },
  { id: "overlay", label: "اورلی", percent: hashPercent("overlay") },
  { id: "mastering", label: "مسترینگ صدا", percent: hashPercent("mastering") },
];

export type TurnaroundSpeed = "standard" | "fast" | "rush";
export type EditorLevel = "junior" | "mid" | "senior";

export type InvoiceItem = {
  id: string;
  typeLabel: string;
  durationLabel: string;
  countLabel: string;
  services: { label: string; percent: number }[];
  speedLabel?: string;
  levelLabel?: string;
  subtotal: number;
  totalPercent: number;
  total: number;
};

export function toPersianNumber(num: number | string) {
  const latin = typeof num === "number" ? num.toLocaleString("en-US") : String(num);
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return latin.replace(/\d/g, (d) => persianDigits[Number(d)]);
}

export function toPersianPrice(num: number) {
  const latin = Math.round(num).toLocaleString("en-US");
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return latin.replace(/\d/g, (d) => persianDigits[Number(d)]);
}

export const INVOICE_STORAGE_KEY = "bumim_invoice_items";
export const PAGE_VISIBILITY_STORAGE_KEY = "bumim_page_visibility";

export type PageVisibility = Record<string, boolean>;

export const defaultPageVisibility: PageVisibility = {
  home: true,
  calculator: true,
  invoice: true,
  services: true,
  samples: true,
  portfolio: true,
  jobs: true,
  hire: true,
  account: true,
  admin: true,
};
