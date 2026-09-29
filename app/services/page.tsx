"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { defaultServices, featureNames, type Service, type Package } from "../lib/pricing";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  Settings,
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
    <main className="min-h-screen bg-background text-foreground px-4 md:px-6 py-8 md:py-12 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-black text-foreground hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-black">
                ب
              </div>
              <span>بومیم</span>
            </Link>
            <Badge variant="outline" className="text-[11px] font-mono border-primary/30 text-primary">
              bumims.ir
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/invoice"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs gap-1.5")}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>صدور پیش‌فاکتور</span>
            </Link>
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>مدیریت</span>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs font-semibold gap-1.5 bg-secondary/80 border border-border">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            تعرفه‌های رسمی • ۳ ماه دوم ۱۴۰۵
          </Badge>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              PRICE LIST
            </span>{" "}
            <span>لیست تعرفه خدمات ادیت</span>
          </h1>

          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            محاسبه دقیق بر مبنای نرخ مصوب کندو • مبنای محاسبه مدت زمان راش ویدیویی است • شامل یک مرحله اصلاحیه رایگان
          </p>
        </div>

        {/* Loading Skeleton State */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 space-y-4 bg-card/60">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Separator />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-xl" />
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Service Tabs */}
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-secondary/50 border border-border">
                {services.map((s) => {
                  const isActive = activeId === s.id;
                  return (
                    <Button
                      key={s.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveId(s.id)}
                      className={`rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 ms-1.5 opacity-70" />
                      {s.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Package Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {active.packages.map((pkg) => {
                return (
                  <Card
                    key={pkg.id}
                    className={`relative flex flex-col justify-between overflow-hidden transition-all duration-300 bg-card/70 backdrop-blur border-border/80 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(255,223,0,0.06)] ${
                      pkg.popular ? "ring-2 ring-primary/60 border-primary/60 shadow-[0_0_25px_rgba(255,223,0,0.1)]" : ""
                    }`}
                  >
                    {/* Top Accent Gradient Bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${pkg.color}`} />

                    <div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-black">{pkg.name}</CardTitle>
                          {pkg.popular && (
                            <Badge className="bg-primary text-primary-foreground font-black text-[10px] gap-1 shadow-sm">
                              <Sparkles className="w-3 h-3" />
                              پرطرفدار
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs text-muted-foreground">
                          سرویس {active.name}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Price banner */}
                        <div className={`rounded-xl p-[1px] bg-gradient-to-br ${pkg.color}`}>
                          <div className="rounded-[11px] bg-card/95 p-3.5 text-center flex items-center justify-center gap-2">
                            <span className="text-xs font-black text-muted-foreground">$</span>
                            <span className="text-3xl font-black tracking-tight text-foreground">{pkg.price}</span>
                            <div className="text-[10px] text-muted-foreground font-bold leading-tight text-right">
                              {pkg.per}
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-border/60" />

                        {/* Feature list */}
                        <div className="space-y-2.5 pt-1">
                          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            امکانات و جزئیات پکیج:
                          </div>
                          <ul className="space-y-2">
                            {pkg.features.map((f, i) => {
                              const has = f && f !== "—";
                              return (
                                <li key={i} className="flex items-center gap-2.5 text-xs">
                                  {has ? (
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br ${pkg.color} text-white shrink-0 shadow-xs`}
                                    >
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/50 shrink-0">
                                      <Minus className="w-3 h-3" />
                                    </div>
                                  )}
                                  <span
                                    className={`leading-tight ${
                                      has ? "text-foreground font-medium" : "text-muted-foreground/60 line-through"
                                    }`}
                                  >
                                    {has ? f : featureNames[i]}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="pt-2">
                      <Link
                        href="/invoice"
                        className={cn(
                          buttonVariants({ variant: pkg.popular ? "default" : "secondary" }),
                          "w-full font-bold gap-2"
                        )}
                      >
                        <Calculator className="w-4 h-4" />
                        <span>صدور پیش‌فاکتور با این نرخ</span>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Comparison Table */}
            <div className="hidden lg:block mt-10">
              <Card className="bg-card/50 backdrop-blur border-border/80 overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-black flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-primary" />
                        جدول مقایسه جامع پکیج‌های «{active.name}»
                      </CardTitle>
                      <CardDescription className="text-xs">
                        بررسی جزئیات، خدمات همراه و تفاوت‌های هر سطح
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      {active.packages.length} پکیج فعال
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/40">
                      <TableRow className="border-border/60">
                        <TableHead className="w-[280px] text-right font-black text-xs text-foreground py-4 px-6">
                          ویژگی / فاکتور فنی
                        </TableHead>
                        {active.packages.map((pkg) => (
                          <TableHead key={pkg.id} className="text-center font-black text-xs text-foreground py-4 px-4">
                            <div className="space-y-1">
                              <div className="text-sm font-black">{pkg.name}</div>
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
                        <TableRow key={feat} className="border-border/40 hover:bg-secondary/20">
                          <TableCell className="font-bold text-xs text-foreground py-3.5 px-6">
                            <div className="flex items-center gap-2">
                              <span>{feat}</span>
                              <Tooltip>
                                <TooltipTrigger className="text-muted-foreground/60 hover:text-muted-foreground cursor-pointer">
                                  <HelpCircle className="w-3.5 h-3.5" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
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
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>{val}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono text-sm">—</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Note & Guidelines */}
            <Card className="bg-secondary/30 border-border/60 p-4 md:p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground">نکته مهم:</span> نرخ‌های فوق به عنوان مبنای کارشناسی تدوین ویدیوی ۱۴۰۵ است. برای محاسبه پروژه‌های چند قسمتی و دریافت پیش‌فاکتور با نام خودتان، از بخش صدور پیش‌فاکتور استفاده کنید.
                  </div>
                </div>

                <Link
                  href="/invoice"
                  className={cn(buttonVariants({ size: "sm" }), "font-bold gap-2 shrink-0")}
                >
                  <span>ورود به صدور پیش‌فاکتور</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
