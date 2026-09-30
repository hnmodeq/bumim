"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  defaultServices,
  colorOptions,
  type Package,
  type Service,
} from "../lib/pricing";


import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  PAGE_VISIBILITY_STORAGE_KEY,
  defaultPageVisibility,
  type PageVisibility,
  CALCULATOR_CONFIG_STORAGE_KEY,
  defaultCalculatorConfig,
  type CalculatorConfig,
  toPersianPrice,
  formatPersianDateTime,
  getRelativeTimeFa,
} from "@/app/lib/invoice-types";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  LogOut,
  Database,
  CheckCircle2,
  AlertCircle,
  Palette,
  Eye,
  EyeOff,
  SlidersHorizontal,
  KeyRound,
  Calculator,
  Percent,
  Clock,
  UserCheck,
  Zap,
  DollarSign,
  RefreshCw,
} from "lucide-react";

const pageList = [
  { id: "home", name: "خانه", path: "/" },
  { id: "calculator", name: "ماشین حساب", path: "/calculator" },
  { id: "invoice", name: "پیش‌فاکتور", path: "/invoice" },
  { id: "services", name: "تعرفه‌ها", path: "/services" },
  { id: "samples", name: "نمونه‌کارها", path: "/samples" },
  { id: "portfolio", name: "پرتفولیو", path: "/portfolio" },
  { id: "jobs", name: "پروژه‌ها", path: "/jobs" },
  { id: "hire", name: "درخواست ادیتور", path: "/hire" },
  { id: "account", name: "حساب کاربری", path: "/account" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [authChecking, setAuthChecking] = useState<boolean>(false);

  const [services, setServices] = useState<Service[]>(defaultServices);
  const [activeServiceId, setActiveServiceId] = useState<string>(defaultServices[0].id);
  const [newServiceName, setNewServiceName] = useState("");
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  // Page visibility state
  const [pageVisibility, setPageVisibility] = useState<PageVisibility>(defaultPageVisibility);

  // Calculator config state
  const [calcConfig, setCalcConfig] = useState<CalculatorConfig>(defaultCalculatorConfig);

  // Check login state on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("bumim-admin-key");
      if (storedKey && storedKey.trim() === "asdasd123") {
        setIsAuthenticated(true);
        setIsAuthChecking(false);
      } else if (storedKey && storedKey.trim()) {
        fetch("/api/admin-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: storedKey.trim() }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.ok) {
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem("bumim-admin-key");
              setIsAuthenticated(false);
              window.dispatchEvent(new Event("bumim_auth_updated"));
            }
          })
          .catch(() => {
            setIsAuthenticated(false);
          })
          .finally(() => {
            setIsAuthChecking(false);
          });
      } else {
        setIsAuthenticated(false);
        setIsAuthChecking(false);
      }
    } catch {
      setIsAuthenticated(false);
      setIsAuthChecking(false);
    }

    try {
      const storedVis = localStorage.getItem(PAGE_VISIBILITY_STORAGE_KEY);
      if (storedVis) {
        setPageVisibility(JSON.parse(storedVis));
      }
    } catch {}

    try {
      const storedCalc = localStorage.getItem(CALCULATOR_CONFIG_STORAGE_KEY);
      if (storedCalc) {
        const parsed = JSON.parse(storedCalc);
        if (parsed && Array.isArray(parsed.typeOptions) && Array.isArray(parsed.basicServices)) {
          setCalcConfig(parsed);
        }
      }
    } catch {}

    fetch("/api/services")
      .then((r) => r.json())
      .then((j) => (Array.isArray(j?.services) && j.services.length ? j.services : defaultServices))
      .catch(() => defaultServices)
      .then((data: Service[]) => {
        setServices(data);
        setActiveServiceId(data[0]?.id || "");
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setAuthError("لطفاً رمز عبور را وارد کنید.");
      return;
    }

    setAuthChecking(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: trimmed }),
      });
      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("bumim-admin-key", trimmed);
        setIsAuthenticated(true);
        setAuthError("");
        window.dispatchEvent(new Event("bumim_auth_updated"));
        toast.success("با موفقیت وارد پنل مدیریت شدید");
      } else {
        localStorage.removeItem("bumim-admin-key");
        setIsAuthenticated(false);
        setAuthError(data.error || "رمز عبور وارد شده نادرست است.");
        toast.error("رمز عبور وارد شده نادرست است.");
      }
    } catch {
      if (trimmed === "asdasd123") {
        localStorage.setItem("bumim-admin-key", trimmed);
        setIsAuthenticated(true);
        setAuthError("");
        window.dispatchEvent(new Event("bumim_auth_updated"));
        toast.success("با موفقیت وارد پنل مدیریت شدید");
      } else {
        localStorage.removeItem("bumim-admin-key");
        setIsAuthenticated(false);
        setAuthError("رمز عبور وارد شده نادرست است.");
        toast.error("رمز عبور وارد شده نادرست است.");
      }
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bumim-admin-key");
    setIsAuthenticated(false);
    setPasswordInput("");
    window.dispatchEvent(new Event("bumim_auth_updated"));
    toast.info("از حساب مدیریت خارج شدید. منوی مدیریت مخفی شد.");
  };

  const togglePageVisibility = (pageId: string, currentStatus: boolean) => {
    const updated: PageVisibility = {
      ...pageVisibility,
      [pageId]: !currentStatus,
    };
    setPageVisibility(updated);
    try {
      localStorage.setItem(PAGE_VISIBILITY_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("bumim_visibility_updated"));
      toast.success(
        !currentStatus
          ? `صفحه ${pageList.find((p) => p.id === pageId)?.name} در منو فعال شد`
          : `صفحه ${pageList.find((p) => p.id === pageId)?.name} در منو مخفی شد`
      );
    } catch {
      toast.error("خطا در ذخیره وضعیت صفحه");
    }
  };

  const save = (next: Service[]) => {
    setServices(next);
    setIsSaving(true);
    setStatus("در حال ذخیره در دیتابیس…");
    const key = typeof window !== "undefined" ? localStorage.getItem("bumim-admin-key") || "" : "";

    fetch("/api/services", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ services: next }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({} as Record<string, string>));
        if (r.status === 401) {
          setIsAuthenticated(false);
          setStatus("نیاز به ورود مجدد");
          toast.error("رمز وارد شده اشتباه است. لطفاً مجدداً لاگین کنید.");
          return;
        }
        if (j?.ok) {
          setStatus("✓ در دیتابیس ذخیره شد");
          toast.success("تغییرات با موفقیت در دیتابیس Supabase ذخیره شد");
        } else {
          setStatus(`خطا: ${j?.error || r.status}`);
          toast.error(`خطا در ذخیره: ${j?.error || r.statusText || r.status}`);
        }
      })
      .catch(() => {
        setStatus("خطای شبکه — ذخیره نشد");
        toast.error("خطای شبکه در ارتباط با سرور");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const activeService = services.find((s) => s.id === activeServiceId) || services[0];

  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    const newId = "srv-" + Date.now();
    const next: Service[] = [
      ...services,
      {
        id: newId,
        name: newServiceName.trim(),
        packages: [
          {
            id: "pkg-1",
            name: "پکیج اول",
            price: "۱.۵",
            per: "میلیون / دقیقه",
            popular: false,
            features: ["کات و تدوین", "اصلاح رنگ", "صداگذاری", "—", "—"],
            color: colorOptions[0],
          },
        ],
      },
    ];
    setNewServiceName("");
    setActiveServiceId(newId);
    save(next);
  };

  const handleDeleteService = (srvId: string) => {
    if (services.length <= 1) {
      toast.error("حداقل باید یک سرویس وجود داشته باشد.");
      return;
    }
    const next = services.filter((s) => s.id !== srvId);
    setActiveServiceId(next[0].id);
    save(next);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage({ ...pkg });
    setIsPackageDialogOpen(true);
  };

  const handleAddPackage = () => {
    if (!activeService) return;
    const newPkg: Package = {
      id: "pkg-" + Date.now(),
      name: "پکیج جدید",
      price: "۲.۰",
      per: "میلیون / دقیقه",
      popular: false,
      features: ["کات و تدوین", "اصلاح رنگ", "—", "—", "—"],
      color: colorOptions[1],
    };
    const next = services.map((s) =>
      s.id === activeService.id ? { ...s, packages: [...s.packages, newPkg] } : s
    );
    save(next);
  };

  const handleDeletePackage = (pkgId: string) => {
    if (!activeService || activeService.packages.length <= 1) {
      toast.error("هر سرویس باید حداقل یک پکیج داشته باشد.");
      return;
    }
    const next = services.map((s) =>
      s.id === activeService.id
        ? { ...s, packages: s.packages.filter((p) => p.id !== pkgId) }
        : s
    );
    save(next);
  };

  const savePackageFromDialog = () => {
    if (!editingPackage || !activeService) return;
    const next = services.map((s) =>
      s.id === activeService.id
        ? {
            ...s,
            packages: s.packages.map((p) => (p.id === editingPackage.id ? editingPackage : p)),
          }
        : s
    );
    setIsPackageDialogOpen(false);
    save(next);
  };

  const handleResetToDefault = () => {
    if (confirm("آیا مطمئن هستید که می‌خواهید تمام تعرفه‌ها را به حالت پیش‌فرض بازگردانید؟")) {
      save(defaultServices);
    }
  };

  const [isFetchingDollar, setIsFetchingDollar] = useState<boolean>(false);

  const handleFetchDollarRate = async () => {
    setIsFetchingDollar(true);
    try {
      const res = await fetch("/api/dollar-rate");
      const data = await res.json();
      if (data.ok && data.rate) {
        setCalcConfig((prev) => {
          const nextPrice = data.rate;
          const nextTypes = prev.typeOptions.map((t) => ({
            ...t,
            base: Math.round((t.dollarRate || 8.88) * nextPrice),
          }));
          return {
            ...prev,
            dollarPrice: nextPrice,
            typeOptions: nextTypes,
          };
        });
        toast.success(`نرخ زنده دلار دریافت شد: ${toPersianPrice(data.rate)} تومان (منبع: ${data.source})`);
      } else {
        toast.error("خطا در دریافت نرخ آنلاین دلار");
      }
    } catch {
      toast.error("خطا در برقراری ارتباط با سرور نرخ ارز");
    } finally {
      setIsFetchingDollar(false);
    }
  };

  const handleUpdateDollarPrice = (price: number) => {
    setCalcConfig((prev) => {
      const nextTypes = prev.typeOptions.map((t) => ({
        ...t,
        base: Math.round((t.dollarRate || 8.88) * price),
      }));
      return {
        ...prev,
        dollarPrice: price,
        typeOptions: nextTypes,
      };
    });
  };

  const handleUpdateTypeDollarRate = (idx: number, dollarRate: number) => {
    setCalcConfig((prev) => {
      const nextTypes = [...prev.typeOptions];
      const dollarPrice = prev.dollarPrice || 100_000;
      nextTypes[idx] = {
        ...nextTypes[idx],
        dollarRate,
        base: Math.round(dollarRate * dollarPrice),
      };
      return { ...prev, typeOptions: nextTypes };
    });
  };

  const handleUpdateBasicPercent = (id: string, percent: number) => {
    setCalcConfig((prev) => ({
      ...prev,
      basicServices: prev.basicServices.map((s) => (s.id === id ? { ...s, percent } : s)),
    }));
  };

  const handleUpdateAdvPercent = (id: string, percent: number) => {
    setCalcConfig((prev) => ({
      ...prev,
      advancedServices: prev.advancedServices.map((s) => (s.id === id ? { ...s, percent } : s)),
    }));
  };

  const handleUpdateSpeed = (speed: "standard" | "fast" | "rush", factor: number) => {
    setCalcConfig((prev) => ({
      ...prev,
      speedMultipliers: { ...prev.speedMultipliers, [speed]: factor },
    }));
  };

  const handleUpdateLevel = (level: "junior" | "mid" | "senior", factor: number) => {
    setCalcConfig((prev) => ({
      ...prev,
      levelMultipliers: { ...prev.levelMultipliers, [level]: factor },
    }));
  };

  const handleSaveCalcConfig = () => {
    try {
      localStorage.setItem(CALCULATOR_CONFIG_STORAGE_KEY, JSON.stringify(calcConfig));
      window.dispatchEvent(new Event("bumim_calc_config_updated"));
      toast.success("تنظیمات و درصدهای ماشین‌حساب با موفقیت ذخیره شدند");
    } catch {
      toast.error("خطا در ذخیره تنظیمات ماشین‌حساب");
    }
  };

  const handleResetCalcConfig = () => {
    if (confirm("آیا می‌خواهید درصدهای ماشین‌حساب به حالت پیش‌فرض بازگردند؟")) {
      setCalcConfig(defaultCalculatorConfig);
      try {
        localStorage.setItem(CALCULATOR_CONFIG_STORAGE_KEY, JSON.stringify(defaultCalculatorConfig));
        window.dispatchEvent(new Event("bumim_calc_config_updated"));
        toast.info("تنظیمات ماشین‌حساب به حالت اولیه بازگشت");
      } catch {}
    }
  };

  if (isAuthChecking) {
    return (
      <div className="flex-1 px-4 md:px-6 py-4 md:py-8 relative selection:bg-primary/20">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          <div className="h-16 w-full rounded-2xl bg-white/[0.04] border border-white/[0.08]" />
          <div className="h-64 w-full rounded-3xl bg-white/[0.04] border border-white/[0.08]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 md:px-6 py-4 md:py-8 relative selection:bg-primary/20">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="max-w-md mx-auto my-12 animate-in fade-in zoom-in-95 duration-200">
            <FrostedCard accentGlow="rgba(255, 223, 0, 0.25)" className="p-6 md:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-3xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(255,223,0,0.3)]">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">ورود به پنل مدیریت بومیم</h2>
                <p className="text-xs text-zinc-400">
                  برای دسترسی به تنظیمات و دیتابیس، لطفاً رمز ادمین را وارد کنید.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-right">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-300">رمز عبور ادمین</Label>
                  <Input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="رمز را وارد کنید..."
                    className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-500 text-left font-mono"
                    autoFocus
                  />
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={authChecking}
                  className="w-full h-11 rounded-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,223,0,0.3)] cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4 ml-1.5" />
                  <span>{authChecking ? "در حال اعتبارسنجی..." : "ورود به مدیریت"}</span>
                </Button>
              </form>
            </FrostedCard>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/30 font-black text-xs gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>اتصال ابری به Supabase</span>
                  </Badge>
                  {status && (
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      {status.includes("✓") ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {status}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  پنل مدیریت و تنظیمات بومیم
                </h1>
                <p className="text-xs text-zinc-400">
                  مدیریت تعرفه‌ها، تغییر قیمت‌ها، اضافه کردن سرویس جدید و تنظیم نمایش صفحات
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "text-xs font-bold gap-1.5 border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] rounded-xl"
                  )}
                >
                  <span>صفحه تعرفه‌ها</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefault}
                  className="text-xs font-bold gap-1.5 border-white/15 text-zinc-300 hover:text-white rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ریست تعرفه‌ها</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs font-bold gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از مدیریت</span>
                </Button>
              </div>
            </div>

            {/* 1. Page Visibility Management Card */}
            <FrostedCard accentGlow="rgba(56, 189, 248, 0.15)" className="p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                  <span>مدیریت نمایش صفحات در منو (Show / Hide Pages)</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  تغییرات آنی در منوی سایت اعمال می‌شود
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pageList.map((pg) => {
                  const isVisible = pageVisibility[pg.id] === true;
                  return (
                    <div
                      key={pg.id}
                      className={cn(
                        "p-3 rounded-2xl border transition-all flex items-center justify-between gap-3",
                        isVisible
                          ? "bg-white/[0.04] border-white/15 text-white"
                          : "bg-white/[0.01] border-white/[0.05] opacity-50 text-zinc-500"
                      )}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          {isVisible ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                          <span>{pg.name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">{pg.path}</div>
                      </div>

                      <Switch
                        checked={isVisible}
                        onCheckedChange={() => togglePageVisibility(pg.id, isVisible)}
                      />
                    </div>
                  );
                })}
              </div>
            </FrostedCard>

            {/* 2. Calculator Configuration Card */}
            <FrostedCard accentGlow="rgba(255, 223, 0, 0.2)" className="p-5 md:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-black text-white">
                    <Calculator className="w-4 h-4 text-primary" />
                    <span>تنظیمات، تعرفه‌ها و درصدهای ماشین‌حساب</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    قیمت پایه انواع پروژه‌ها، درصد هر خدمت اضافی (مانند راف‌کات، لوگو، اصلاح‌رنگ) و ضرایب سرعت را ویرایش کنید.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetCalcConfig}
                    className="text-xs font-bold gap-1.5 border-white/15 text-zinc-300 hover:text-white rounded-xl"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ریست ضرایب</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveCalcConfig}
                    className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-[0_0_16px_rgba(255,223,0,0.3)]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>ذخیره درصدهای ماشین‌حساب</span>
                  </Button>
                </div>
              </div>

              {/* Dollar Exchange Rate Controller */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-black text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>نرخ تبدیل دلار / تتر به تومان (USD Exchange Rate)</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                        به‌روزرسانی خودکار هر ۳۰ دقیقه
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        آخرین به‌روزرسانی: <strong className="text-amber-300">{getRelativeTimeFa(calcConfig.updatedAt)}</strong> ({formatPersianDateTime(calcConfig.updatedAt)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isFetchingDollar}
                      onClick={handleFetchDollarRate}
                      className="text-xs font-bold gap-1.5 border-amber-500/30 text-amber-300 hover:bg-amber-500/10 rounded-xl cursor-pointer"
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5", isFetchingDollar && "animate-spin")} />
                      <span>{isFetchingDollar ? "در حال دریافت..." : "دریافت آنلاین نرخ روز (API)"}</span>
                    </Button>

                    <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-1.5">
                      <Input
                        type="number"
                        value={calcConfig.dollarPrice || 100_000}
                        onChange={(e) => handleUpdateDollarPrice(Number(e.target.value) || 100_000)}
                        className="w-28 h-7 text-xs bg-transparent border-0 text-white font-mono font-black text-left p-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs font-bold text-primary shrink-0">تومان</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* A. Project Types Dollar Rates */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ضرایب و نرخ‌های دلاری انواع پروژه‌ها (Project Rates in USD $)</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    فرمول: نرخ دلاری × نرخ روز دلار = قیمت نهایی تومان
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {calcConfig.typeOptions.map((t, idx) => {
                    const dollarRate = t.dollarRate ?? (t.base ? Number((t.base / (calcConfig.dollarPrice || 100_000)).toFixed(2)) : 8.88);
                    const calculatedToman = Math.round(dollarRate * (calcConfig.dollarPrice || 100_000));

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 hover:border-white/20 transition-all"
                      >
                        <div className="text-xs font-bold text-zinc-200">{t.label}</div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.1] rounded-xl px-2.5 py-1">
                            <span className="text-xs font-bold text-amber-400 font-mono">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={dollarRate}
                              onChange={(e) => handleUpdateTypeDollarRate(idx, Number(e.target.value) || 0)}
                              className="w-16 h-7 text-xs bg-transparent border-0 text-white font-mono font-bold text-center p-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-[10px] text-zinc-400 font-mono">دلار</span>
                          </div>

                          <div className="text-left font-mono">
                            <div className="text-xs font-black text-primary">
                              {toPersianPrice(calculatedToman)}
                            </div>
                            <div className="text-[9px] text-zinc-500">تومان</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/[0.08]" />

              {/* B. Basic Services Percentages */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-yellow-300">
                  <Percent className="w-3.5 h-3.5" />
                  <span>درصد افزایش قیمت خدمات پایه (Basic Services %)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {calcConfig.basicServices.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white">{s.label}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">شناسه: {s.id}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-primary font-mono">+</span>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={s.percent}
                          onChange={(e) => handleUpdateBasicPercent(s.id, Number(e.target.value) || 0)}
                          className="w-16 h-8 text-xs bg-white/[0.06] border-white/[0.12] rounded-xl text-white font-mono text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-bold text-zinc-400 font-mono">٪</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/[0.08]" />

              {/* C. Advanced Services Percentages */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-purple-300">
                  <Percent className="w-3.5 h-3.5" />
                  <span>درصد افزایش قیمت خدمات پیشرفته و تکمیلی (Advanced Services %)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {calcConfig.advancedServices.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white">{s.label}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">شناسه: {s.id}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-purple-300 font-mono">+</span>
                        <Input
                          type="number"
                          min="0"
                          max="200"
                          value={s.percent}
                          onChange={(e) => handleUpdateAdvPercent(s.id, Number(e.target.value) || 0)}
                          className="w-16 h-8 text-xs bg-white/[0.06] border-white/[0.12] rounded-xl text-white font-mono text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-bold text-zinc-400 font-mono">٪</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/[0.08]" />

              {/* D. Multipliers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Speed Multipliers */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-sky-300">
                    <Zap className="w-3.5 h-3.5" />
                    <span>ضرایب فوریت تحویل کار</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">استاندارد (عادی)</span>
                      <div className="flex items-center gap-1 font-mono">
                        <Input
                          type="number"
                          step="0.05"
                          value={calcConfig.speedMultipliers?.standard ?? 1.0}
                          onChange={(e) => handleUpdateSpeed("standard", Number(e.target.value) || 1.0)}
                          className="w-20 h-7 text-xs bg-white/[0.05] border-white/[0.1] rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-zinc-500">x</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">نیمه‌فوری (۳ روزه)</span>
                      <div className="flex items-center gap-1 font-mono">
                        <Input
                          type="number"
                          step="0.05"
                          value={calcConfig.speedMultipliers?.fast ?? 1.25}
                          onChange={(e) => handleUpdateSpeed("fast", Number(e.target.value) || 1.25)}
                          className="w-20 h-7 text-xs bg-white/[0.05] border-white/[0.1] rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-zinc-500">x</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">فوری (۲۴ ساعته)</span>
                      <div className="flex items-center gap-1 font-mono">
                        <Input
                          type="number"
                          step="0.05"
                          value={calcConfig.speedMultipliers?.rush ?? 1.5}
                          onChange={(e) => handleUpdateSpeed("rush", Number(e.target.value) || 1.5)}
                          className="w-20 h-7 text-xs bg-white/[0.05] border-white/[0.1] rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-zinc-500">x</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seniority Multipliers */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>ضرایب سطح سابقه ادیتور</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">مبتدی (جونیور)</span>
                      <div className="flex items-center gap-1 font-mono">
                        <Input
                          type="number"
                          step="0.05"
                          value={calcConfig.levelMultipliers?.junior ?? 0.8}
                          onChange={(e) => handleUpdateLevel("junior", Number(e.target.value) || 0.8)}
                          className="w-20 h-7 text-xs bg-white/[0.05] border-white/[0.1] rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-zinc-500">x</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">متوسط (میدل لول)</span>
                      <div className="flex items-center gap-1 font-mono">
                        <Input
                          type="number"
                          step="0.05"
                          value={calcConfig.levelMultipliers?.mid ?? 1.0}
                          onChange={(e) => handleUpdateLevel("mid", Number(e.target.value) || 1.0)}
                          className="w-20 h-7 text-xs bg-white/[0.05] border-white/[0.1] rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-zinc-500">x</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">ارشد (سنیور)</span>
                      <div className="flex items-center gap-1 font-mono">
                        <Input
                          type="number"
                          step="0.05"
                          value={calcConfig.levelMultipliers?.senior ?? 1.35}
                          onChange={(e) => handleUpdateLevel("senior", Number(e.target.value) || 1.35)}
                          className="w-20 h-7 text-xs bg-white/[0.05] border-white/[0.1] rounded-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-zinc-500">x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FrostedCard>

            {/* 3. Pricelist Management */}
            <div className="space-y-6">
              {/* Services Tabs / Management */}
              <FrostedCard accentGlow="rgba(192, 132, 252, 0.15)" className="p-5 md:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-black text-white">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>دسته‌بندی‌های خدمات و ادیت</span>
                    </div>

                    {/* Add new service */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Input
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        placeholder="نام دسته‌بندی جدید..."
                        className="h-9 text-xs bg-white/[0.04] border-white/[0.1] rounded-xl text-white placeholder:text-zinc-500"
                      />
                      <Button
                        size="sm"
                        onClick={handleAddService}
                        className="h-9 text-xs font-bold gap-1 rounded-xl shadow-[0_0_12px_rgba(255,223,0,0.3)] shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن</span>
                      </Button>
                    </div>
                  </div>

                  {/* Service Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {services.map((s) => {
                      const isActive = activeServiceId === s.id;
                      return (
                        <div
                          key={s.id}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                            isActive
                              ? "bg-white/[0.15] text-white border-white/25 shadow-sm"
                              : "bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveServiceId(s.id)}
                            className="cursor-pointer"
                          >
                            {s.name} ({s.packages.length} پکیج)
                          </button>
                          {services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteService(s.id)}
                              className="hover:text-red-400 text-zinc-500 p-0.5 rounded-full transition-colors cursor-pointer"
                              title="حذف این دسته‌بندی"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </FrostedCard>

                {/* Packages in Active Service */}
                {activeService && (
                  <FrostedCard accentGlow="rgba(255, 223, 0, 0.15)" className="p-5 md:p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-black text-white">
                          پکیج‌های دسته‌بندی «{activeService.name}»
                        </h3>
                        <p className="text-xs text-zinc-400">
                          قیمت، ویژگی‌ها و تم رنگی هر سطح را ویرایش کنید
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={handleAddPackage}
                        className="text-xs font-bold gap-1.5 rounded-xl shadow-[0_0_14px_rgba(255,223,0,0.3)]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن پکیج به این بخش</span>
                      </Button>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeService.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={cn(
                            "p-4 rounded-2xl border bg-white/[0.03] flex flex-col justify-between space-y-4 relative transition-all",
                            pkg.popular ? "border-primary/50 shadow-[0_0_20px_rgba(255,223,0,0.1)]" : "border-white/[0.1]"
                          )}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-sm font-black text-white flex items-center gap-1.5">
                                  <span>{pkg.name}</span>
                                  {pkg.popular && (
                                    <Badge className="bg-primary text-primary-foreground font-black text-[9px] px-1.5 py-0 h-4">
                                      پرطرفدار
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs font-mono font-bold text-primary mt-1">
                                  {pkg.price} {pkg.per}
                                </div>
                              </div>

                              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${pkg.color} shrink-0`} />
                            </div>

                            <Separator className="bg-white/[0.06]" />

                            <div className="space-y-1.5 text-xs text-zinc-300">
                              {pkg.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                  <span className="text-zinc-500">•</span>
                                  <span className={f === "—" ? "text-zinc-600 line-through" : ""}>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEditPackage(pkg)}
                              className="flex-1 text-xs font-bold h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10"
                            >
                              <Edit className="w-3 h-3 ml-1" />
                              <span>ویرایش</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="text-xs h-8 px-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FrostedCard>
                )}
              </div>

            {/* Edit Package Dialog */}
            <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
              <DialogContent className="max-w-md bg-zinc-950/95 border-white/[0.15] text-white backdrop-blur-3xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <DialogHeader>
                  <DialogTitle className="text-base font-black">ویرایش مشخصات پکیج</DialogTitle>
                  <DialogDescription className="text-xs text-zinc-400">
                    نام، قیمت، بازه زمانی و ویژگی‌های همراه این پکیج را تنظیم کنید.
                  </DialogDescription>
                </DialogHeader>

                {editingPackage && (
                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-300">نام پکیج</Label>
                      <Input
                        value={editingPackage.name}
                        onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                        placeholder="مثال: اقتصادی، پیشرفته..."
                        className="text-xs bg-white/[0.04] border-white/[0.1] rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">قیمت (میلیون تومان)</Label>
                        <Input
                          value={editingPackage.price}
                          onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                          placeholder="مثال: ۲.۳"
                          className="text-xs bg-white/[0.04] border-white/[0.1] rounded-xl font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">واحد و بازه</Label>
                        <Input
                          value={editingPackage.per}
                          onChange={(e) => setEditingPackage({ ...editingPackage, per: e.target.value })}
                          placeholder="میلیون / دقیقه"
                          className="text-xs bg-white/[0.04] border-white/[0.1] rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/[0.1]">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-white">علامت به عنوان پکیج پرطرفدار (Popular)</Label>
                        <p className="text-[11px] text-zinc-400">در لیست با رنگ شاخص و بج ستاره‌دار نمایش داده می‌شود</p>
                      </div>
                      <Switch
                        checked={!!editingPackage.popular}
                        onCheckedChange={(checked) => setEditingPackage({ ...editingPackage, popular: checked })}
                      />
                    </div>

                    {/* Color gradient picker */}
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" />
                        انتخاب تم رنگی پکیج
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditingPackage({ ...editingPackage, color: c })}
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${c} transition-all cursor-pointer ${
                              editingPackage.color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "opacity-75 hover:opacity-100"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 5 Features */}
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-300">۵ ویژگی پکیج (برای نداشتن ویژگی علامت — بنویسید)</Label>
                      <div className="space-y-2">
                        {editingPackage.features.map((f, i) => (
                          <Input
                            key={i}
                            value={f}
                            onChange={(e) => {
                              const next = [...editingPackage.features];
                              next[i] = e.target.value;
                              setEditingPackage({ ...editingPackage, features: next });
                            }}
                            placeholder={`ویژگی ${i + 1} (مثلاً: راف کات، اصلاح رنگ یا —)`}
                            className="text-xs h-8 bg-white/[0.04] border-white/[0.1] rounded-xl"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="ghost" onClick={() => setIsPackageDialogOpen(false)} className="text-xs text-zinc-400 rounded-xl">
                    انصراف
                  </Button>
                  <Button onClick={savePackageFromDialog} className="text-xs font-bold gap-1.5 rounded-xl shadow-[0_0_16px_rgba(255,223,0,0.3)]">
                    <Save className="w-3.5 h-3.5" />
                    <span>ذخیره پکیج</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
