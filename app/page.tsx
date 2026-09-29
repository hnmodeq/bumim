"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { GlowMenu } from "@/components/ui/glow-menu";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Layers,
  Sparkles,
  ArrowLeft,
  Video,
  CheckCircle2,
  Lock,
  FileCheck2,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-4 md:p-8 relative overflow-hidden bg-[#060608] selection:bg-primary/20">
      {/* Dynamic Ambient Iridescent Gradient Mesh */}
      <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/3 w-[600px] h-[600px] bg-gradient-to-tl from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Glow Menu Dock at Top */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pt-2 pb-6 z-20">
        <GlowMenu />
      </header>

      {/* Center Hero */}
      <section className="w-full max-w-4xl mx-auto my-auto py-8 md:py-12 z-10 space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#ffdf00]" />
              <span className="text-zinc-200">طراحی شیشه‌ای مات • نسخه ۱۴۰۵</span>
            </div>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight drop-shadow-sm"
            style={{ letterSpacing: "-0.04em" }}
          >
            داره طراحی میشه
          </h1>

          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            پلتفرم تخصصی محاسبه دستمزد، مشاهده تعرفه‌های مصوب و صدور پیش‌فاکتور رسمی برای تدوینگران ویدیویی
          </p>
        </div>

        {/* Frosted Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Card 1: Invoice */}
          <FrostedCard accentGlow="rgba(255, 223, 0, 0.2)" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.15] backdrop-blur-xl flex items-center justify-center text-primary shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]">
                  <Calculator className="w-6 h-6" />
                </div>
                <Badge className="bg-primary text-primary-foreground font-black text-[10px] shadow-[0_0_14px_rgba(255,223,0,0.4)]">
                  ابزار اصلی
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">محاسبه و صدور پیش‌فاکتور</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  محاسبه آنلاین دستمزد بر اساس نوع ویدیو، مدت زمان راش و ۱۵+ فاکتور فنی (اصلاح رنگ، راف‌کات، صدا، موشن...) با خروجی استاندارد PDF فارسی.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/invoice"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full font-black text-xs h-11 gap-2 shadow-[0_0_24px_rgba(255,223,0,0.3)] hover:shadow-[0_0_36px_rgba(255,223,0,0.5)] transition-all rounded-xl"
                )}
              >
                <span>ورود به صدور پیش‌فاکتور</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </FrostedCard>

          {/* Card 2: Services */}
          <FrostedCard accentGlow="rgba(192, 132, 252, 0.2)" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.15] backdrop-blur-xl flex items-center justify-center text-purple-400 shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]">
                  <Layers className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="border-purple-400/40 text-purple-300 font-bold text-[10px] bg-purple-500/10">
                  نرخ کندو ۱۴۰۵
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">تعرفه‌ها و لیست قیمت</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  مشاهده جدول مقایسه‌ای تعرفه‌های مصوب ادیت ویدیوی کوتاه، تیزر تبلیغاتی، دوره‌های آموزشی و پکیج‌های اقتصادی تا حرفه‌ای.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full font-black text-xs h-11 gap-2 bg-white/[0.08] border border-white/[0.15] text-white hover:bg-white/[0.15] shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all rounded-xl"
                )}
              >
                <span>مشاهده لیست تعرفه‌ها</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </FrostedCard>
        </div>

        {/* Frosted Skeleton Preview Teaser */}
        <div className="max-w-3xl mx-auto">
          <FrostedCard accentGlow="rgba(52, 211, 153, 0.15)" className="p-4 border-dashed border-white/[0.12] bg-white/[0.02]">
            <div className="flex items-center justify-between mb-3 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                پیش‌نمایش امکانات بعدی
              </span>
              <span className="text-[11px] font-mono text-zinc-500">frosted v2.2</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-2xl bg-white/[0.05]" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3 bg-white/[0.05]" />
                  <Skeleton className="h-3 w-2/3 bg-white/[0.05]" />
                </div>
                <Skeleton className="h-8 w-20 rounded-xl bg-white/[0.05]" />
              </div>
              <Separator className="bg-white/[0.06]" />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <Skeleton className="h-16 rounded-2xl bg-white/[0.05]" />
                <Skeleton className="h-16 rounded-2xl bg-white/[0.05]" />
                <Skeleton className="h-16 rounded-2xl bg-white/[0.05]" />
              </div>
            </div>
          </FrostedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 z-10">
        <div className="flex items-center gap-2">
          <span>طراحی و قدرت‌گرفته از</span>
          <span className="font-bold text-white">بومیم (bumim)</span>
          <span>•</span>
          <span className="font-mono text-[11px] text-zinc-400">bumims.ir</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <Link href="/services" className="hover:text-white transition-colors">
            تعرفه‌ها
          </Link>
          <Link href="/invoice" className="hover:text-white transition-colors">
            پیش‌فاکتور
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            مدیریت
          </Link>
        </div>
      </footer>
    </main>
  );
}
