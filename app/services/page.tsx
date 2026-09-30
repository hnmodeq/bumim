"use client";

import { useState, useEffect } from "react";
import { defaultServices, featureNames, type Service, type Package } from "../lib/pricing";


import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BrandLoader } from "@/components/ui/brand-loader";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Check,
  Minus,
  Layers,
  SendHorizontal,
  User,
  Phone,
  MessageSquare,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Edit3,
} from "lucide-react";

const PROFILE_STORAGE_KEY = "bumim_customer_profile";

interface CustomerProfile {
  name: string;
  phone: string;
  telegramOrId?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [activeId, setActiveId] = useState<string>(defaultServices[0].id);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal Order State
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [selectedPkg, setSelectedPkg] = useState<{ serviceName: string; pkg: Package } | null>(null);

  // Smart Auto-Fill & Customer Profile State
  const [savedProfile, setSavedProfile] = useState<CustomerProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [telegramOrId, setTelegramOrId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Submission Status
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Load saved profile on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CustomerProfile;
        if (parsed.name && parsed.phone) {
          setSavedProfile(parsed);
          setName(parsed.name);
          setPhone(parsed.phone);
          if (parsed.telegramOrId) setTelegramOrId(parsed.telegramOrId);
        }
      }
    } catch {
      // ignore JSON parse errors
    }

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

  const handleOpenOrder = (pkg: Package) => {
    setSelectedPkg({ serviceName: active.name, pkg });
    setSubmitStatus("idle");
    setErrorMessage("");
    // If we have a saved profile, start in 1-Click quick confirmation mode
    setIsEditingProfile(!savedProfile);
    setOrderModalOpen(true);
  };

  const handleQuickOneClickSubmit = async () => {
    if (!savedProfile?.name || !savedProfile?.phone) {
      setIsEditingProfile(true);
      return;
    }
    await executeSubmission(savedProfile.name, savedProfile.phone, savedProfile.telegramOrId || "", note);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMessage("لطفاً نام و شماره تماس خود را وارد کنید.");
      return;
    }
    await executeSubmission(name.trim(), phone.trim(), telegramOrId.trim(), note.trim());
  };

  const executeSubmission = async (
    custName: string,
    custPhone: string,
    custTelegram: string,
    custNote: string
  ) => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: custName,
          phone: custPhone,
          telegramOrId: custTelegram,
          note: custNote,
          serviceName: selectedPkg?.serviceName,
          packageName: selectedPkg?.pkg.name,
          packagePrice: selectedPkg?.pkg.price ? `${selectedPkg.pkg.price} ${selectedPkg.pkg.per}` : "",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        // Save to smart auto-fill storage
        const profileToSave: CustomerProfile = {
          name: custName,
          phone: custPhone,
          telegramOrId: custTelegram || undefined,
        };
        try {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileToSave));
          setSavedProfile(profileToSave);
        } catch {
          // ignore storage error
        }

        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "خطایی در ثبت سفارش رخ داد.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("ارتباط با سرور برقرار نشد. لطفاً مجدداً تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 px-4 md:px-6 py-4 md:py-8 relative selection:bg-primary/20">
      <div className="w-full max-w-6xl mx-auto space-y-8">
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

        {/* Loading Brand State */}
        {loading ? (
          <BrandLoader show={true} />
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

                      {/* Clean Uniform Price Capsule */}
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
                      <button
                        type="button"
                        onClick={() => handleOpenOrder(pkg)}
                        className={cn(
                          buttonVariants({ variant: pkg.popular ? "default" : "secondary" }),
                          "w-full font-bold text-xs h-11 gap-2 rounded-xl transition-all duration-300 cursor-pointer",
                          pkg.popular
                            ? "shadow-[0_0_24px_rgba(255,223,0,0.35)] hover:shadow-[0_0_36px_rgba(255,223,0,0.55)] hover:scale-[1.02]"
                            : "bg-white/[0.08] border border-white/[0.12] text-white hover:bg-white/[0.15] hover:border-white/25 hover:scale-[1.02]"
                        )}
                      >
                        {savedProfile ? (
                          <>
                            <Zap className="w-4 h-4 text-primary fill-primary" />
                            <span>سفارش سریع (۱ کلیک)</span>
                          </>
                        ) : (
                          <>
                            <SendHorizontal className="w-4 h-4 text-primary" />
                            <span>ثبت درخواست این پکیج</span>
                          </>
                        )}
                      </button>
                    </div>
                  </FrostedCard>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Frosted Order Modal Dialog */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#0c0d12]/95 backdrop-blur-3xl border border-white/[0.15] text-white shadow-[0_24px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-3xl p-6">
          <DialogHeader className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
                {savedProfile && !isEditingProfile ? (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-primary" />
                    <span>تایید سریع ۱ کلیک</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ثبت درخواست آنلاین</span>
                  </>
                )}
              </div>
              {selectedPkg && (
                <Badge variant="outline" className="border-white/20 text-zinc-300 bg-white/5 text-xs">
                  {selectedPkg.serviceName}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl font-black text-white pt-2">
              {savedProfile && !isEditingProfile ? `ثبت سفارش برای ${savedProfile.name}` : "ثبت درخواست ادیت ویدیو"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              {savedProfile && !isEditingProfile
                ? "مشخصات شما از قبل شناسایی شده است. تنها با یک کلیک درخواست را نهایی کنید."
                : "نام و شماره تماس خود را وارد کنید تا جزئیات پکیج مستقیماً ارسال شود و با شما تماس بگیریم."}
            </DialogDescription>
          </DialogHeader>

          {/* Selected Package Capsule Summary */}
          {selectedPkg && (
            <div className="my-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs text-zinc-400">پکیج انتخابی:</div>
                <div className="text-sm font-black text-white">{selectedPkg.pkg.name}</div>
              </div>
              <div className="text-left font-mono">
                <div className="text-sm font-black text-primary">{selectedPkg.pkg.price}</div>
                <div className="text-[10px] text-zinc-400">{selectedPkg.pkg.per}</div>
              </div>
            </div>
          )}

          {/* 1. Success Screen */}
          {submitStatus === "success" ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-black text-white">درخواست شما با موفقیت ثبت شد!</h4>
                <p className="text-xs text-zinc-400 leading-relaxed px-4">
                  مشخصات پکیج انتخابی به همراه شماره تماس شما دریافت شد. در اسرع وقت جهت هماهنگی و بررسی جزئیات پروژه با شما تماس خواهیم گرفت.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="w-full h-11 rounded-xl font-bold bg-white/[0.1] hover:bg-white/[0.15] text-white border border-white/20 cursor-pointer"
              >
                بستن پنجره
              </Button>
            </div>
          ) : savedProfile && !isEditingProfile ? (
            /* 2. Quick 1-Click Confirmation Screen */
            <div className="space-y-4 mt-2 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.12] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-black text-base shrink-0 shadow-[0_0_16px_rgba(255,223,0,0.2)]">
                    {savedProfile.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>{savedProfile.name}</span>
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        مشتری شناخته‌شده
                      </span>
                    </div>
                    <div className="text-xs font-mono text-zinc-400 dir-ltr text-right">
                      {savedProfile.phone}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-white/[0.06]">
                  درخواست پکیج <span className="font-bold text-white">«{selectedPkg?.pkg.name}»</span> با شماره فوق ارسال شود؟
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <Button
                  type="button"
                  onClick={handleQuickOneClickSubmit}
                  disabled={submitting}
                  className="w-full h-12 rounded-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_28px_rgba(255,223,0,0.4)] transition-all cursor-pointer text-sm"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال ارسال پیام...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-primary-foreground" />
                      <span>تایید و ارسال با ۱ کلیک</span>
                    </div>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-2 text-xs font-bold text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تغییر نام، شماره تماس یا افزودن توضیحات</span>
                </button>
              </div>
            </div>
          ) : (
            /* 3. Manual Edit / First Time Form */
            <form onSubmit={handleFormSubmit} className="space-y-3.5 mt-2 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>نام و نام خانوادگی</span>
                  <span className="text-red-400">*</span>
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: علی رضایی"
                  className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500 focus-visible:ring-primary/40 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>شماره موبایل جهت هماهنگی</span>
                  <span className="text-red-400">*</span>
                </label>
                <Input
                  required
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500 text-left font-mono focus-visible:ring-primary/40 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span>آیدی تلگرام یا ایتا (اختیاری)</span>
                </label>
                <Input
                  dir="ltr"
                  value={telegramOrId}
                  onChange={(e) => setTelegramOrId(e.target.value)}
                  placeholder="@username"
                  className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500 text-left font-mono focus-visible:ring-primary/40 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>توضیحات یا لینک راش‌ها (اختیاری)</span>
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="تعداد راش‌ها، سبک تدوین یا زمان‌بندی مد نظرتان..."
                  rows={2}
                  className="rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500 focus-visible:ring-primary/40 focus-visible:border-primary text-xs resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(255,223,0,0.35)] transition-all cursor-pointer"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال ثبت و ذخیره اطلاعات...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SendHorizontal className="w-4 h-4" />
                      <span>ثبت درخواست و ذخیره برای دفعات بعد</span>
                    </div>
                  )}
                </Button>

                {savedProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="w-full py-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    بازگشت به حالت تایید ۱ کلیک
                  </button>
                )}
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
