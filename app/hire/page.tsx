"use client";

import { GlowMenu } from "@/components/ui/glow-menu";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Briefcase,
  Users,
  Video,
  SendHorizontal,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function HirePage() {
  return (
    <main className="min-h-screen bg-[#060608] text-foreground px-4 md:px-6 py-6 md:py-10 relative overflow-hidden selection:bg-primary/20">
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-600/15 via-teal-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pb-8 z-20">
        <GlowMenu />
      </header>

      <div className="w-full max-w-4xl mx-auto relative z-10 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-200">برون‌سپاری هوشمند پروژه‌های تدوین</span>
            </div>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-amber-200 bg-clip-text text-transparent">
              HIRE EDITOR
            </span>{" "}
            <span>درخواست استخدام ادیتور</span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            پروژه ویدیویی خود را برون‌سپاری کنید تا به دست بهترین تدوینگران تایید شده جامعه بومیم برسد
          </p>
        </div>

        <FrostedCard accentGlow="rgba(16, 185, 129, 0.2)" className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>ثبت اطلاعات پروژه برون‌سپاری</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">عنوان پروژه یا موقعیت شغلی</label>
                <Input
                  placeholder="مثال: ادیتور تمام‌وقت پیج اینستاگرام مد و فشن"
                  className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">نوع همکاری و سبک مدنظر</label>
                <Input
                  placeholder="مثال: پروژه‌ای، ریلز ریتمیک (هفتگی ۴ ویدیو)"
                  className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">بودجه پیشنهادی برای هر ویدیو / ماهانه</label>
                <Input
                  placeholder="مثال: ۲ تا ۳ میلیون برای هر دقیقه"
                  className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">شماره تماس یا آیدی تلگرام کارفرما</label>
                <Input
                  dir="ltr"
                  placeholder="0912... یا @username"
                  className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">توضیحات تکمیلی و انتظارات از تدوینگر</label>
              <Textarea
                rows={3}
                placeholder="توضیحات راش‌ها، نرم‌افزارهای مورد نیاز و شرایط تسویه..."
                className="rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500 text-xs"
              />
            </div>

            <Button
              className="w-full h-12 rounded-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(255,223,0,0.35)] cursor-pointer"
            >
              <SendHorizontal className="w-4 h-4 ml-2" />
              <span>ثبت درخواست برون‌سپاری در بومیم</span>
            </Button>
          </div>
        </FrostedCard>
      </div>
    </main>
  );
}
