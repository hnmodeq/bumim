"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { GlowMenu } from "@/components/ui/glow-menu";
import { GlowCard } from "@/components/ui/glow-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Layers,
  Sparkles,
  ArrowLeft,
  Video,
  FileCheck2,
  Shield,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-4 md:p-8 relative overflow-hidden bg-[#070709] selection:bg-primary/20">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating Glow Menu Dock at Top */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pt-2 pb-6 z-20">
        <GlowMenu />
      </header>

      {/* Center Hero */}
      <section className="w-full max-w-4xl mx-auto my-auto py-8 md:py-12 z-10 space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(255,223,0,0.15)] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#ffdf00]" />
              <span className="text-zinc-200">نسخه جدید بومیم • پاییز ۱۴۰۵</span>
            </div>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight"
            style={{ letterSpacing: "-0.04em" }}
          >
            داره طراحی میشه
          </h1>

          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            پلتفرم هوشمند محاسبه دستمزد، تعرفه‌های رسمی و صدور پیش‌فاکتور برای تدوینگران ویدیویی با استانداردهای نوین
          </p>
        </div>

        {/* Glow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Card 1: Invoice */}
          <GlowCard glowColor="#ffdf00" className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,223,0,0.2)]">
                  <Calculator className="w-5 h-5" />
                </div>
                <Badge className="bg-primary text-primary-foreground font-black text-[10px] shadow-[0_0_12px_rgba(255,223,0,0.4)]">
                  ابزار اصلی
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">محاسبه و صدور پیش‌فاکتور</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  محاسبه دقیق دستمزد بر مبنای نوع ویدیو، زمان راش و ۱۵+ فاکتور فنی (اصلاح رنگ، راف‌کات، صدا، موشن...) همراه با خروجی PDF استاندارد فارسی.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/invoice"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full font-black text-xs h-10 gap-2 shadow-[0_0_20px_rgba(255,223,0,0.25)] hover:shadow-[0_0_30px_rgba(255,223,0,0.45)] transition-all"
                )}
              >
                <span>ورود به صدور پیش‌فاکتور</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </GlowCard>

          {/* Card 2: Services */}
          <GlowCard glowColor="#a855f7" className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Layers className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="border-purple-500/40 text-purple-300 font-bold text-[10px]">
                  نرخ کندو ۱۴۰۵
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">تعرفه‌ها و لیست قیمت</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  مشاهده جدول مقایسه‌ای تعرفه‌های مصوب ادیت ویدیوی کوتاه، تیزر تبلیغاتی، دوره‌های آموزشی و پکیج‌های اقتصادی تا حرفه‌ای.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full font-black text-xs h-10 gap-2 bg-purple-500/15 border border-purple-500/30 text-purple-200 hover:bg-purple-500/25 hover:text-white shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all"
                )}
              >
                <span>مشاهده لیست تعرفه‌ها</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </GlowCard>
        </div>

        {/* Skeleton Preview Teaser Card */}
        <div className="max-w-3xl mx-auto">
          <GlowCard glowColor="#11ffba" className="p-4 border-dashed border-white/10 bg-zinc-950/40">
            <div className="flex items-center justify-between mb-3 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                پیش‌نمایش بخش‌های بعدی
              </span>
              <span className="text-[11px] font-mono text-zinc-500">v2.1 preview</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl bg-white/5" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3 bg-white/5" />
                  <Skeleton className="h-3 w-2/3 bg-white/5" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg bg-white/5" />
              </div>
              <Separator className="bg-white/5" />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <Skeleton className="h-16 rounded-xl bg-white/5" />
                <Skeleton className="h-16 rounded-xl bg-white/5" />
                <Skeleton className="h-16 rounded-xl bg-white/5" />
              </div>
            </div>
          </GlowCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 z-10">
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
