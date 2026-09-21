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
  const rafRef = useRef<number | null>(null);

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
      // clamp strictly - no invisible empty after last item (bug fix)
      const start = startSelectedRef.current;
      const minDy = (start - (options.length - 1)) * ITEM_PX;
      const maxDy = start * ITEM_PX;
      const dampedDy = Math.max(minDy, Math.min(maxDy, dy));
      dragOffsetRef.current = dampedDy;
      // rAF throttle: one React render per frame max (budget phones)
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          setDragOffset(dragOffsetRef.current);
          rafRef.current = null;
        });
      }
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
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
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

  // center offset: 50% - half item (18px) gives perfect vertical center for both 220 and 260 heights

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
      className="relative w-full h-[140px] md:h-[180px] select-none outline-none cursor-grab active:cursor-grabbing bg-transparent touch-none overscroll-contain overflow-hidden"
    >
      {/* simple side ticks – no shadow, no 3D, no blur – avoids GPU glitches */}
      <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-[3px] h-[28px] bg-[#ffdf00] rounded-full pointer-events-none z-10" />
      <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-[3px] h-[28px] bg-[#11ffba] rounded-full pointer-events-none z-10" />

      {/* fades - minimal to reduce perceived empty between wheels */}
      <div className="absolute inset-x-0 top-0 h-[36px] bg-gradient-to-b from-[#141414] via-[#141414]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-[36px] bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent pointer-events-none z-10" />
      {/* center highlight - simple, no blur/shadow */}
      <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[36px] bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl pointer-events-none z-0" />

      {/* flat list – no preserve-3d / perspective / translateZ / rotateX / blur – 100% stable on low-end GPUs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            transform: `translateY(calc(-18px - ${selected * ITEM_PX}px + ${dragOffset}px))`,
            transition: isDragging ? "none" : "transform 520ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          {options.map((opt, idx) => {
            const liveIdx = selected - dragOffset / ITEM_PX;
            const liveDist = idx - liveIdx;
            const absLive = Math.abs(liveDist);
            const roundedDist = Math.round(absLive);
            const isSelected = absLive < 0.5;
            const abs = isDragging ? roundedDist : Math.abs(idx - selected);
            let opacity = 1;
            let scale = 1;
            if (abs === 0) {
              opacity = 1;
              scale = 1;
            } else if (abs === 1) {
              opacity = 0.85;
              scale = 0.96;
            } else if (abs === 2) {
              opacity = 0.55;
              scale = 0.90;
            } else if (abs === 3) {
              opacity = 0.32;
              scale = 0.86;
            } else {
              opacity = 0.14;
              scale = 0.82;
            }
            if (isDragging) {
              if (absLive < 0.5) opacity = 1;
              else if (absLive < 1.5) opacity = 0.85 - (absLive - 0.5) * 0.30;
              else if (absLive < 2.5) opacity = 0.55 - (absLive - 1.5) * 0.23;
              else opacity = Math.max(0.10, 0.32 - (absLive - 2.5) * 0.08);
            }
            const color = isSelected ? "#ffffff" : abs === 1 ? "#e8e8e8" : "#9a9a9a";
            return (
              <button
                key={opt.label}
                onClick={() => onSelect(idx)}
                aria-selected={isSelected}
                className="w-full flex items-center justify-center text-center select-none"
                style={{
                  height: `${ITEM_PX}px`,
                  opacity,
                  color,
                }}
              >
                <span
                  className={`block w-full px-2 text-center tracking-tight leading-none whitespace-nowrap overflow-hidden text-ellipsis ${
                    isSelected ? "text-[15px] md:text-[17px] font-black" : abs === 1 ? "text-[12px] md:text-[13px] font-bold" : "text-[11px] md:text-[12px] font-medium"
                  }`}
                  style={{ color }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
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
      dir="ltr"
      onClick={onToggle}
      className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer select-none border min-w-0 ${
        checked ? "bg-[#242424] border-[#ffdf00]/50" : "bg-[#1a1a1a] border-[#2a2a2a]"
      }`}
    >
      <span className={`text-[11px] md:text-[12px] font-black tracking-tight min-w-[38px] md:min-w-[44px] text-left font-mono shrink-0 ${checked ? "text-[#ffdf00]" : "text-[#9a9a9a]/70"}`}>
        +{toPersianNumber(service.percent)}%
      </span>
      <span
        className={`relative inline-flex items-center justify-center w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded-[6px] border-[1.5px] shrink-0 ${checked ? "bg-[#ffdf00] border-[#ffdf00]" : "bg-transparent border-[#2a2a2a]"}`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 14 14" className="text-[#0a0a0a]">
            <path
              d="M2.8 7 L5.6 9.8 L11.2 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={`flex-1 min-w-0 text-right truncate whitespace-nowrap overflow-hidden text-ellipsis text-[12px] md:text-[13px] font-bold ${checked ? "text-white" : "text-[#ededed]/90"}`}>
        {service.label}
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
    Object.fromEntries(basicServices.map((s) => [s.id, s.id === "rough_cut"]))
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

  const cardRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const invoiceNumber = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `BUM-${y}${m}${day}-${rnd}`;
  }, []);

  const invoiceDateFa = useMemo(() => {
    try {
      return new Date().toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return new Date().toLocaleDateString("fa-IR");
    }
  }, []);

  const selectedServices = useMemo(() => {
    const all = [...basicServices, ...advancedServices];
    return all.filter((s) => (basicServices.some((b) => b.id === s.id) ? basicChecked[s.id] : advChecked[s.id]));
  }, [basicChecked, advChecked]);

  const handleExportPDF = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      // Primary: capture hidden پیش‌فاکتور invoice (proper design, perfect Persian via raster)
      const el = invoiceRef.current;
      if (!el) throw new Error("invoice not found");
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxW = pdfW - margin * 2;
      const maxH = pdfH - margin * 2;
      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = Math.min(maxW / imgW, maxH / imgH);
      const renderW = imgW * ratio;
      const renderH = imgH * ratio;
      const x = (pdfW - renderW) / 2;
      const y = margin;
      pdf.addImage(imgData, "PNG", x, y, renderW, renderH);
      const fileName = `pishfactor-bumim-${invoiceNumber}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error("PDF export failed, fallback to print", e);
      // Fallback: try card capture
      try {
        const fallbackEl = cardRef.current;
        if (fallbackEl) {
          const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
          const canvas = await html2canvas(fallbackEl, { scale: 2, backgroundColor: "#141414", useCORS: true, logging: false });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
          const pdfW = pdf.internal.pageSize.getWidth();
          const pdfH = pdf.internal.pageSize.getHeight();
          const margin = 12;
          const maxW = pdfW - margin * 2;
          const maxH = pdfH - margin * 2;
          const imgW = canvas.width;
          const imgH = canvas.height;
          const ratio = Math.min(maxW / imgW, maxH / imgH);
          const renderW = imgW * ratio;
          const renderH = imgH * ratio;
          pdf.addImage(imgData, "PNG", (pdfW - renderW) / 2, margin, renderW, renderH);
          pdf.save(`bumim-${price.total}.pdf`);
          return;
        }
      } catch {}
      window.print();
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, price, invoiceNumber]);

  const formattedPrice = useMemo(() => {
    const latin = price.total.toLocaleString("en-US");
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return latin.replace(/\d/g, (d) => persianDigits[Number(d)]);
  }, [price.total]);

  return (
    <>
      <main
        suppressHydrationWarning
        className="w-full h-[100dvh] h-[100svh] overflow-hidden flex flex-col items-center justify-center px-4 md:px-6 py-3 md:py-4 bg-[#0a0a0a] relative selection:bg-[#ffdf00]/30"
      >
      {/* lightweight: no radial blur layers on budget phones */}

      <div className="relative w-full max-w-[980px] mx-auto flex flex-col flex-1 min-h-0 justify-center items-center">
        {/* Pack centered, no outer scroll */}
        <div className="w-full flex flex-col justify-center items-center min-h-0">
          <div ref={cardRef} className="w-full max-w-[980px] bg-[#141414] border border-[#2a2a2a] rounded-[24px] md:rounded-[28px] p-4 md:p-5 flex flex-col items-center gap-3 md:gap-4 max-h-[calc(100dvh-24px)] md:max-h-[calc(100svh-24px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Pack header: logo + name top-right inside card */}
            <div dir="ltr" className="w-full flex justify-end items-center">
              <div className="flex items-center gap-2 md:gap-2.5">
                <span className="text-[13px] md:text-[15px] font-black tracking-tight text-white">بومیم</span>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/bumim-transparent.png" alt="بومیم" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <h2 className="text-[26px] md:text-[32px] font-black tracking-tight text-white text-center leading-none select-none pt-5 md:pt-7 pb-0 md:pb-1" style={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
              چقدر دستمزد بگیرم؟
            </h2>

            {/* Wheels - ultra-tight on mobile - minimal gap */}
            <div dir="ltr" className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-2 items-start justify-items-center max-w-[1020px] mx-auto [&>div+div]:-mt-1 md:[&>div+div]:mt-0">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[...basicServices, ...advancedServices].map((s) => {
                  const isBasic = basicServices.some((b) => b.id === s.id);
                  const checked = isBasic ? !!basicChecked[s.id] : !!advChecked[s.id];
                  const onToggle = isBasic ? () => toggleBasic(s.id) : () => toggleAdv(s.id);
                  return <ServiceItem key={s.id} service={s} checked={checked} onToggle={onToggle} />;
                })}
              </div>
            </div>

            {/* Price + buttons - extra bottom padding + ghost controls */}
            <div className="w-full max-w-[860px] mx-auto relative flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-6 min-h-[64px] pt-12 md:pt-14 pb-6 md:pb-8 mt-6 md:mt-8">
              <div className="flex items-baseline gap-3 md:gap-4 justify-center select-none">
                <span
                  suppressHydrationWarning
                  className="persian-num text-[40px] md:text-[56px] font-black tracking-tight leading-none text-white"
                  style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
                >
                  {formattedPrice}
                </span>
                <span className="text-[15px] md:text-[16px] font-bold text-white/80 translate-y-[-5px]">تومان</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2" dir="ltr">
                <button
                  onClick={handleSelectAll}
                  className="shrink-0 px-5 py-3 md:px-6 md:py-3 rounded-xl text-[12px] md:text-[13px] font-black tracking-wide border border-[#2a2a2a] bg-transparent hover:bg-[#1e1e1e] hover:border-[#333333] text-[#9a9a9a] hover:text-white transition-all duration-200"
                >
                  انتخاب همه
                </button>
                <button
                  onClick={handleReset}
                  className="shrink-0 px-5 py-3 md:px-6 md:py-3 rounded-xl text-[12px] md:text-[13px] font-black tracking-wide border border-[#2a2a2a] bg-transparent hover:bg-[#1e1e1e] hover:border-[#333333] text-[#9a9a9a] hover:text-white transition-all duration-200"
                >
                  بازنشانی
                </button>
              </div>
            </div>

            {/* Export PDF - big primary button below price - excluded from PDF capture */}
            <button
              data-html2canvas-ignore="true"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full max-w-[860px] mx-auto flex items-center justify-center gap-2.5 py-4 md:py-5 rounded-2xl bg-[#ffdf00] hover:bg-[#ffeb3b] active:bg-[#ffd600] text-[#0a0a0a] text-[14px] md:text-[15px] font-black tracking-tight shadow-[0_8px_24px_rgba(255,223,0,0.22)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 md:mt-3"
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                  در حال ساخت PDF...
                </span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  خروجی PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </main>

      {/* Hidden پیش‌فاکتور invoice - perfect Persian, captured via html2canvas -> jsPDF */}
      <div
        ref={invoiceRef}
        dir="rtl"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "794px",
          background: "#ffffff",
          color: "#0a0a0a",
          fontFamily: "var(--font-vazir), Tahoma, sans-serif",
          direction: "rtl",
          overflow: "hidden",
        }}
        aria-hidden
      >
        <div style={{ background: "#0a0a0a", color: "#ffffff", padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#ffdf00", letterSpacing: "-0.02em" }}>پیش‌فاکتور</div>
            <div style={{ fontSize: "11px", color: "#9a9a9a", marginTop: "4px" }}>برآورد دستمزد تدوین ویدیو</div>
            <div style={{ fontSize: "9px", color: "#666", marginTop: "8px", fontFamily: "monospace", direction: "ltr", textAlign: "right" as const }}>{invoiceNumber}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "left" as const }}>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#ffffff" }}>بومیم</div>
              <div style={{ fontSize: "10px", color: "#9a9a9a", fontFamily: "monospace", letterSpacing: "0.04em" }}>bumim.ir</div>
              <div style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>{invoiceDateFa}</div>
            </div>
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#ffdf00",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#0a0a0a",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              ب
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 32px 16px", background: "#ffffff" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#666",
              borderBottom: "1px solid #eeeeee",
              paddingBottom: "14px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              شماره:{" "}
              <span style={{ fontWeight: 700, color: "#0a0a0a", fontFamily: "monospace", direction: "ltr", display: "inline-block" }}>{invoiceNumber}</span>
            </div>
            <div>
              تاریخ: <span style={{ fontWeight: 700, color: "#0a0a0a" }}>{invoiceDateFa}</span>
            </div>
            <div>
              اعتبار: <span style={{ fontWeight: 700, color: "#0a0a0a" }}>۷ روز</span>
            </div>
            <div>
              مشتری: <span style={{ fontWeight: 700, color: "#0a0a0a" }}>کاربر گرامی</span>
            </div>
          </div>

          <div style={{ marginTop: "18px", background: "#f8f8f8", border: "1px solid #eeeeee", borderRadius: "16px", padding: "16px 18px" }}>
            <div style={{ fontSize: "12px", fontWeight: 900, marginBottom: "12px", color: "#0a0a0a" }}>مشخصات پروژه</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "12px" }}>
              <div style={{ background: "#ffffff", border: "1px solid #eeeeee", borderRadius: "10px", padding: "10px 12px", textAlign: "right" as const }}>
                <div style={{ color: "#888", fontSize: "10px", marginBottom: "4px" }}>نوع پروژه</div>
                <div style={{ fontWeight: 800, color: "#0a0a0a", fontSize: "12px" }}>{typeOptions[typeIdx].label}</div>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid #eeeeee", borderRadius: "10px", padding: "10px 12px", textAlign: "right" as const }}>
                <div style={{ color: "#888", fontSize: "10px", marginBottom: "4px" }}>مدت زمان</div>
                <div style={{ fontWeight: 800, color: "#0a0a0a", fontSize: "12px" }}>{durationOptions[durationIdx].label}</div>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid #eeeeee", borderRadius: "10px", padding: "10px 12px", textAlign: "right" as const }}>
                <div style={{ color: "#888", fontSize: "10px", marginBottom: "4px" }}>تعداد ویدیو</div>
                <div style={{ fontWeight: 800, color: "#0a0a0a", fontSize: "12px" }}>{countOptions[countIdx].label}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "18px" }}>
            <div style={{ fontSize: "12px", fontWeight: 900, marginBottom: "8px", color: "#0a0a0a" }}>ریز خدمات انتخابی</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", border: "1px solid #eeeeee", borderRadius: "12px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#0a0a0a", color: "#ffffff" }}>
                  <th style={{ padding: "11px 8px", textAlign: "center", width: "48px", fontWeight: 800, fontSize: "11px" }}>ردیف</th>
                  <th style={{ padding: "11px 12px", textAlign: "right", fontWeight: 800, fontSize: "11px" }}>شرح خدمت</th>
                  <th style={{ padding: "11px 8px", textAlign: "center", width: "88px", fontWeight: 800, fontSize: "11px" }}>درصد</th>
                  <th style={{ padding: "11px 12px", textAlign: "center", width: "140px", fontWeight: 800, fontSize: "11px" }}>مبلغ (تومان)</th>
                </tr>
              </thead>
              <tbody>
                {selectedServices.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "18px", textAlign: "center", color: "#999", fontSize: "11px" }}>
                      خدماتی انتخاب نشده — فقط مبلغ پایه محاسبه شده
                    </td>
                  </tr>
                ) : (
                  selectedServices.map((s, i) => {
                    const rowPrice = Math.round(price.subtotal * (s.percent / 100));
                    return (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f9f9f9", borderTop: "1px solid #eeeeee" }}>
                        <td style={{ padding: "10px 8px", textAlign: "center", color: "#0a0a0a", fontWeight: 700 }}>{toPersianNumber(i + 1)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: "#1a1a1a", fontWeight: 700 }}>{s.label}</td>
                        <td style={{ padding: "10px 8px", textAlign: "center", color: "#d68a00", fontWeight: 800, fontFamily: "monospace" }}>{`+${toPersianNumber(s.percent)}%`}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#0a0a0a", fontWeight: 700, fontFamily: "monospace" }}>{toPersianPrice(rowPrice)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "340px", border: "1px solid #eeeeee", borderRadius: "14px", overflow: "hidden", background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", fontSize: "12px", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#666" }}>مبلغ پایه</span>
                <span style={{ fontWeight: 800, color: "#0a0a0a", fontFamily: "monospace" }}>{toPersianPrice(price.subtotal)} تومان</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", fontSize: "12px", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#666" }}>مجموع افزایش خدمات</span>
                <span style={{ fontWeight: 800, color: "#d68a00", fontFamily: "monospace" }}>{`+${toPersianNumber(price.totalPercent)}%`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "#ffdf00", fontSize: "13px", fontWeight: 900, color: "#0a0a0a" }}>
                <span>مبلغ قابل پرداخت</span>
                <span style={{ fontFamily: "monospace" }}>{formattedPrice} تومان</span>
              </div>
              <div style={{ padding: "8px 16px", fontSize: "9px", color: "#888", textAlign: "center", background: "#fffde7", borderTop: "1px solid #ffec99" }}>
                قیمت‌ها به تومان و با احتساب کلیه خدمات انتخابی می‌باشد
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px", fontSize: "10px", color: "#777", lineHeight: 1.8, borderTop: "1px solid #eeeeee", paddingTop: "14px" }}>
            <div style={{ fontWeight: 800, color: "#0a0a0a", marginBottom: "6px", fontSize: "11px" }}>توضیحات:</div>
            <div>• این پیش‌فاکتور صرفاً برآورد اولیه است و قیمت نهایی پس از بررسی دقیق فایل‌ها و جزئیات پروژه تأیید می‌شود.</div>
            <div>• اعتبار این پیش‌فاکتور ۷ روز از تاریخ صدور می‌باشد.</div>
            <div>• پرداخت ۵۰٪ پیش‌پرداخت جهت شروع پروژه الزامی است و مابقی پس از تحویل تسویه می‌گردد.</div>
            <div>• هرگونه خدمات خارج از لیست فوق، به صورت جداگانه محاسبه خواهد شد.</div>
          </div>

          <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e5e5e5", paddingTop: "14px" }}>
            <div style={{ fontSize: "10px", color: "#999" }}>
              <div>بومیم — bumim.ir</div>
              <div style={{ fontFamily: "monospace", fontSize: "9px", marginTop: "2px" }}>support@bumim.ir</div>
            </div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: "10px", color: "#aaa" }}>امضا و مهر</div>
              <div style={{ marginTop: "22px", width: "140px", borderTop: "1px solid #ccc" }} />
            </div>
          </div>

          <div style={{ marginTop: "14px", textAlign: "center", fontSize: "10px", color: "#bbb" }}>با تشکر از اعتماد شما — بومیم</div>
        </div>
      </div>
    </>
  );
}
