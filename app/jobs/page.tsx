"use client";

import Link from "next/link";

import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Briefcase,
  Clock,
  DollarSign,
  SendHorizontal,
  PlusCircle,
  TrendingUp,
} from "lucide-react";

type JobItem = {
  id: string;
  title: string;
  client: string;
  category: string;
  budget: string;
  deadline: string;
  description: string;
  tags: string[];
  postedAt: string;
};

const sampleJobs: JobItem[] = [
  {
    id: "j1",
    title: "نیازمند ادیتور ریلز اینستاگرام پیج آموزش زبان انگلیسی",
    client: "آکادمی زبان",
    category: "ریلز و شورتس",
    budget: "۱.۸ تا ۲.۵ میلیون به ازای هر دقیقه",
    deadline: "فوری (پروژه ادامه‌دار ماهانه)",
    description: "به یک ادیتور مسلط به Premiere و موشن ریتمیک جهت تدوین هفتگی ۴ الی ۵ ریلز آموزشی با زیرنویس انیمیت شده نیازمندیم.",
    tags: ["Premiere Pro", "After Effects", "زیرنویس داینامیک"],
    postedAt: "۲ ساعت پیش",
  },
  {
    id: "j2",
    title: "تدوین ویدیوی ولاگ یوتیوب با کیفیت 4K و کالرگریدینگ",
    client: "یوتیوبر حوزه تکنولوژی",
    category: "یوتیوب و ولاگ",
    budget: "۸ تا ۱۲ میلیون برای هر ویدیو ۱۵ دقیقه‌ای",
    deadline: "۴۸ ساعت پس از ارسال راش",
    description: "نیازمند تدوینگر حرفه‌ای جهت کات‌های تمیز، انتخاب موزیک متناسب و ایجاد B-roll های جذاب متناسب با لحن کانال.",
    tags: ["DaVinci Resolve", "یوتیوب", "کالرگریدینگ"],
    postedAt: "امروز",
  },
];

export default function JobsPage() {
  return (
    <div className="flex-1 px-4 md:px-6 py-4 md:py-8 relative selection:bg-primary/20">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-zinc-200">فرصت‌های شغلی و فریلنسری تدوین</span>
            </div>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-200 bg-clip-text text-transparent">
              PROJECTS
            </span>{" "}
            <span>لیست پروژه‌ها و کاریابی</span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            مشاهده پروژه‌های برون‌سپاری شده کارفرماها و ارسال پیشنهاد همکاری توسط ادیتورها
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <div className="text-xs text-zinc-400">
            کارفرما هستید و دنبال تدوینگر می‌گردید؟
          </div>
          <Link
            href="/hire"
            className={cn(buttonVariants({ size: "sm" }), "font-bold text-xs h-9 gap-1.5 rounded-xl shadow-[0_0_16px_rgba(255,223,0,0.3)]")}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ثبت پروژه جدید</span>
          </Link>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {sampleJobs.map((job) => (
            <FrostedCard key={job.id} accentGlow="rgba(6, 182, 212, 0.2)" className="p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{job.title}</h3>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 text-[10px]">
                      {job.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-zinc-400">کارفرما: {job.client} • {job.postedAt}</div>
                </div>

                <div className="text-right sm:text-left font-mono">
                  <div className="text-xs font-bold text-emerald-400">{job.budget}</div>
                  <div className="text-[10px] text-zinc-500">{job.deadline}</div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href="/services"
                  className={cn(buttonVariants({ size: "sm" }), "font-bold text-xs h-9 gap-1.5 rounded-xl")}
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>ارسال پیشنهاد همکاری</span>
                </Link>
              </div>
            </FrostedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
