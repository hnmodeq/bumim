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

import { GlowMenu } from "@/components/ui/glow-menu";
import { GlowCard } from "@/components/ui/glow-card";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  Database,
  CheckCircle2,
  AlertCircle,
  Palette,
  Eye,
} from "lucide-react";

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>("");
  const [newServiceName, setNewServiceName] = useState("");
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [pendingNextServices, setPendingNextServices] = useState<Service[] | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((j) => (Array.isArray(j?.services) && j.services.length ? j.services : defaultServices))
      .catch(() => defaultServices)
      .then((data: Service[]) => {
        setServices(data);
        setActiveServiceId(data[0]?.id || "");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const save = (next: Service[], allowRetry = true) => {
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
        if (r.status === 401 && allowRetry) {
          setPendingNextServices(next);
          setIsPasswordDialogOpen(true);
          setStatus("نیاز به تایید رمز ادمین");
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

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adminPasswordInput.trim()) return;
    localStorage.setItem("bumim-admin-key", adminPasswordInput.trim());
    setIsPasswordDialogOpen(false);
    if (pendingNextServices) {
      save(pendingNextServices, false);
      setPendingNextServices(null);
    }
    setAdminPasswordInput("");
  };

  const addService = () => {
    if (!newServiceName.trim()) {
      toast.warning("لطفاً نام سرویس را وارد کنید");
      return;
    }
    const svc: Service = { id: Date.now().toString(), name: newServiceName.trim(), packages: [] };
    const next = [...services, svc];
    save(next);
    setActiveServiceId(svc.id);
    setNewServiceName("");
    toast.success(`سرویس «${svc.name}» افزوده شد`);
  };

  const deleteService = (id: string, name: string) => {
    if (!confirm(`آیا از حذف کامل سرویس «${name}» اطمینان دارید؟`)) return;
    const next = services.filter((s) => s.id !== id);
    save(next);
    if (activeServiceId === id) setActiveServiceId(next[0]?.id || "");
    toast.info(`سرویس «${name}» حذف شد`);
  };

  const updateServiceName = (id: string, name: string) => {
    const next = services.map((s) => (s.id === id ? { ...s, name } : s));
    save(next);
  };

  const openAddPackageDialog = () => {
    setEditingPackage({
      id: Date.now().toString(),
      name: "",
      price: "",
      per: "میلیون / دقیقه",
      features: ["", "", "", "", ""],
      color: colorOptions[0],
      popular: false,
    });
    setIsPackageDialogOpen(true);
  };

  const openEditPackageDialog = (pkg: Package) => {
    setEditingPackage({
      ...pkg,
      features: pkg.features && pkg.features.length ? [...pkg.features] : ["", "", "", "", ""],
    });
    setIsPackageDialogOpen(true);
  };

  const savePackageFromDialog = () => {
    if (!editingPackage || !editingPackage.name.trim()) {
      toast.warning("لطفاً نام پکیج را وارد کنید");
      return;
    }
    const pkgToSave = { ...editingPackage };
    const next = services.map((s) => {
      if (s.id !== activeServiceId) return s;
      const exists = s.packages.find((p) => p.id === pkgToSave.id);
      if (exists) {
        return { ...s, packages: s.packages.map((p) => (p.id === pkgToSave.id ? pkgToSave : p)) };
      }
      return { ...s, packages: [...s.packages, pkgToSave] };
    });
    save(next);
    setIsPackageDialogOpen(false);
    setEditingPackage(null);
  };

  const deletePackage = (pkgId: string, pkgName: string) => {
    if (!confirm(`آیا از حذف پکیج «${pkgName}» اطمینان دارید؟`)) return;
    const next = services.map((s) =>
      s.id === activeServiceId
        ? { ...s, packages: s.packages.filter((p) => p.id !== pkgId) }
        : s
    );
    save(next);
    toast.info(`پکیج «${pkgName}» حذف شد`);
  };

  const resetToDefaults = () => {
    if (!confirm("آیا مایلید تمام تعرفه‌ها به حالت پیش‌فرض اولیه بازگردانده شده و در دیتابیس ذخیره شود؟"))
      return;
    save(defaultServices);
    setActiveServiceId(defaultServices[0].id);
    toast.info("تعرفه‌ها به حالت پیش‌فرض بازگشت");
  };

  const active = services.find((s) => s.id === activeServiceId);

  return (
    <main className="min-h-screen bg-[#070709] text-foreground px-4 md:px-6 py-6 md:py-10 relative overflow-hidden selection:bg-primary/20">
      {/* Background ambient neon orbs */}
      <div className="absolute top-10 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Glow Menu Dock */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pb-8 z-20">
        <GlowMenu />
      </header>

      <div className="w-full max-w-5xl mx-auto relative z-10 space-y-6">
        {/* Top Header Card */}
        <GlowCard glowColor="#11ffba">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black shadow-[0_0_16px_rgba(17,255,186,0.25)]">
                  <Database className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-black text-white">پنل مدیریت تعرفه‌ها</h1>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[11px] font-mono shadow-[0_0_10px_rgba(17,255,186,0.2)]">
                  Supabase Live
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                ویرایش آنلاین سرویس‌ها، پکیج‌ها، قیمت‌ها و امکانات همراه با ذخیره بلادرنگ در دیتابیس ابری
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/services"
                target="_blank"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs gap-1.5 border-white/10 hover:bg-white/5 text-zinc-300")}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>مشاهده صفحه تعرفه‌ها</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefaults}
                className="text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ریست به پیش‌فرض</span>
              </Button>
            </div>
          </div>

          {status && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs">
              {status.startsWith("✓") ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_12px_rgba(17,255,186,0.2)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{status}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/50 text-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{status}</span>
                </div>
              )}
            </div>
          )}
        </GlowCard>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-2xl bg-white/5" />
            <Skeleton className="h-72 w-full rounded-2xl bg-white/5" />
          </div>
        ) : (
          <>
            {/* Services Section */}
            <GlowCard glowColor="#a855f7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>دسته‌بندی سرویس‌ها ({services.length})</span>
                  </h2>
                </div>

                {/* Service Pills */}
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => {
                    const isSelected = activeServiceId === s.id;
                    return (
                      <div
                        key={s.id}
                        className={cn(
                          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all duration-200",
                          isSelected
                            ? "bg-purple-500/20 text-white border-purple-500/50 shadow-[0_0_14px_rgba(168,85,247,0.3)] font-black"
                            : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveServiceId(s.id)}
                          className="cursor-pointer"
                        >
                          {s.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(s.id, s.name)}
                          className="w-4 h-4 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white/20"
                          title="حذف این سرویس"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-white/10" />

                {/* Add Service Bar */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Input
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="نام سرویس جدید (مثلاً: ادیت پادکست تصویری)"
                      className="bg-black/60 border-white/10 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addService();
                      }}
                    />
                  </div>
                  <Button onClick={addService} size="sm" className="font-bold gap-1.5 text-xs shadow-[0_0_14px_rgba(255,223,0,0.25)]">
                    <Plus className="w-4 h-4" />
                    <span>افزودن سرویس جدید</span>
                  </Button>
                </div>

                {/* Active service rename */}
                {active && (
                  <div className="flex items-center gap-3 pt-1">
                    <Label className="text-xs text-zinc-400 shrink-0">
                      ویرایش نام سرویس فعال:
                    </Label>
                    <Input
                      value={active.name}
                      onChange={(e) => updateServiceName(active.id, e.target.value)}
                      className="max-w-xs bg-black/60 border-white/10 text-xs h-8"
                    />
                  </div>
                )}
              </div>
            </GlowCard>

            {/* Packages Section */}
            {active && (
              <GlowCard glowColor="#ffdf00">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-black text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>پکیج‌های «{active.name}» ({active.packages.length})</span>
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        تنظیم نرخ، گرادینت، ویژگی‌های ۵گانه و نشان پرطرفدار
                      </p>
                    </div>

                    <Button
                      onClick={openAddPackageDialog}
                      size="sm"
                      className="font-bold gap-1.5 text-xs shadow-[0_0_14px_rgba(255,223,0,0.25)]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن پکیج جدید</span>
                    </Button>
                  </div>

                  <Separator className="bg-white/10" />

                  {active.packages.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-black/40">
                      <p className="text-xs text-zinc-400 mb-3">هنوز پکیجی برای این سرویس تعریف نشده است.</p>
                      <Button onClick={openAddPackageDialog} size="sm" variant="outline" className="text-xs">
                        افزودن اولین پکیج
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {active.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all"
                        >
                          <div className={`h-1 w-full absolute top-0 inset-x-0 bg-gradient-to-r ${pkg.color}`} />

                          <div className="space-y-3">
                            <div className="flex items-start justify-between pt-1">
                              <div>
                                <div className="text-sm font-black text-white flex items-center gap-2">
                                  <span>{pkg.name}</span>
                                  {pkg.popular && (
                                    <Badge className="bg-primary text-primary-foreground text-[10px] py-0 shadow-[0_0_8px_rgba(255,223,0,0.3)]">
                                      پرطرفدار
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[11px] text-zinc-400">{pkg.per}</div>
                              </div>
                              <div className="text-left font-mono">
                                <span className="text-lg font-black text-primary">{pkg.price}</span>
                              </div>
                            </div>

                            <Separator className="bg-white/10" />

                            <ul className="space-y-1 text-xs">
                              {pkg.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span
                                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                                      f === "—" ? "bg-white/10 text-zinc-500" : "bg-primary text-primary-foreground font-black"
                                    }`}
                                  >
                                    {f === "—" ? "—" : "✓"}
                                  </span>
                                  <span
                                    className={`truncate ${
                                      f === "—" ? "text-zinc-600 line-through" : "text-zinc-300"
                                    }`}
                                  >
                                    {f || "—"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openEditPackageDialog(pkg)}
                              className="flex-1 text-xs font-bold gap-1.5 bg-white/10 hover:bg-white/20 text-white"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>ویرایش</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePackage(pkg.id, pkg.name)}
                              className="text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlowCard>
            )}
          </>
        )}

        {/* Dialog for Package Add/Edit */}
        <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
          <DialogContent className="max-w-lg bg-zinc-950 border-white/10 text-white backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-black">
                {editingPackage && services.some((s) => s.packages.some((p) => p.id === editingPackage.id))
                  ? "ویرایش پکیج"
                  : "افزودن پکیج جدید"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                تنظیم مشخصات پکیج برای سرویس «{active?.name}»
              </DialogDescription>
            </DialogHeader>

            {editingPackage && (
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">نام پکیج</Label>
                  <Input
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    placeholder="مثلاً: اقتصادی، حرفه‌ای، موشن ۲۵"
                    className="text-xs bg-black/60 border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">قیمت</Label>
                    <Input
                      value={editingPackage.price}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                      placeholder="مثلاً: ۱.۴ یا ۴.۴"
                      className="text-xs font-mono bg-black/60 border-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">واحد و بازه</Label>
                    <Input
                      value={editingPackage.per}
                      onChange={(e) => setEditingPackage({ ...editingPackage, per: e.target.value })}
                      placeholder="میلیون / دقیقه"
                      className="text-xs bg-black/60 border-white/10"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
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
                          editingPackage.color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110" : "opacity-80 hover:opacity-100"
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
                        className="text-xs h-8 bg-black/60 border-white/10"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsPackageDialogOpen(false)} className="text-xs text-zinc-400">
                انصراف
              </Button>
              <Button onClick={savePackageFromDialog} className="text-xs font-bold gap-1.5 shadow-[0_0_14px_rgba(255,223,0,0.3)]">
                <Save className="w-3.5 h-3.5" />
                <span>ذخیره پکیج</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Password Prompt Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="max-w-md bg-zinc-950 border-white/10 text-white backdrop-blur-2xl">
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 shadow-[0_0_16px_rgba(255,223,0,0.2)]">
                <Lock className="w-5 h-5" />
              </div>
              <DialogTitle className="text-base font-black">رمز عبور پنل ادمین</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                برای ذخیره تغییرات در دیتابیس Supabase، لطفاً رمز ادمین را وارد کنید. این رمز در مرورگر شما ذخیره خواهد شد.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">رمز ادمین (ADMIN_PANEL_KEY)</Label>
                <Input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="رمز را وارد کنید..."
                  className="text-xs bg-black/60 border-white/10"
                  autoFocus
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => setIsPasswordDialogOpen(false)} className="text-xs text-zinc-400">
                  انصراف
                </Button>
                <Button type="submit" className="text-xs font-bold gap-1.5 shadow-[0_0_14px_rgba(255,223,0,0.3)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تایید و ذخیره</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
