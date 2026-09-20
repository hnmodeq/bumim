"use client";

import { useState, useMemo, useRef, useCallback } from "react";

type PickerOption = { label: string; factor?: number; base?: number };

const typeOptions: PickerOption[] = [
  { label: "ریلز اینستاگرامی", base: 888_000 },
  { label: "ویدیو بلند یوتوبی", base: 1_068_000 },
  { label: "ویدیوی موزیکال", base: 1_266_000 },
  { label: "تیزر تبلیغاتی", base: 1_166_667 },
  { label: "موشن گرافیک ۲ بعدی", base: 1_498_000 },
  { label: "موشن گرافیک ۲.۵ بعدی", base: 1_928_000 },
  { label: "دوره آموزشی", base: 1_718_000 },
];

const durationOptions: PickerOption[] = [
  { label: "ثانیه ۱۰", factor: 0.62 },
  { label: "ثانیه ۱۵", factor: 0.78 },
  { label: "ثانیه ۳۰", factor: 0.90 },
  { label: "ثانیه ۴۵", factor: 1.0 },
  { label: "ثانیه ۶۰", factor: 1.27 },
  { label: "دقیقه ۲", factor: 1.94 },
  { label: "دقیقه ۳", factor: 2.4 },
  { label: "دقیقه ۴", factor: 2.85 },
  { label: "دقیقه ۵", factor: 3.25 },
  { label: "دقیقه ۱۵", factor: 5.5 },
  { label: "دقیقه ۳۰", factor: 8.0 },
  { label: "دقیقه ۶۰", factor: 11.5 },
  { label: "ساعت ۲", factor: 16 },
  { label: "ساعت ۳", factor: 20 },
  { label: "ساعت ۴", factor: 23 },
  { label: "ساعت ۵", factor: 26 },
  { label: "ساعت ۶", factor: 29 },
  { label: "ساعت ۷", factor: 32 },
  { label: "ساعت ۸", factor: 35 },
  { label: "ساعت ۹", factor: 38 },
  { label: "ساعت ۱۰", factor: 41 },
  { label: "ساعت ۱۵", factor: 52 },
  { label: "ساعت ۲۰", factor: 62 },
  { label: "ساعت ۳۰", factor: 80 },
  { label: "ساعت ۴۰", factor: 96 },
  { label: "ساعت ۵۰", factor: 112 },
  { label: "ساعت ۷۵", factor: 145 },
  { label: "ساعت ۱۰۰", factor: 175 },
  { label: "ساعت ۲۵۰", factor: 320 },
  { label: "ساعت ۵۰۰", factor: 520 },
  { label: "ساعت ۷۵۰", factor: 680 },
  { label: "ساعت ۱۰۰۰", factor: 820 },
];

const countOptions: PickerOption[] = [
  { label: "ویدیو ۱", factor: 1.0 },
  { label: "ویدیو ۲", factor: 1.85 },
  { label: "ویدیو ۳", factor: 2.65 },
  { label: "ویدیو ۴", factor: 3.35 },
  { label: "ویدیو ۵", factor: 4.0 },
  { label: "ویدیو ۶", factor: 4.65 },
  { label: "ویدیو ۷", factor: 5.25 },
  { label: "ویدیو ۸", factor: 5.85 },
  { label: "ویدیو ۹", factor: 6.40 },
];

const countMultiplier: Record<string, number> = {
  "ویدیو ۱": 0.90,
  "ویدیو ۲": 0.96,
  "ویدیو ۳": 1.02,
  "ویدیو ۴": 1.11,
  "ویدیو ۵": 1.20,
  "ویدیو ۶": 1.32,
  "ویدیو ۷": 1.44,
  "ویدیو ۸": 1.56,
  "ویدیو ۹": 1.68,
};

type Service = {
  id: string;
  label: string;
  percent: number;
};

function hashPercent(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 33 + id.charCodeAt(i)) >>> 0;
  }
  h = (h ^ (h >>> 16)) >>> 0;
  return 6 + (h % 13);
}

const basicServices: Service[] = [
  { id: "rough_cut", label: "راف کات", percent: hashPercent("rough_cut") },
  { id: "logo", label: "درج لوگو", percent: hashPercent("logo") },
  { id: "music", label: "موزیک", percent: hashPercent("music") },
  { id: "subtitle", label: "زیرنویس", percent: hashPercent("subtitle") },
  { id: "transition", label: "ترنزیشن", percent: hashPercent("transition") },
  { id: "intro_outro", label: "اینترو / آترو", percent: hashPercent("intro_outro") },
];

const advancedServices: Service[] = [
  { id: "sfx", label: "افکت صوتی", percent: hashPercent("sfx") },
  { id: "vfx", label: "افکت تصویری", percent: hashPercent("vfx") },
  { id: "motion_light", label: "موشن گرافیک سبک", percent: hashPercent("motion_light") },
  { id: "motion_heavy", label: "موشن گرافیک سنگین", percent: hashPercent("motion_heavy") },
  { id: "rotoscope", label: "روتوسکپی", percent: hashPercent("rotoscope") },
  { id: "color", label: "اصلاح رنگ", percent: hashPercent("color") },
  { id: "typo", label: "تایپوگرافی", percent: hashPercent("typo") },
  { id: "overlay", label: "اورلی", percent: hashPercent("overlay") },
  { id: "mastering", label: "مسترینگ صدا", percent: hashPercent("mastering") },
];

function toPersianNumber(num: number) {
  const latin = num.toLocaleString("en-US");
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return latin.replace(/\d/g, (d) => persianDigits[Number(d)]);
}
function toPersianPrice(num: number) {
  const latin = num.toLocaleString("en-US");
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return latin.replace(/\d/g, (d) => persianDigits[Number(d)]);
}

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
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startSelected = useRef(selected);
  const wheelThrottle = useRef<number | null>(null);

  const anglePerItem = 22;
  const radius = 115;

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (wheelThrottle.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.min(Math.max(selected + dir, 0), options.length - 1);
      if (next !== selected) onSelect(next);
      wheelThrottle.current = window.setTimeout(() => {
        wheelThrottle.current = null;
      }, 140) as unknown as number;
    },
    [selected, onSelect, options.length]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = true;
      startY.current = e.touches[0].clientY;
      startSelected.current = selected;
    },
    [selected]
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      const dy = e.touches[0].clientY - startY.current;
      const steps = Math.round(dy / 36);
      const next = Math.min(Math.max(startSelected.current - steps, 0), options.length - 1);
      if (next !== selected) onSelect(next);
    },
    [selected, onSelect, options.length]
  );
  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      startY.current = e.clientY;
      startSelected.current = selected;
      const onMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const dy = ev.clientY - startY.current;
        const steps = Math.round(dy / 36);
        const next = Math.min(Math.max(startSelected.current - steps, 0), options.length - 1);
        if (next !== selected) onSelect(next);
      };
      const onUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        document.body.style.overflow = "";
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [selected, onSelect, options.length]
  );

  const handleMouseEnter = useCallback(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "contain";
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (!isDragging.current) {
      document.body.style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelect(Math.max(selected - 1, 0));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelect(Math.min(selected + 1, options.length - 1));
      }
    },
    [selected, onSelect, options.length]
  );

  return (
    <div
      tabIndex={0}
      aria-label={ariaLabel}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className="relative w-full h-[220px] md:h-[260px] select-none outline-none cursor-grab active:cursor-grabbing group bg-transparent"
      style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}
    >
      {/* side indicators only - no background */}
      <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-[3px] h-[28px] bg-[#ffdf00] rounded-full shadow-[0_0_8px_#ffdf00] pointer-events-none z-10" />
      <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-[3px] h-[28px] bg-[#11ffba] rounded-full shadow-[0_0_8px_#11ffba] pointer-events-none z-10" />

      {/* fades - fully transparent */}
      <div className="absolute inset-x-0 top-0 h-[24px] bg-gradient-to-b from-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-[24px] bg-gradient-to-t from-transparent to-transparent pointer-events-none z-10" />

      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(${-radius}px) rotateX(${selected * anglePerItem}deg)`,
          transition: "transform 680ms cubic-bezier(0.23, 1, 0.32, 1)",
          willChange: "transform",
        }}
      >
        {options.map((opt, idx) => {
          const offset = idx - selected;
          const abs = Math.abs(offset);
          const isSelected = offset === 0;
          let opacity = 1;
          let scale = 1;
          let blur: string | undefined = undefined;
          if (abs === 0) {
            opacity = 1;
            scale = 1.06;
          } else if (abs === 1) {
            opacity = 0.78;
            scale = 0.92;
          } else if (abs === 2) {
            opacity = 0.42;
            scale = 0.82;
            blur = "0.4px";
          } else if (abs === 3) {
            opacity = 0.22;
            scale = 0.74;
            blur = "0.8px";
          } else {
            opacity = 0.08;
            scale = 0.68;
            blur = "1.2px";
          }
          const color = isSelected ? "#ffffff" : abs === 1 ? "#ededed" : "#9a9a9a";
          return (
            <button
              key={opt.label}
              onClick={() => onSelect(idx)}
              aria-selected={isSelected}
              className="absolute left-0 right-0 flex items-center justify-center text-center select-none"
              style={{
                top: "50%",
                height: "52px",
                marginTop: "-26px",
                transform: `rotateX(${-idx * anglePerItem}deg) translateZ(${radius}px) scale(${scale})`,
                opacity,
                filter: blur ? `blur(${blur})` : undefined,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transition:
                  "opacity 520ms cubic-bezier(0.23,1,0.32,1), transform 520ms cubic-bezier(0.23,1,0.32,1), filter 520ms ease, color 300ms ease",
                willChange: "transform, opacity",
              }}
            >
              <span
                className={`block w-full px-1.5 md:px-2 text-center tracking-tight leading-none whitespace-nowrap overflow-hidden text-ellipsis ${
                  isSelected
                    ? "text-[15px] md:text-[18px] font-black"
                    : abs === 1
                      ? "text-[12px] md:text-[13px] font-bold"
                      : "text-[11px] md:text-[12px] font-medium"
                }`}
                style={{
                  color,
                  textShadow: isSelected
                    ? "0 1px 12px rgba(255,223,0,0.35), 0 0 24px rgba(17,255,186,0.22)"
                    : "none",
                  transform: isSelected ? "translateZ(8px)" : "translateZ(0)",
                  transition: "color 300ms ease, text-shadow 400ms ease",
                }}
              >
                {opt.label}
              </span>
            </button>
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
    <button
      onClick={onToggle}
      className={`group w-full flex items-center justify-between gap-2 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer select-none backdrop-blur-sm border ${
        checked
          ? "bg-[#242424]/90 border-[#ffdf00]/45 shadow-[0_0_12px_rgba(255,223,0,0.15)]"
          : "bg-[#1a1a1a]/70 hover:bg-[#242424]/80 border-[#2a2a2a] hover:border-[#ffdf00]/25"
      }`}
    >
      <span
        className={`text-[13px] md:text-[14px] font-bold transition-colors duration-300 text-right flex-1 ${
          checked ? "text-white" : "text-[#ededed]/90"
        }`}
      >
        {service.label}
      </span>

      <span
        className={`relative inline-flex items-center justify-center w-[20px] h-[20px] md:w-[22px] md:h-[22px] rounded-[6px] border-[1.8px] transition-all duration-300 shrink-0
        ${checked ? "bg-[#ffdf00] border-[#ffdf00] shadow-[0_0_12px_rgba(255,223,0,0.45)]" : "bg-transparent border-[#2a2a2a] group-hover:border-[#ffdf00]/50"}
        `}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 14 14" className="text-[#0a0a0a]">
            <path
              d="M2.8 7 L5.6 9.8 L11.2 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span
        className={`text-[12px] md:text-[13px] font-black tracking-tight min-w-[44px] text-left font-mono transition-colors duration-300
        ${checked ? "text-[#ffdf00]" : "text-[#9a9a9a]/60"}
        `}
      >
        +{toPersianNumber(service.percent)}%
      </span>
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 w-full max-w-[640px] mx-auto my-3 md:my-4">
      <div className="h-[1.5px] flex-1 rounded-full bg-gradient-to-r from-transparent via-[#2a2a2a] to-[#333333]" />
      <span className="text-[11px] md:text-[12px] font-black tracking-[0.12em] uppercase whitespace-nowrap text-[#ffdf00]">
        {label}
      </span>
      <div className="h-[1.5px] flex-1 rounded-full bg-gradient-to-l from-transparent via-[#2a2a2a] to-[#333333]" />
    </div>
  );
}

export default function Page() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [durationIdx, setDurationIdx] = useState(0);
  const [countIdx, setCountIdx] = useState(0);

  const [basicChecked, setBasicChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(basicServices.map((s) => [s.id, false]))
  );
  const [advChecked, setAdvChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(advancedServices.map((s) => [s.id, false]))
  );

  const price = useMemo(() => {
    const base = typeOptions[typeIdx].base ?? 1_166_667;
    const durFactor = durationOptions[durationIdx].factor ?? 1;
    const cntLabel = countOptions[countIdx].label;
    const cntFactor = countMultiplier[cntLabel] ?? 1;
    const subtotal = base * durFactor * cntFactor;
    const basicPercent = basicServices.reduce((sum, s) => (basicChecked[s.id] ? sum + s.percent : sum), 0);
    const advPercent = advancedServices.reduce((sum, s) => (advChecked[s.id] ? sum + s.percent : sum), 0);
    const totalPercent = basicPercent + advPercent;
    const total = Math.round(subtotal * (1 + totalPercent / 100));
    const rounded = Math.round(total / 10000) * 10000;
    return { total: rounded, subtotal: Math.round(subtotal), totalPercent };
  }, [typeIdx, durationIdx, countIdx, basicChecked, advChecked]);

  const toggleBasic = useCallback((id: string) => setBasicChecked((p) => ({ ...p, [id]: !p[id] })), []);
  const toggleAdv = useCallback((id: string) => setAdvChecked((p) => ({ ...p, [id]: !p[id] })), []);

  const handleSelectAll = useCallback(() => {
    setBasicChecked(Object.fromEntries(basicServices.map((s) => [s.id, true])));
    setAdvChecked(Object.fromEntries(advancedServices.map((s) => [s.id, true])));
  }, []);

  const handleReset = useCallback(() => {
    setTypeIdx(0);
    setDurationIdx(0);
    setCountIdx(0);
    setBasicChecked(Object.fromEntries(basicServices.map((s) => [s.id, false])));
    setAdvChecked(Object.fromEntries(advancedServices.map((s) => [s.id, false])));
  }, []);

  const formattedPrice = useMemo(() => {
    const latin = price.total.toLocaleString("en-US");
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return latin.replace(/\d/g, (d) => persianDigits[Number(d)]);
  }, [price.total]);

  return (
    <main
      suppressHydrationWarning
      className="w-full min-h-screen flex flex-col items-center px-4 md:px-6 pb-4 md:pb-6 pt-4 md:pt-6 bg-[#0a0a0a] relative overflow-hidden selection:bg-[#ffdf00]/30"
    >
      <div className="absolute inset-0 bumim-grid opacity-[0.04] pointer-events-none" />
      <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_center,_rgba(255,223,0,0.09),transparent_60%)] pointer-events-none blur-[1px]" />
      <div className="absolute -top-[10%] -right-[20%] w-[70%] h-[60%] bg-[radial-gradient(ellipse_at_center,_rgba(17,255,186,0.07),transparent_65%)] pointer-events-none" />
      <div className="absolute top-[18%] -left-[18%] w-[55%] h-[45%] bg-[radial-gradient(ellipse_at_center,_rgba(255,223,0,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] bg-[radial-gradient(ellipse_at_center,_rgba(17,255,186,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffdf00]/20 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-[980px] mx-auto flex flex-col items-center">
        {/* Header row: logo + بومیم on right, title centered - same row, no header */}
        <div className="relative w-full flex items-center justify-center min-h-[48px] md:min-h-[56px] mb-1">
          <h1
            className="text-[42px] md:text-[64px] font-black tracking-tight text-white text-center leading-[0.95] select-none px-[110px] md:px-[160px]"
            style={{ fontWeight: 900, letterSpacing: "-0.03em" }}
          >
            چقدر دستمزد بگیرم؟
          </h1>

          {/* logo on right top - same row as title - name left side of logo */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-2.5">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/bumim-transparent.png" alt="بومیم" className="w-full h-full object-cover" />
            </div>
            <span className="text-[15px] md:text-[18px] font-black tracking-tight text-white hidden sm:block">بومیم</span>
          </div>
        </div>

        {/* Wheels */}
        <div
          dir="ltr"
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 items-start justify-items-center max-w-[1020px] mx-auto mt-3 md:mt-4"
        >
          <div className="w-full">
            <WheelPicker ariaLabel="تعداد ویدیو" options={countOptions} selected={countIdx} onSelect={setCountIdx} />
          </div>
          <div className="w-full">
            <WheelPicker ariaLabel="مدت زمان" options={durationOptions} selected={durationIdx} onSelect={setDurationIdx} />
          </div>
          <div className="w-full">
            <WheelPicker ariaLabel="نوع پروژه" options={typeOptions} selected={typeIdx} onSelect={setTypeIdx} />
          </div>
        </div>

        {/* خدمات header with reset / select all — same row as title */}
        <div className="flex items-center gap-2 md:gap-3 w-full max-w-[860px] mx-auto my-3 md:my-4">
          <button
            onClick={handleReset}
            className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-[12px] font-black tracking-wide border border-[#2a2a2a] bg-[#1a1a1a]/80 hover:bg-[#242424] hover:border-[#ffdf00]/30 text-[#9a9a9a] hover:text-white transition-all duration-200"
          >
            بازنشانی
          </button>

          <div className="h-[1.5px] flex-1 rounded-full bg-gradient-to-r from-transparent via-[#2a2a2a] to-[#333333] hidden sm:block" />
          <span className="text-[11px] md:text-[12px] font-black tracking-[0.12em] uppercase whitespace-nowrap text-[#ffdf00] px-1">
            خدمات
          </span>
          <div className="h-[1.5px] flex-1 rounded-full bg-gradient-to-l from-transparent via-[#2a2a2a] to-[#333333] hidden sm:block" />

          <button
            onClick={handleSelectAll}
            className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-[12px] font-black tracking-wide border border-[#ffdf00]/40 bg-[#ffdf00] hover:bg-[#ffdf00]/90 text-[#0a0a0a] shadow-[0_0_12px_rgba(255,223,0,0.25)] transition-all duration-200"
          >
            انتخاب همه
          </button>
        </div>

        <div className="w-full max-w-[860px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[...basicServices, ...advancedServices].map((s) => {
              const isBasic = basicServices.some((b) => b.id === s.id);
              const checked = isBasic ? !!basicChecked[s.id] : !!advChecked[s.id];
              const onToggle = isBasic ? () => toggleBasic(s.id) : () => toggleAdv(s.id);
              return <ServiceItem key={s.id} service={s} checked={checked} onToggle={onToggle} />;
            })}
          </div>
        </div>

        <Divider label="مبلغ نهایی" />

        <div className="w-full max-w-[560px] mx-auto flex flex-col items-center mt-1">
          <div className="flex items-baseline gap-3 md:gap-4 justify-center mt-1 select-none">
            <span
              suppressHydrationWarning
              className="persian-num text-[40px] md:text-[56px] font-black tracking-tight leading-none text-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textShadow: "0 0 24px rgba(255,223,0,0.20), 0 0 48px rgba(17,255,186,0.14)",
              }}
            >
              {formattedPrice}
            </span>
            <span className="text-[15px] md:text-[16px] font-bold text-white/80 translate-y-[-5px]">تومان</span>
          </div>
        </div>
      </div>
    </main>
  );
}
