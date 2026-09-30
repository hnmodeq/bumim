"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { GlowMenu } from "@/components/ui/glow-menu";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  typeOptions,
  durationOptions,
  countOptions,
  countMultiplier,
  basicServices,
  advancedServices,
  type PickerOption,
  type Service,
  type InvoiceItem,
  type TurnaroundSpeed,
  type EditorLevel,
  toPersianNumber,
  toPersianPrice,
  INVOICE_STORAGE_KEY,
} from "@/app/lib/invoice-types";
import {
  Sparkles,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Zap,
  TrendingUp,
} from "lucide-react";

function WheelPicker({
  options,
  selected,
  onSelect,
  ariaLabel,
}: {
  options: PickerOption[];
  selected: number;
  onSelect: (i: number) => void;
  ariaLabel: string;
}) {
  const ITEM_PX = 36;

  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startSelectedRef = useRef(selected);
  const lastWheelTimeRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef<number | null>(null);

  if (!isDraggingRef.current) {
    startSelectedRef.current = selected;
  }

  const clampIdx = useCallback(
    (i: number) => Math.min(Math.max(i, 0), options.length - 1),
    [options.length]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      let delta = e.deltaY;
      // @ts-ignore deltaMode exists
      if (e.deltaMode === 1) delta *= ITEM_PX;
      else if (e.deltaMode === 2) delta *= 120;

      const now = performance.now();
      const isTrackpadSmall = Math.abs(delta) < 50;
      wheelAccumRef.current += delta;

      const threshold = 42;
      if (Math.abs(wheelAccumRef.current) < threshold) return;

      const minInterval = isTrackpadSmall ? 135 : 175;
      if (now - lastWheelTimeRef.current < minInterval) return;

      const step = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      lastWheelTimeRef.current = now;

      const next = clampIdx(selected + step);
      if (next !== selected) {
        onSelect(next);
      }
    },
    [clampIdx, onSelect, selected]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      setIsDragging(true);
      startYRef.current = e.clientY;
      startSelectedRef.current = selected;
      dragOffsetRef.current = 0;
      setDragOffset(0);
      velocityRef.current = 0;
      lastYRef.current = e.clientY;
      lastTimeRef.current = performance.now();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [selected]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const dy = e.clientY - startYRef.current;
      const now = performance.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      velocityRef.current = (e.clientY - lastYRef.current) / dt;
      lastYRef.current = e.clientY;
      lastTimeRef.current = now;

      const maxOvershoot = ITEM_PX * 2;
      const minOffset = -(options.length - 1 - startSelectedRef.current) * ITEM_PX - maxOvershoot;
      const maxOffset = startSelectedRef.current * ITEM_PX + maxOvershoot;
      const clampedDy = Math.min(Math.max(dy, minOffset), maxOffset);

      dragOffsetRef.current = clampedDy;
      setDragOffset(clampedDy);
    },
    [options.length, startSelectedRef]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const projectedOffset = dragOffsetRef.current + velocityRef.current * 120;
    const stepsMoved = -Math.round(projectedOffset / ITEM_PX);
    const targetIdx = clampIdx(startSelectedRef.current + stepsMoved);

    setDragOffset(0);
    dragOffsetRef.current = 0;
    onSelect(targetIdx);
  }, [clampIdx, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        onSelect(clampIdx(selected + 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        onSelect(clampIdx(selected - 1));
      }
    },
    [clampIdx, onSelect, selected]
  );

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-[220px] overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-2xl"
    >
      {/* Center Highlight Bar */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[38px] rounded-xl bg-white/[0.08] border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.25)] z-0"
      />

      {/* Top & Bottom Gradient Fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0c0d12] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0d12] to-transparent z-10" />

      {/* Items Container */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
        style={{
          transform: `translateY(calc(-50% + ${dragOffset}px))`,
          transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {options.map((opt, i) => {
          const effectiveSelected = startSelectedRef.current;
          const offsetFromEffective = i - effectiveSelected;
          const continuousOffset = offsetFromEffective - dragOffset / ITEM_PX;
          const absOffset = Math.abs(continuousOffset);

          const rotateX = -continuousOffset * 18;
          const clampedAbs = Math.min(absOffset, 4);
          const opacity = Math.max(0.15, 1 - clampedAbs * 0.28);
          const scale = Math.max(0.75, 1 - clampedAbs * 0.07);

          const isExactCenter = Math.abs(continuousOffset) < 0.5;

          return (
            <div
              key={opt.label}
              onClick={() => onSelect(i)}
              className={cn(
                "h-[36px] flex items-center justify-center text-center transition-colors px-2 cursor-pointer",
                isExactCenter ? "text-primary font-black text-sm md:text-base drop-shadow-[0_0_12px_rgba(255,223,0,0.5)]" : "text-zinc-400 font-medium text-xs md:text-sm"
              )}
              style={{
                transform: `perspective(600px) rotateX(${rotateX}deg) scale(${scale})`,
                opacity,
              }}
            >
              <span className="truncate">{opt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ServiceItem({
  service,
  checked,
  onToggle,
}: {
  service: Service;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "p-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 select-none",
        checked
          ? "bg-white/[0.08] border-primary/50 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]"
          : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
      )}
    >
      <div className="flex items-center gap-2 truncate">
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-black"
        />
        <span className="font-bold truncate">{service.label}</span>
      </div>
      <span className="text-[10px] font-mono text-zinc-400 shrink-0">
        +{toPersianNumber(service.percent)}٪
      </span>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-[1px] flex-1 bg-white/[0.08]" />
      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      <div className="h-[1px] flex-1 bg-white/[0.08]" />
    </div>
  );
}

export default function CalculatorPage() {
  const router = useRouter();

  // Wheels state
  const [typeIdx, setTypeIdx] = useState(0);
  const [durationIdx, setDurationIdx] = useState(3); // 45s
  const [countIdx, setCountIdx] = useState(0); // 1 video

  // Services state
  const [basicChecked, setBasicChecked] = useState<Record<string, boolean>>({
    rough_cut: true,
    logo: true,
    music: true,
  });
  const [advChecked, setAdvChecked] = useState<Record<string, boolean>>({
    color: true,
  });

  // Speed & Seniority state
  const [turnaround, setTurnaround] = useState<TurnaroundSpeed>("standard");
  const [editorLevel, setEditorLevel] = useState<EditorLevel>("mid");

  // Stored invoice items count
  const [storedCount, setStoredCount] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(INVOICE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setStoredCount(parsed.length);
      }
    } catch {
      // ignore
    }
  }, []);

  const selectedServices = useMemo(() => {
    const list: { label: string; percent: number }[] = [];
    basicServices.forEach((s) => {
      if (basicChecked[s.id]) list.push({ label: s.label, percent: s.percent });
    });
    advancedServices.forEach((s) => {
      if (advChecked[s.id]) list.push({ label: s.label, percent: s.percent });
    });
    return list;
  }, [basicChecked, advChecked]);

  // Price Calculation formula with speed and seniority
  const price = useMemo(() => {
    const type = typeOptions[typeIdx];
    const dur = durationOptions[durationIdx];
    const cnt = countOptions[countIdx];

    const base = (type.base || 0) * (dur.factor || 1) * (cnt.factor || 1);
    const mult = countMultiplier[cnt.label] ?? 1.0;
    const subtotal = base * mult;

    const totalPercent = selectedServices.reduce((sum, s) => sum + s.percent, 0);
    const withServices = subtotal * (1 + totalPercent / 100);

    // Speed multiplier
    let speedMult = 1.0;
    if (turnaround === "fast") speedMult = 1.25;
    if (turnaround === "rush") speedMult = 1.5;

    // Seniority multiplier
    let levelMult = 1.0;
    if (editorLevel === "junior") levelMult = 0.8;
    if (editorLevel === "senior") levelMult = 1.35;

    const total = withServices * speedMult * levelMult;

    return {
      subtotal: Math.round(subtotal),
      totalPercent,
      speedMult,
      levelMult,
      total: Math.round(total),
    };
  }, [typeIdx, durationIdx, countIdx, selectedServices, turnaround, editorLevel]);

  const formattedPrice = useMemo(() => toPersianPrice(price.total), [price.total]);

  const speedLabels: Record<TurnaroundSpeed, string> = {
    standard: "عادی (۳ تا ۵ روز)",
    fast: "سریع (۴۸ ساعت)",
    rush: "فوری VIP (۲۴ ساعت)",
  };

  const levelLabels: Record<EditorLevel, string> = {
    junior: "جونیور (پایه)",
    mid: "میدلول (مسلط)",
    senior: "سنیور (حرفه‌ای)",
  };

  const handleAddToInvoice = () => {
    const newItem: InvoiceItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      typeLabel: typeOptions[typeIdx].label,
      durationLabel: durationOptions[durationIdx].label,
      countLabel: countOptions[countIdx].label,
      services: selectedServices,
      speedLabel: speedLabels[turnaround],
      levelLabel: levelLabels[editorLevel],
      subtotal: price.subtotal,
      totalPercent: price.totalPercent,
      total: price.total,
    };

    try {
      const stored = localStorage.getItem(INVOICE_STORAGE_KEY);
      const list: InvoiceItem[] = stored ? JSON.parse(stored) : [];
      list.push(newItem);
      localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(list));
      setStoredCount(list.length);
      toast.success("پروژه به پیش‌فاکتور افزوده شد!");
      router.push("/invoice");
    } catch {
      toast.error("خطا در ذخیره آیتم");
    }
  };

  return (
    <main className="min-h-screen bg-[#060608] text-foreground px-3 md:px-6 py-6 md:py-10 relative overflow-hidden selection:bg-primary/20">
      {/* Background ambient iridescent orbs */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Glow Menu Dock */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pb-8 z-20">
        <GlowMenu />
      </header>

      <div className="w-full max-w-4xl mx-auto space-y-5 relative z-10">
        {/* Main Calculator Frosted Card */}
        <FrostedCard accentGlow="rgba(255, 223, 0, 0.2)" className="p-5 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center gap-1.5 mx-auto">
              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-xs font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-zinc-200">ماشین حساب هوشمند دستمزد تدوین</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
              چقدر دستمزد بگیرم؟
            </h1>
            <p className="text-xs text-zinc-400">
              نوع پروژه، مدت زمان راش، تعداد ویدیو و شرایط تحویل را انتخاب کنید تا دستمزد منصفانه محاسبه شود
            </p>
          </div>

          {/* 3D Wheel Pickers Container */}
          <div className="grid grid-cols-3 gap-1 md:gap-2 p-2 md:p-3 rounded-3xl bg-white/[0.03] border border-white/[0.1] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-black text-zinc-400 mb-1">نوع پروژه</span>
              <WheelPicker
                options={typeOptions}
                selected={typeIdx}
                onSelect={setTypeIdx}
                ariaLabel="نوع پروژه"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-black text-zinc-400 mb-1">مدت زمان</span>
              <WheelPicker
                options={durationOptions}
                selected={durationIdx}
                onSelect={setDurationIdx}
                ariaLabel="مدت زمان"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-black text-zinc-400 mb-1">تعداد ویدیو</span>
              <WheelPicker
                options={countOptions}
                selected={countIdx}
                onSelect={setCountIdx}
                ariaLabel="تعداد ویدیو"
              />
            </div>
          </div>

          {/* Basic Services */}
          <div className="space-y-2">
            <SectionDivider label="خدمات پایه" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {basicServices.map((s) => (
                <ServiceItem
                  key={s.id}
                  service={s}
                  checked={!!basicChecked[s.id]}
                  onToggle={() => setBasicChecked((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                />
              ))}
            </div>
          </div>

          {/* Advanced Services */}
          <div className="space-y-2">
            <SectionDivider label="خدمات پیشرفته و تکمیلی" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {advancedServices.map((s) => (
                <ServiceItem
                  key={s.id}
                  service={s}
                  checked={!!advChecked[s.id]}
                  onToggle={() => setAdvChecked((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                />
              ))}
            </div>
          </div>

          {/* Speed & Seniority Modifiers */}
          <div className="space-y-3 pt-2">
            <SectionDivider label="سطح سابقه ادیتور و فوریت تحویل" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Turnaround Speed */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>سرعت تحویل کار:</span>
                  </span>
                  {price.speedMult > 1 && (
                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                      +{Math.round((price.speedMult - 1) * 100)}%
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {(
                    [
                      { id: "standard", label: "عادی", sub: "۳ تا ۵ روز" },
                      { id: "fast", label: "سریع", sub: "۴۸ ساعت" },
                      { id: "rush", label: "فوری VIP", sub: "۲۴ ساعت" },
                    ] as const
                  ).map((spd) => (
                    <button
                      key={spd.id}
                      type="button"
                      onClick={() => setTurnaround(spd.id)}
                      className={cn(
                        "py-1.5 px-1 rounded-lg text-center text-xs font-bold transition-all cursor-pointer",
                        turnaround === spd.id
                          ? "bg-white/[0.15] text-white border border-white/25 shadow-sm font-black"
                          : "text-zinc-400 hover:text-white"
                      )}
                    >
                      <div>{spd.label}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{spd.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Seniority */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>سطح تسلط و سابقه تدوینگر:</span>
                  </span>
                  {price.levelMult !== 1 && (
                    <span className="text-[10px] font-mono text-purple-300 font-bold">
                      {price.levelMult > 1 ? `+${Math.round((price.levelMult - 1) * 100)}%` : "-20%"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {(
                    [
                      { id: "junior", label: "جونیور", sub: "پایه" },
                      { id: "mid", label: "میدلول", sub: "مسلط" },
                      { id: "senior", label: "سنیور", sub: "حرفه‌ای" },
                    ] as const
                  ).map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setEditorLevel(lvl.id)}
                      className={cn(
                        "py-1.5 px-1 rounded-lg text-center text-xs font-bold transition-all cursor-pointer",
                        editorLevel === lvl.id
                          ? "bg-white/[0.15] text-white border border-white/25 shadow-sm font-black"
                          : "text-zinc-400 hover:text-white"
                      )}
                    >
                      <div>{lvl.label}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Price Summary Bar */}
          <div className="p-4 md:p-5 rounded-3xl bg-white/[0.04] border border-primary/40 shadow-[0_8px_32px_rgba(255,223,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-xl">
            <div className="text-center sm:text-right">
              <div className="text-xs text-zinc-400 font-medium">مبلغ برآورد این پروژه:</div>
              <div className="text-2xl md:text-3xl font-black text-primary tracking-tight font-mono">
                {formattedPrice} <span className="text-sm font-sans font-bold text-white">تومان</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleAddToInvoice}
                className="w-full sm:w-auto font-black text-xs h-11 px-6 rounded-xl gap-2 shadow-[0_0_24px_rgba(255,223,0,0.35)] hover:shadow-[0_0_36px_rgba(255,223,0,0.55)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن به پیش‌فاکتور و صدور PDF</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>

          {/* Existing Invoice Notice */}
          {storedCount > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>شما <strong>{toPersianNumber(storedCount)}</strong> پروژه آماده در پیش‌فاکتور دارید.</span>
              </div>
              <Link
                href="/invoice"
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>مشاهده و خروجی پیش‌فاکتور</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </FrostedCard>
      </div>
    </main>
  );
}
