export interface NavLinkData {
  label: string;
  to: string;
}

export interface LogoContent {
  href: string;
  imageSrc: string;
  alt: string;
  text: string;
}

export interface HeroContent {
  kicker: string;
  title: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
}

export interface ContactContent {
  title: string;
  description: string;
  baleUrl: string;
  submitLabel: string;
  successMessage: string;
  savedMessage: string;
  errorMessage: string;
}

export interface TermsContent {
  title: string;
  description: string;
}

export interface PortfolioContent {
  titleText: string;
  descriptionText: string;
}

export interface FooterContent {
  label: string;
  url: string;
  copyrightPrefix: string;
  copyrightSuffix: string;
}

export interface SeoContent {
  title: string;
  description: string;
}

export const defaultNavLinks: NavLinkData[] = [
  { label: "تعرفه", to: "/pricing" },
  { label: "نمونه کار", to: "/portfolio" },
  { label: "شرایط همکاری", to: "/terms" },
  { label: "سفارش پروژه", to: "/contact" },
  { label: "درباره ما", to: "/about" },
];

export const defaultLogoContent: LogoContent = {
  href: "/",
  imageSrc: "/logo.png",
  alt: "بومیم",
  text: "بومیم هستیم.",
};

export const defaultHeroContent: HeroContent = {
  kicker: "تولید محتوای دیجیتال",
  title: "بومیم",
};

export const defaultAboutContent: AboutContent = {
  title: "درباره ما",
  paragraphs: [
    "تیم بومیم از سال ۱۴۰۴ فعالیت خود را در زمینه تولید محتوای دیجیتال برای شبکه‌های اجتماعی آغاز کرد.",
    "این تیم حاصل همکاری افرادی است که در کنار یکدیگر تلاش می‌کنند نتایجی خلاقانه و قابل توجه خلق کنند.",
    "نگاه ما به محتوا همواره جدی و دقیق بوده است؛ تلاشی برای ساخت آثاری که پیش از شکل‌گیری ایده و اجرای ما وجود نداشته‌اند.",
    "ما در هر پروژه تلاش می‌کنیم بهترین کیفیت و معنا را در کنار هم ارائه دهیم، با این امید که سهمی در بیشتر دیده شدن و رشد کسب‌وکار شما داشته باشیم.",
  ],
};

export const defaultContactContent: ContactContent = {
  title: "سفارش پروژه",
  description:
    "برای شروع همکاری، لطفاً فرم زیر را تکمیل کنید و روی دکمه «ارسال» کلیک کنید. پس از ارسال فرم، پیام‌رسان «بله» به‌صورت خودکار برای شما باز می‌شود. اطلاعات واردشده از قبل کپی شده و شما کافی است تنها آن‌ها را Paste کرده و ارسال کنید. تیم ما در کوتاه‌ترین زمان ممکن درخواست شما را بررسی میکند و با شما برای ادامه روند همکاری تماس خواهد گرفت.",
  baleUrl: "https://ble.ir/hnmodeq",
  submitLabel: "ارسال",
  successMessage: "به بله منتقل شدید.",
  savedMessage: "درخواست شما در سایت ذخیره شد و به بله منتقل شدید.",
  errorMessage: "در ذخیره درخواست مشکلی پیش آمد، اما به بله منتقل شدید.",
};

export const defaultTermsContent: TermsContent = {
  title: "شرایط همکاری",
  description:
    "شروع همکاری با تیم بومیم به معنای پذیرش شرایط موارد زیر است؛ که برای حفظ کیفیت و شفافیت در همکاری تهیه شده است.",
};

export const defaultTerms = [
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

export const defaultPortfolioContent: PortfolioContent = {
  titleText: "نمونه کارها",
  descriptionText:
    "بخشی از نمونه‌کارهای ما برای آشنایی بیشتر با سبک روایت، ریتم و نگاه ما به محتوای دیجیتال.",
};

export const defaultHomePortfolioContent: PortfolioContent = {
  titleText: "نمونه کار",
  descriptionText: "برخی از پروژه‌های اخیر در حوزه ادیت، گرافیک، موشن و نریشن.",
};

export const defaultFooterContent: FooterContent = {
  label: "بومیم",
  url: "https://www.bumimstudio.ir/",
  copyrightPrefix: "تمامی حقوق برای",
  copyrightSuffix: "محفوظ است.",
};

export const defaultSeoContent: SeoContent = {
  title: "بومیم - تولید محتوای دیجیتال",
  description:
    "تیم بومیم؛ تولید محتوای دیجیتال، ادیت ویدیو، موشن گرافیک، گرافیک و نریشن برای شبکه‌های اجتماعی.",
};

export const defaultSiteContent = {
  navLinks: defaultNavLinks,
  logo: defaultLogoContent,
  hero: defaultHeroContent,
  about: defaultAboutContent,
  contact: defaultContactContent,
  terms: defaultTermsContent,
  portfolioPage: defaultPortfolioContent,
  homePortfolio: defaultHomePortfolioContent,
  footer: defaultFooterContent,
  seo: defaultSeoContent,
};
