"use client";

import { useState, useEffect } from "react";

import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  User,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Save,
} from "lucide-react";

const PROFILE_STORAGE_KEY = "bumim_customer_profile";

export default function AccountPage() {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [telegramOrId, setTelegramOrId] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.telegramOrId) setTelegramOrId(parsed.telegramOrId);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = { name, phone, telegramOrId };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <main className="flex-1 px-4 md:px-6 py-4 md:py-8 relative selection:bg-primary/20">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-zinc-200">مدیریت اطلاعات و هویت در بومیم</span>
            </div>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              ACCOUNT
            </span>{" "}
            <span>حساب کاربری و پروفایل</span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            اطلاعات خود را ذخیره کنید تا در تمام بخش‌های صدور فاکتور و ثبت سفارش سریع ۱ کلیک استفاده شود
          </p>
        </div>

        <FrostedCard accentGlow="rgba(255, 223, 0, 0.2)" className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(255,223,0,0.2)]">
                {name ? name.charAt(0) : <User className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base font-black text-white">{name || "پروفایل کاربری"}</h3>
                <p className="text-xs text-zinc-400">شناسایی خودکار در سفارش‌های ۱ کلیک</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>نام و نام خانوادگی</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: علی رضایی"
                className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>شماره تماس پیش‌فرض</span>
              </label>
              <Input
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912..."
                className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span>آیدی تلگرام یا ایتا</span>
              </label>
              <Input
                dir="ltr"
                value={telegramOrId}
                onChange={(e) => setTelegramOrId(e.target.value)}
                placeholder="@username"
                className="h-11 rounded-xl bg-white/[0.04] border-white/[0.1] text-white font-mono"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>اطلاعات پروفایل شما با موفقیت ذخیره شد.</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,223,0,0.3)] cursor-pointer"
            >
              <Save className="w-4 h-4 ml-1.5" />
              <span>ذخیره تغییرات پروفایل</span>
            </Button>
          </form>
        </FrostedCard>
      </div>
    </main>
  );
}
