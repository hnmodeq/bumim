"use client";

import { useState } from "react";
import Link from "next/link";

import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Play,
  Film,
  Eye,
  Clock,
  Layers,
  ArrowLeft,
  ExternalLink,
  SlidersHorizontal,
  SendHorizontal,
  Flame,
} from "lucide-react";

type SampleItem = {
  id: string;
  title: string;
  category: "reels" | "youtube" | "teaser" | "motion" | "course";
  categoryLabel: string;
  duration: string;
  aspect: "9:16" | "16:9";
  software: string[];
  metrics: string;
  description: string;
  coverGradient: string;
  videoUrl?: string;
  accentColor: string;
};

const sampleProjects: SampleItem[] = [
  {
    id: "reels-1",
    title: "تدوین ریلز اینستاگرامی با هوک سریع و موشن اختصاصی",
    category: "reels",
    categoryLabel: "ریلز اینستاگرام",
    duration: "۴۵ ثانیه",
    aspect: "9:16",
    software: ["Premiere Pro", "After Effects"],
    metrics: "۳۲۰ هزار ویو",
    description: "استفاده از هوک ۳ ثانیه اول، زوم‌های ریتمیک، زیرنویس فارسی انیمیت‌شده و ساوند دیزاین پرانرژی.",
    coverGradient: "from-purple-900/40 via-indigo-900/30 to-black",
    accentColor: "rgba(168, 85, 247, 0.3)",
  },
  {
    id: "teaser-1",
    title: "تیزر معرفی محصول و برند با اصلاح رنگ سینمایی",
    category: "teaser",
    categoryLabel: "تیزر تبلیغاتی",
    duration: "۱:۱۵ دقیقه",
    aspect: "16:9",
    software: ["DaVinci Resolve", "Premiere Pro"],
    metrics: "کمپین نوروزی",
    description: "کالرگریدینگ سینمایی با لوک سفارشی، افکت‌های نوری، ترنزیشن‌های بدون کات و مسترینگ صدا.",
    coverGradient: "from-amber-900/40 via-yellow-900/20 to-black",
    accentColor: "rgba(255, 223, 0, 0.3)",
  },
  {
    id: "youtube-1",
    title: "تدوین ویدیو ولاگ و آنباکسینگ یوتیوب با ریتم بالا",
    category: "youtube",
    categoryLabel: "یوتیوب و ولاگ",
    duration: "۱۲:۳۰ دقیقه",
    aspect: "16:9",
    software: ["Premiere Pro", "Photoshop"],
    metrics: "۸۵ هزار ویو",
    description: "کات‌های تمیز جامپ‌کات، انیمیشن چارت‌ها، B-Roll های هماهنگ با کلام و تامبنیل جذاب با CTR بالای ۹٪.",
    coverGradient: "from-rose-900/40 via-pink-900/20 to-black",
    accentColor: "rgba(244, 63, 94, 0.3)",
  },
  {
    id: "motion-1",
    title: "موشن گرافیک ۲.۵ بعدی معرفی فیچرهای اپلیکیشن",
    category: "motion",
    categoryLabel: "موشن گرافیک",
    duration: "۳۰ ثانیه",
    aspect: "16:9",
    software: ["After Effects", "Illustrator"],
    metrics: "پخش در ایونت",
    description: "طراحی وکتور اختصاصی، انیمیت روان، صداگذاری سفارشی SFX و خروجی 4K با بالاترین بیت‌ریت.",
    coverGradient: "from-cyan-900/40 via-teal-900/20 to-black",
    accentColor: "rgba(6, 182, 212, 0.3)",
  },
  {
    id: "reels-2",
    title: "ادیت ویدیوی آموزشی کوتاه در حوزه هوش مصنوعی و بیزینس",
    category: "reels",
    categoryLabel: "شورتس / ریلز",
    duration: "۵۵ ثانیه",
    aspect: "9:16",
    software: ["Premiere Pro", "CapCut Pro"],
    metrics: "۵۱۰ هزار ویو",
    description: "ترکیب ویدیوی چهره با اسکرین‌کست، ترنزیشن‌های سریع، هایلایت خودکار کلمات کلیدی و موزیک لوفای پس‌زمینه.",
    coverGradient: "from-emerald-900/40 via-teal-900/20 to-black",
    accentColor: "rgba(16, 185, 129, 0.3)",
  },
  {
    id: "course-1",
    title: "پکیج تدوین دوره آموزشی تخصصی با چند زاویه دوربین",
    category: "course",
    categoryLabel: "دوره آموزشی",
    duration: "۳ قسمت (۴۵ دقیقه)",
    aspect: "16:9",
    software: ["Premiere Pro", "Audition"],
    metrics: "پلتفرم آموزشی",
    description: "سوییچ خودکار زاویه دوربین‌ها، تمیزکاری و نویزگیری صدای محیط، زیرنویس مباحث و اینترو/اوتروی برند.",
    coverGradient: "from-blue-900/40 via-indigo-900/20 to-black",
    accentColor: "rgba(59, 130, 246, 0.3)",
  },
];

export default function SamplesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<SampleItem | null>(null);

  const filteredSamples = activeCategory === "all"
    ? sampleProjects
    : sampleProjects.filter((s) => s.category === activeCategory);

  return (
    <div className="flex-1 px-4 md:px-6 py-4 md:py-8 relative selection:bg-primary/20">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-zinc-200">منتخب پروژه‌های تدوین، رنگ، صدا و موشن</span>
            </div>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-amber-200 bg-clip-text text-transparent">
              SHOWCASE
            </span>{" "}
            <span>گالری نمونه کارهای ویدیویی</span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            مجموعه‌ای از نمونه پروژه‌های اجرا شده در سبک‌های مختلف ویدیویی، ریلزهای پربازدید و تیزرهای تجاری
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.12] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            {[
              { id: "all", label: "همه نمونه‌ها" },
              { id: "reels", label: "ریلز و شورتس" },
              { id: "youtube", label: "یوتیوب و ولاگ" },
              { id: "teaser", label: "تیزر و پروداکت" },
              { id: "motion", label: "موشن گرافیک" },
              { id: "course", label: "دوره آموزشی" },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-white/[0.15] text-white shadow-[0_0_20px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/25 font-black"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.map((item) => (
            <FrostedCard
              key={item.id}
              accentGlow={item.accentColor}
              className="p-0 overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Visual Video Cover Box */}
                <div
                  className={cn(
                    "w-full bg-gradient-to-br relative flex items-center justify-center border-b border-white/[0.08] overflow-hidden cursor-pointer",
                    item.aspect === "9:16" ? "h-64" : "h-52",
                    item.coverGradient
                  )}
                  onClick={() => setActiveVideo(item)}
                >
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Play Button Icon */}
                  <div className="w-14 h-14 rounded-full bg-black/60 border border-white/30 backdrop-blur-xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                    <Play className="w-6 h-6 fill-current mr-0.5" />
                  </div>

                  {/* Badges Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 text-[10px] font-bold">
                      {item.categoryLabel}
                    </Badge>
                    <Badge variant="outline" className="bg-black/60 border-white/20 text-zinc-300 text-[10px] font-mono">
                      {item.aspect}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Badge className="bg-black/80 backdrop-blur-md text-primary font-mono text-[10px] font-bold gap-1 border-white/10">
                      <Clock className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </Badge>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>{item.metrics}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Software Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.software.map((sw) => (
                      <span
                        key={sw}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-mono"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA Action */}
              <div className="p-5 pt-0">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full font-bold text-xs h-10 gap-2 rounded-xl bg-white/[0.08] hover:bg-primary hover:text-black border border-white/15 transition-all text-white cursor-pointer"
                  )}
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>سفارش ادیت مشابه این ویدیو</span>
                </Link>
              </div>
            </FrostedCard>
          ))}
        </div>
      </div>

      {/* Video Preview Modal */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="sm:max-w-xl bg-[#0c0d12]/95 backdrop-blur-3xl border border-white/[0.15] text-white shadow-[0_24px_70px_rgba(0,0,0,0.8)] rounded-3xl p-6">
          {activeVideo && (
            <div className="space-y-4">
              <DialogHeader className="text-right">
                <DialogTitle className="text-base font-black text-white">
                  {activeVideo.title}
                </DialogTitle>
              </DialogHeader>

              {/* Interactive Player Placeholder */}
              <div
                className={cn(
                  "w-full rounded-2xl bg-gradient-to-br border border-white/10 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden",
                  activeVideo.aspect === "9:16" ? "h-96" : "h-64",
                  activeVideo.coverGradient
                )}
              >
                <div className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,223,0,0.5)] mb-3">
                  <Play className="w-7 h-7 fill-black ml-1" />
                </div>
                <div className="text-sm font-black text-white">پیش‌نمایش تعاملی ویدیو</div>
                <div className="text-xs text-zinc-400 mt-1">مدت زمان: {activeVideo.duration} • رزولوشن 4K 60fps</div>
              </div>

              <div className="text-xs text-zinc-300 leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06]">
                {activeVideo.description}
              </div>

              <div className="flex gap-2">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "flex-1 font-bold text-xs h-11 rounded-xl shadow-[0_0_20px_rgba(255,223,0,0.3)]"
                  )}
                >
                  <SendHorizontal className="w-4 h-4 ml-1" />
                  <span>ثبت سفارش برای این سبک</span>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setActiveVideo(null)}
                  className="rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  بستن
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
