"use client";

import { useEffect, useState } from "react";
import { Video, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLoader({
  show = true,
  minDuration = 600,
  onFinish,
}: {
  show?: boolean;
  minDuration?: number;
  onFinish?: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Fast initial progress
    const t1 = setTimeout(() => setProgress(65), 150);
    const t2 = setTimeout(() => setProgress(90), 350);

    const finishTimeout = setTimeout(() => {
      setProgress(100);
      setFading(true);
      const hideTimeout = setTimeout(() => {
        setVisible(false);
        if (onFinish) onFinish();
      }, 350);
      return () => clearTimeout(hideTimeout);
    }, minDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(finishTimeout);
    };
  }, [minDuration, onFinish]);

  if (!visible && !show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060608] transition-opacity duration-300 select-none",
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      aria-label="در حال بارگذاری..."
    >
      {/* Background ambient orbs */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm px-6">
        {/* Glowing Logo Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.15] backdrop-blur-2xl flex items-center justify-center text-primary shadow-[0_0_40px_rgba(255,223,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] animate-pulse">
            <Video className="w-10 h-10" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_10px_#ffdf00]">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* Brand Name & Slogan */}
        <div className="space-y-1.5">
          <h1
            className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              بومیم
            </span>
            <span className="text-zinc-600 font-mono text-sm">|</span>
            <span className="text-sm font-mono text-zinc-300 font-bold tracking-widest">
              BUMIM
            </span>
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            پلتفرم تخصصی و هوشمند تدوینگران ویدیویی
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-56 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] border border-white/[0.1] overflow-hidden p-[1px] backdrop-blur-md">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-primary to-yellow-300 transition-all duration-300 shadow-[0_0_12px_rgba(255,223,0,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 text-center">
            بارگذاری امکانات...
          </div>
        </div>
      </div>
    </div>
  );
}
