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
  const anglePerItem = 22;
  const radius = 115;
  const ITEM_PX = 36;

  // --- iOS-like physics: smooth single-step wheel + continuous drag with momentum ---
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

  // keep startSelected in sync when not dragging
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
      // iPhone alarm: ultra-controllable, never skips. 1 notch = 1 item max.
      // Trackpad small deltas accumulate, mouse wheel big deltas count as exactly 1.
      const isTrackpadSmall = Math.abs(delta) < 50;
      wheelAccumRef.current += delta;

      const threshold = 42; // ~1.15 items — needs deliberate push, like iOS tick resistance
      if (Math.abs(wheelAccumRef.current) < threshold) return;

      // long throttle = lovely & precise (iOS never rushes). Hold wheel to keep scrolling.
      const minInterval = isTrackpadSmall ? 135 : 175;
      if (now - lastWheelTimeRef.current < minInterval) return;

      lastWheelTimeRef.current = now;
      const dir = wheelAccumRef.current > 0 ? 1 : -1;
      // consume all, don't keep remainder — prevents queued jumps after pause
      wheelAccumRef.current = 0;

      const next = clampIdx(selected + dir);
      if (next !== selected) onSelect(next);
    },
    [selected, onSelect, clampIdx]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      startYRef.current = e.clientY;
      startSelectedRef.current = selected;
      dragOffsetRef.current = 0;
      setDragOffset(0);
      lastYRef.current = e.clientY;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "contain";
    },
    [selected]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dy = e.clientY - startYRef.current;
      // rubber-band at edges (iOS bounce feel without leaving bounds)
      let dampedDy = dy;
      const start = startSelectedRef.current;
      const estIdx = start - dy / ITEM_PX;
      if (estIdx < 0) {
        const over = -estIdx;
        dampedDy = start * ITEM_PX + (dy - start * ITEM_PX) * (1 / (1 + over * 0.35));
      } else if (estIdx > options.length - 1) {
        const over = estIdx - (options.length - 1);
        const maxDy = (start - (options.length - 1)) * ITEM_PX;
        dampedDy = maxDy + (dy - maxDy) * (1 / (1 + over * 0.35));
      }
      dragOffsetRef.current = dampedDy;
      setDragOffset(dampedDy);
      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 1);
      const vy = (e.clientY - lastYRef.current) / dt; // px/ms
      // smoothing velocity
      velocityRef.current = velocityRef.current * 0.6 + vy * 0.4;
      lastYRef.current = e.clientY;
      lastTimeRef.current = now;
    },
    [options.length]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      document.body.style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      const dy = dragOffsetRef.current;
      const v = velocityRef.current; // px/ms
      // base target from drag distance
      let target = Math.round(startSelectedRef.current - dy / ITEM_PX);
      // iOS flick momentum — soft, capped. Small flick = 1, strong flick = few, never 7
      const timeSinceLastMove = performance.now() - lastTimeRef.current;
      if (Math.abs(v) > 0.85 && timeSinceLastMove < 70) {
        let extra = Math.round(-v * 0.9);
        extra = Math.max(Math.min(extra, 4), -4);
        if (Math.abs(extra) === 1 && Math.abs(v) < 1.15) extra = v > 0 ? -1 : 1;
        target += extra;
      }
      target = clampIdx(target);
      dragOffsetRef.current = 0;
      setDragOffset(0);
      velocityRef.current = 0;
      if (target !== selected) onSelect(target);
      // if same, just snap back (dragOffset -> 0 animates)
    },
    [selected, onSelect, clampIdx]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelect(clampIdx(selected - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelect(clampIdx(selected + 1));
      }
    },
    [selected, onSelect, clampIdx]
  );

  // live angle during drag (continuous, not stepped) -> the magic of iOS
  const liveAngle = selected * anglePerItem - (dragOffset / ITEM_PX) * anglePerItem;

  return (
    <div
      tabIndex={0}
      aria-label={ariaLabel}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className="relative w-full h-[220px] md:h-[260px] select-none outline-none cursor-grab active:cursor-grabbing group bg-transparent touch-none overscroll-contain"
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
          transform: `translateZ(${-radius}px) rotateX(${liveAngle}deg)`,
          transition: isDragging ? "none" : "transform 640ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
      >
        {options.map((opt, idx) => {
          // live distance during drag - gives buttery iOS interpolation
          const liveIdx = selected - dragOffset / ITEM_PX;
          const liveDist = idx - liveIdx;
          const absLive = Math.abs(liveDist);
          const roundedDist = Math.round(absLive);
          // use rounded for stable buckets, but live for isSelected threshold (<0.5)
          const isSelected = absLive < 0.5;
          const abs = isDragging ? roundedDist : Math.abs(idx - selected);
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
          // during drag, fade based on live distance for smoothness
          if (isDragging) {
            // continuous opacity fade
            if (absLive < 0.5) opacity = 1;
            else if (absLive < 1.5) opacity = 0.78 - (absLive - 0.5) * 0.36;
            else if (absLive < 2.5) opacity = 0.42 - (absLive - 1.5) * 0.20;
            else opacity = Math.max(0.08, 0.22 - (absLive - 2.5) * 0.08);
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
                transition: isDragging
                  ? "none"
                  : "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1), filter 300ms ease, color 200ms ease",
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
                  textShadow: "none",
                  transform: isSelected ? "translateZ(8px)" : "translateZ(0)",
                  transition: isDragging ? "none" : "color 300ms ease, text-shadow 400ms ease",
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
      className="w-full h-[100dvh] h-[100svh] overflow-hidden flex flex-col items-center justify-center px-4 md:px-6 py-3 md:py-4 bg-[#0a0a0a] relative selection:bg-[#ffdf00]/30"
    >
      <div className="absolute inset-0 bumim-grid opacity-[0.04] pointer-events-none" />
      <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_center,_rgba(255,223,0,0.09),transparent_60%)] pointer-events-none blur-[1px]" />
      <div className="absolute -top-[10%] -right-[20%] w-[70%] h-[60%] bg-[radial-gradient(ellipse_at_center,_rgba(17,255,186,0.07),transparent_65%)] pointer-events-none" />
      <div className="absolute top-[18%] -left-[18%] w-[55%] h-[45%] bg-[radial-gradient(ellipse_at_center,_rgba(255,223,0,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] bg-[radial-gradient(ellipse_at_center,_rgba(17,255,186,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffdf00]/20 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-[980px] mx-auto flex flex-col flex-1 min-h-0 justify-center items-center">
        {/* Pack centered, no outer scroll */}
        <div className="w-full flex flex-col justify-center items-center min-h-0">
          <div className="w-full max-w-[980px] bg-[#141414]/80 border border-[#2a2a2a] rounded-[24px] md:rounded-[28px] p-4 md:p-5 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col items-center gap-3 md:gap-4 max-h-[calc(100dvh-24px)] md:max-h-[calc(100svh-24px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Pack header: logo + name top-right inside card */}
            <div dir="ltr" className="w-full flex justify-end items-center">
              <div className="flex items-center gap-2 md:gap-2.5">
                <span className="text-[13px] md:text-[15px] font-black tracking-tight text-white">بومیم</span>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/bumim-transparent.png" alt="بومیم" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <h2 className="text-[26px] md:text-[32px] font-black tracking-tight text-white text-center leading-none select-none pt-5 md:pt-7 pb-0 md:pb-1" style={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
              چقدر دستمزد بگیرم؟
            </h2>

            {/* Wheels */}
            <div dir="ltr" className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 items-start justify-items-center max-w-[1020px] mx-auto">
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

            {/* Services - no title */}
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

            {/* Price + buttons - no divider, buttons right side */}
            <div className="w-full max-w-[860px] mx-auto relative flex flex-col sm:flex-row items-center justify-center gap-3 min-h-[56px]">
              <div className="flex items-baseline gap-3 md:gap-4 justify-center select-none">
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
              <div className="flex items-center gap-2 shrink-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2" dir="ltr">
                <button
                  onClick={handleSelectAll}
                  className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[11px] md:text-[12px] font-black tracking-wide border border-[#ffdf00]/40 bg-[#ffdf00] hover:bg-[#ffdf00]/90 text-[#0a0a0a] shadow-[0_0_12px_rgba(255,223,0,0.25)] transition-all duration-200"
                >
                  انتخاب همه
                </button>
                <button
                  onClick={handleReset}
                  className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[11px] md:text-[12px] font-black tracking-wide border border-[#2a2a2a] bg-[#1a1a1a]/80 hover:bg-[#242424] hover:border-[#ffdf00]/30 text-[#9a9a9a] hover:text-white transition-all duration-200"
                >
                  بازنشانی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
