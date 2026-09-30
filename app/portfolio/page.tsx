"use client";

import Link from "next/link";

import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  User,
  Briefcase,
  Award,
  Video,
  FileSpreadsheet,
  Layers,
  ArrowLeft,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="flex-1 px-4 md:px-6 py-4 md:py-8 relative selection:bg-primary/20">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-zinc-200">رزومه و پرتفولیوی تخصصی ویدیو ادیتورها</span>
            </div>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
              PORTFOLIO
            </span>{" "}
            <span>پرتفولیو و رزومه‌ساز</span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            مشاهده سوابق و تخصص‌ها • به زودی با قابلیت ساخت صفحه پرتفولیوی اختصاصی با لینک شخصی برای تدوینگران
          </p>
        </div>

        {/* Lead Editor Highlight Card */}
        <FrostedCard accentGlow="rgba(255, 223, 0, 0.2)" className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-right">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-purple-600/30 border border-primary/40 flex items-center justify-center text-primary text-3xl font-black shadow-[0_0_30px_rgba(255,223,0,0.25)] shrink-0">
              B
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl font-black text-white">بومیم | تدوینگر ارشد و کارگردان خلاق</h2>
                <Badge className="bg-primary text-primary-foreground font-black text-xs">تایید شده</Badge>
              </div>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                بیش از ۵ سال سابقه تدوین و موشن گرافیک، مسلط به Premiere Pro، After Effects و DaVinci Resolve. اجرای بیش از ۳۰۰ پروژه ویدیویی موفق برای برندها و تولیدکنندگان محتوا.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                <Badge variant="outline" className="border-white/15 bg-white/5 text-zinc-300 text-xs">
                  ⚡ بیش از ۳۰۰ پروژه موفق
                </Badge>
                <Badge variant="outline" className="border-white/15 bg-white/5 text-zinc-300 text-xs">
                  🎬 مسلط به ادیت ریتمیک و هوک اینستاگرام
                </Badge>
                <Badge variant="outline" className="border-white/15 bg-white/5 text-zinc-300 text-xs">
                  🎨 کالرگریدینگ و لوک سینمایی
                </Badge>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
              <Link
                href="/services"
                className={cn(buttonVariants({ size: "default" }), "font-bold text-xs h-11 rounded-xl shadow-[0_0_20px_rgba(255,223,0,0.3)]")}
              >
                <span>مشاهده تعرفه‌ها و سفارش</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Link>
              <Link
                href="/samples"
                className={cn(buttonVariants({ variant: "outline", size: "default" }), "font-bold text-xs h-11 rounded-xl border-white/20 text-white")}
              >
                <span>مشاهده نمونه کارها</span>
              </Link>
            </div>
          </div>
        </FrostedCard>

        {/* Builder Feature Teaser */}
        <FrostedCard accentGlow="rgba(168, 85, 247, 0.2)" className="p-6 md:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-lg mx-auto">
            <h3 className="text-lg font-black text-white">پرتفولیوی اختصاصی خودت رو بساز!</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              به زودی می‌توانید به عنوان ویدیو ادیتور، صفحه رزومه و نمونه‌کارهای شخصی خود را با آدرس اختصاصی (مانند bumims.ir/p/yourname) بسازید و با کارفرماها به اشتراک بگذارید.
            </p>
          </div>
        </FrostedCard>
      </div>
    </div>
  );
}
