"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { defaultServices, featureNames, type Service, type Package } from "../lib/pricing";

import { GlowMenu } from "@/components/ui/glow-menu";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Check,
  Minus,
  Calculator,
  ArrowLeft,
  Info,
  Layers,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [activeId, setActiveId] = useState<string>(defaultServices[0].id);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((j) => {
        const data = Array.isArray(j?.services) && j.services.length ? j.services : defaultServices;
        setServices(data);
        if (!data.find((x: Service) => x.id === activeId)) setActiveId(data[0].id);
      })
      .catch(() => {
        setServices(defaultServices);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = services.find((s) => s.id === activeId) || services[0];

  return (
    <main className="min-h-screen bg-[#060608] text-foreground px-4 md:px-6 py-6 md:py-10 relative overflow-hidden selection:bg-primary/20">
      {/* Background ambient iridescent orbs */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Glow Menu Dock */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pb-8 z-20">
        <GlowMenu />
      </header>

      <div className="w-full max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-zinc-200">تعرفه‌های مصوب صنف تدوینگران • ۳ ماه دوم ۱۴۰۵</span>
            </div>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
              PRICE LIST
            </span>{" "}
            <span>لیست تعرفه خدمات ادیت</span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            محاسبه دقیق بر مبنای نرخ مصوب کندو • مبنای محاسبه مدت زمان راش ویدیویی است • شامل یک مرحله اصلاحیه رایگان
          </p>
        </div>

        {/* Loading Skeleton State */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              <Skeleton className="h-10 w-32 rounded-full bg-white/[0.05]" />
              <Skeleton className="h-10 w-32 rounded-full bg-white/[0.05]" />
              <Skeleton className="h-10 w-32 rounded-full bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <FrostedCard key={i} className="p-6 space-y-4">
                  <Skeleton className="h-6 w-1/2 bg-white/[0.05]" />
                  <Skeleton className="h-14 w-full rounded-2xl bg-white/[0.05]" />
                  <Separator className="bg-white/[0.06]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-white/[0.05]" />
                    <Skeleton className="h-4 w-4/5 bg-white/[0.05]" />
                    <Skeleton className="h-4 w-3/4 bg-white/[0.05]" />
                    <Skeleton className="h-4 w-5/6 bg-white/[0.05]" />
                  </div>
                  <Skeleton className="h-11 w-full rounded-xl bg-white/[0.05]" />
                </FrostedCard>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Service Frosted Switcher Tabs */}
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.12] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                {services.map((s) => {
                  const isActive = activeId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-white/[0.14] text-white shadow-[0_0_20px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/25 font-black"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                      )}
                    >
                      <Layers className={cn("w-3.5 h-3.5 transition-transform", isActive ? "text-primary scale-110" : "opacity-60")} />
                      <span>{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Package Frosted Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {active.packages.map((pkg) => {
                const glowGradients: Record<string, string> = {
                  eco: "rgba(124, 58, 237, 0.25)",
                  pro: "rgba(255, 223, 0, 0.25)",
                  motion: "rgba(236, 72, 153, 0.25)",
                };
                const cardGlow = glowGradients[pkg.id] || "rgba(255, 255, 255, 0.15)";

                return (
                  <FrostedCard
                    key={pkg.id}
                    accentGlow={cardGlow}
                    className={cn(
                      "flex flex-col justify-between relative",
                      pkg.popular
                        ? "border-primary/50 shadow-[0_20px_50px_rgba(255,223,0,0.12),inset_0_1px_2px_rgba(255,255,255,0.3)]"
                        : "border-white/[0.1]"
                    )}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between pb-3">
                        <div>
                          <h3 className="text-lg font-black text-white">{pkg.name}</h3>
                          <p className="text-[11px] text-zinc-400 mt-0.5">سرویس {active.name}</p>
                        </div>
                        {pkg.popular && (
                          <Badge className="bg-primary text-primary-foreground font-black text-[10px] gap-1 shadow-[0_0_14px_rgba(255,223,0,0.4)]">
                            <Sparkles className="w-3 h-3" />
                            پرطرفدار
                          </Badge>
                        )}
                      </div>

                      {/* Clean Uniform Price Capsule (No patchy/broken borders) */}
                      <div
                        className={cn(
                          "mt-2 rounded-2xl border p-4 text-center flex items-center justify-center gap-2.5 backdrop-blur-xl transition-all relative overflow-hidden",
                          pkg.popular
                            ? "bg-primary/10 border-primary/50 shadow-[0_8px_24px_rgba(255,223,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)]"
                            : "bg-white/[0.04] border-white/[0.15] shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)]"
                        )}
                      >
                        {/* Top Specular Reflection Highlight */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                        <span className={cn("text-xs font-black", pkg.popular ? "text-primary/70" : "text-zinc-400")}>$</span>
                        <span className="text-3xl font-black tracking-tight text-white font-mono">{pkg.price}</span>
                        <div className={cn("text-[10px] font-bold leading-tight text-right", pkg.popular ? "text-primary/90" : "text-zinc-400")}>
                          {pkg.per}
                        </div>
                      </div>

                      <Separator className="bg-white/[0.08] my-4" />

                      {/* Feature list */}
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                          امکانات و جزئیات پکیج:
                        </div>
                        <ul className="space-y-2.5">
                          {pkg.features.map((f, i) => {
                            const has = f && f !== "—";
                            return (
                              <li key={i} className="flex items-center gap-2.5 text-xs">
                                {has ? (
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br ${pkg.color} text-white shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.25)]`}
                                  >
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-600 shrink-0">
                                    <Minus className="w-3 h-3" />
                                  </div>
                                )}
                                <span
                                  className={`leading-tight ${
                                    has ? "text-zinc-200 font-medium" : "text-zinc-600 line-through"
                                  }`}
                                >
                                  {has ? f : featureNames[i]}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link
                        href="/invoice"
                        className={cn(
                          buttonVariants({ variant: pkg.popular ? "default" : "secondary" }),
                          "w-full font-bold text-xs h-11 gap-2 rounded-xl",
                          pkg.popular
                            ? "shadow-[0_0_24px_rgba(255,223,0,0.35)] hover:shadow-[0_0_36px_rgba(255,223,0,0.55)]"
                            : "bg-white/[0.08] border border-white/[0.12] text-white hover:bg-white/[0.15]"
                        )}
                      >
                        <Calculator className="w-4 h-4" />
                        <span>صدور پیش‌فاکتور با این نرخ</span>
                      </Link>
                    </div>
                  </FrostedCard>
                );
              })}
            </div>

            {/* Desktop Comparison Table */}
            <div className="hidden lg:block mt-8">
              <FrostedCard accentGlow="rgba(59, 130, 246, 0.15)" className="p-0 overflow-hidden">
                <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-primary" />
                      جدول مقایسه جامع پکیج‌های «{active.name}»
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      بررسی تفاوت‌ها و امکانات همراه هر سطح
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono border-white/20 text-zinc-300 bg-white/5">
                    {active.packages.length} پکیج فعال
                  </Badge>
                </div>

                <Table>
                  <TableHeader className="bg-white/[0.03]">
                    <TableRow className="border-white/[0.08]">
                      <TableHead className="w-[280px] text-right font-black text-xs text-white py-4 px-6">
                        ویژگی / فاکتور فنی
                      </TableHead>
                      {active.packages.map((pkg) => (
                        <TableHead key={pkg.id} className="text-center font-black text-xs text-white py-4 px-4">
                          <div className="space-y-1">
                            <div className="text-sm font-black text-white">{pkg.name}</div>
                            <div className="text-[11px] text-primary font-mono font-bold">
                              {pkg.price} {pkg.per}
                            </div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureNames.map((feat, idx) => (
                      <TableRow key={feat} className="border-white/[0.05] hover:bg-white/[0.03]">
                        <TableCell className="font-bold text-xs text-zinc-200 py-3.5 px-6">
                          <div className="flex items-center gap-2">
                            <span>{feat}</span>
                            <Tooltip>
                              <TooltipTrigger className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                                <HelpCircle className="w-3.5 h-3.5" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs bg-zinc-900 border-white/10 text-white">
                                فاکتور فنی در استاندارد تدوین ویدیو
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        {active.packages.map((pkg) => {
                          const val = pkg.features[idx];
                          const has = val && val !== "—";
                          return (
                            <TableCell key={pkg.id + feat} className="text-center py-3.5 px-4">
                              {has ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary font-bold text-xs shadow-[0_0_12px_rgba(255,223,0,0.15)]">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>{val}</span>
                                </div>
                              ) : (
                                <span className="text-zinc-600 font-mono text-sm">—</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </FrostedCard>
            </div>

            {/* Note & Guidelines */}
            <FrostedCard accentGlow="rgba(17, 255, 186, 0.15)" className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_16px_rgba(17,255,186,0.25)]">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white">نکته مهم:</span> نرخ‌های فوق به عنوان مبنای کارشناسی تدوین ویدیوی ۱۴۰۵ است. برای محاسبه پروژه‌های چند قسمتی و دریافت پیش‌فاکتور با نام خودتان، از بخش صدور پیش‌فاکتور استفاده کنید.
                  </div>
                </div>

                <Link
                  href="/invoice"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "font-bold gap-2 shrink-0 rounded-xl shadow-[0_0_20px_rgba(255,223,0,0.3)]"
                  )}
                >
                  <span>ورود به صدور پیش‌فاکتور</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </FrostedCard>
          </>
        )}
      </div>
    </main>
  );
}
