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

  // Seller / Buyer info (standard)
  const [sellerInfo, setSellerInfo] = useState({ name: "", brand: "", phone: "", email: "" });
  const [buyerInfo, setBuyerInfo] = useState({ name: "", company: "", phone: "", email: "" });
  const [sellerLogo, setSellerLogo] = useState<string | null>(null);

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

  // Multi-project invoice items (add_button flow)
  type InvoiceItem = {
    id: string;
    typeLabel: string;
    durationLabel: string;
    countLabel: string;
    services: Service[];
    subtotal: number;
    totalPercent: number;
    total: number;
  };
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  const handleAddToInvoice = useCallback(() => {
    const item: InvoiceItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      typeLabel: typeOptions[typeIdx].label,
      durationLabel: durationOptions[durationIdx].label,
      countLabel: countOptions[countIdx].label,
      services: [...selectedServices],
      subtotal: price.subtotal,
      totalPercent: price.totalPercent,
      total: price.total,
    };
    setInvoiceItems((prev) => [...prev, item]);
  }, [typeIdx, durationIdx, countIdx, selectedServices, price]);

  const handleRemoveItem = useCallback((id: string) => {
    setInvoiceItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const invoiceTotal = useMemo(() => {
    if (invoiceItems.length === 0) return price.total;
    return invoiceItems.reduce((sum, it) => sum + it.total, 0);
  }, [invoiceItems, price.total]);

  const invoiceSubtotal = useMemo(() => {
    if (invoiceItems.length === 0) return price.subtotal;
    return invoiceItems.reduce((sum, it) => sum + it.subtotal, 0);
  }, [invoiceItems, price.subtotal]);

  const invoiceAvgPercent = useMemo(() => {
    if (invoiceItems.length === 0) return price.totalPercent;
    const avg = invoiceItems.reduce((s, it) => s + it.totalPercent, 0) / invoiceItems.length;
    return Math.round(avg);
  }, [invoiceItems, price.totalPercent]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setSellerLogo(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      // @ts-ignore
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 80));

      // Load Vazir fonts for copyable Persian text
      async function loadFont(url: string): Promise<string> {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`font fetch failed ${url}`);
        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        const chunk = 8192;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + chunk)));
        }
        return btoa(binary);
      }

      const [{ jsPDF }] = await Promise.all([import("jspdf")]);

      // Try to load Vazir, fallback to helvetica if fails
      let vazirRegularBase64: string | null = null;
      let vazirBoldBase64: string | null = null;
      try {
        [vazirRegularBase64, vazirBoldBase64] = await Promise.all([
          loadFont("/fonts/Vazirmatn-Regular.ttf"),
          loadFont("/fonts/Vazirmatn-Bold.ttf"),
        ]);
      } catch (e) {
        console.warn("Vazir font load failed, fallback to helvetica", e);
      }

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth(); // 595.28
      const pdfH = pdf.internal.pageSize.getHeight(); // 841.89
      const margin = 32;

      if (vazirRegularBase64 && vazirBoldBase64) {
        pdf.addFileToVFS("Vazirmatn-Regular.ttf", vazirRegularBase64);
        pdf.addFont("Vazirmatn-Regular.ttf", "Vazirmatn", "normal");
        pdf.addFileToVFS("Vazirmatn-Bold.ttf", vazirBoldBase64);
        pdf.addFont("Vazirmatn-Bold.ttf", "Vazirmatn", "bold");
        pdf.setFont("Vazirmatn", "normal");
      } else {
        pdf.setFont("helvetica", "normal");
      }

      // Helpers
      const toFaPrice = (n: number) => toPersianPrice(n);
      const toFaNum = (n: number | string) => toPersianNumber(typeof n === "string" ? parseInt(n) || 0 : n);

      // Determine items to print
      const itemsToPrint = invoiceItems.length
        ? invoiceItems
        : [
            {
              id: "single",
              typeLabel: typeOptions[typeIdx].label,
              durationLabel: durationOptions[durationIdx].label,
              countLabel: countOptions[countIdx].label,
              services: selectedServices,
              subtotal: price.subtotal,
              totalPercent: price.totalPercent,
              total: price.total,
            } as any,
          ];

      // --- Header (dark) ---
      pdf.setFillColor("#0a0a0a");
      pdf.rect(0, 0, pdfW, 78, "F");

      // Seller logo if exists
      let logoAdded = false;
      if (sellerLogo) {
        try {
          // sellerLogo is dataURL
          pdf.addImage(sellerLogo, "PNG", margin, 18, 42, 42, undefined, "FAST");
          logoAdded = true;
        } catch {}
      }
      if (!logoAdded) {
        pdf.setFillColor("#ffdf00");
        // @ts-ignore rounded rect
        const r = 10;
        const x = margin;
        const y = 18;
        // simple rect with rounded corners via roundedRect if available
        // fallback to rect
        try {
          // @ts-ignore
          pdf.roundedRect(x, y, 42, 42, r, r, "F");
        } catch {
          pdf.rect(x, y, 42, 42, "F");
        }
        pdf.setFont("Vazirmatn", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor("#0a0a0a");
        const initial = (sellerInfo.brand || sellerInfo.name || "ب").charAt(0);
        pdf.text(initial, x + 21, y + 27, { align: "center" });
      }

      // Seller info left of logo
      const sellerX = margin + 52;
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor("#ffffff");
      const sellerTitle = sellerInfo.brand || sellerInfo.name || "نام برند شما";
      pdf.text(sellerTitle, sellerX, 30, { align: "left" } as any);
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor("#9a9a9a");
      const sellerContact = [sellerInfo.phone, sellerInfo.email].filter(Boolean).join("  •  ") || "شماره تماس  •  ایمیل";
      if (sellerContact) pdf.text(sellerContact, sellerX, 42, { align: "left" } as any);
      pdf.setFontSize(7);
      pdf.setTextColor("#666");
      pdf.text(invoiceDateFa, sellerX, 54, { align: "left" } as any);

      // Title on right
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor("#ffdf00");
      pdf.text("پیش فاکتور", pdfW - margin, 32, { align: "right" } as any);
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor("#9a9a9a");
      pdf.text("صورتحساب خدمات تدوین ویدیو", pdfW - margin, 46, { align: "right" } as any);
      pdf.setFontSize(7);
      pdf.setTextColor("#666");
      pdf.setFont("helvetica", "normal");
      pdf.text(invoiceNumber, pdfW - margin, 60, { align: "right" } as any);
      pdf.setFont("Vazirmatn", "normal");

      // Info bar below header
      let y = 96;
      pdf.setFontSize(8);
      pdf.setTextColor("#666");
      pdf.setFont("Vazirmatn", "normal");
      // Use helvetica for invoice number to keep ltr
      const infoY = y;
      // Right to left: شماره ... تاریخ ... 
      // We'll draw 3 columns: شماره (right), تاریخ (center), تعداد آیتم (left) - minimal
      pdf.setFont("Vazirmatn", "normal");
      pdf.setTextColor("#666");
      pdf.text("شماره:", pdfW - margin - 120, infoY, { align: "right" } as any);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#0a0a0a");
      pdf.setFontSize(8);
      pdf.text(invoiceNumber, pdfW - margin - 122, infoY, { align: "right" } as any);
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor("#666");
      pdf.text("تاریخ:", pdfW / 2 + 30, infoY, { align: "right" } as any);
      pdf.setTextColor("#0a0a0a");
      pdf.setFont("Vazirmatn", "bold");
      pdf.text(invoiceDateFa, pdfW / 2 + 28, infoY, { align: "right" } as any);
      // left side - تعداد
      pdf.setFont("Vazirmatn", "normal");
      pdf.setTextColor("#666");
      pdf.text("تعداد آیتم:", margin + 70, infoY, { align: "right" } as any);
      pdf.setTextColor("#0a0a0a");
      pdf.setFont("Vazirmatn", "bold");
      pdf.text(toFaNum(itemsToPrint.length), margin + 68, infoY, { align: "right" } as any);

      y = infoY + 10;
      pdf.setDrawColor("#eeeeee");
      pdf.setLineWidth(0.6);
      pdf.line(margin, y, pdfW - margin, y);
      y += 16;

      // Seller / Buyer boxes
      const boxH = 62;
      const boxW = (pdfW - margin * 2 - 10) / 2;
      const boxR = 10;
      // Seller box (right)
      const sellerBoxX = pdfW - margin - boxW;
      const buyerBoxX = margin;
      // Seller
      pdf.setFillColor("#f8f8f8");
      pdf.setDrawColor("#eeeeee");
      try {
        // @ts-ignore
        pdf.roundedRect(sellerBoxX, y, boxW, boxH, boxR, boxR, "FD");
        // @ts-ignore
        pdf.roundedRect(buyerBoxX, y, boxW, boxH, boxR, boxR, "FD");
      } catch {
        pdf.rect(sellerBoxX, y, boxW, boxH, "FD");
        pdf.rect(buyerBoxX, y, boxW, boxH, "FD");
      }
      // Seller label
      pdf.setFillColor("#0a0a0a");
      // small badge
      pdf.setFontSize(6.5);
      pdf.setFont("Vazirmatn", "bold");
      pdf.setTextColor("#ffdf00");
      // badge bg
      const badgeW = 48;
      const badgeH = 14;
      const badgeX = sellerBoxX + boxW - badgeW - 8;
      const badgeY = y + 8;
      try {
        // @ts-ignore
        pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 4, 4, "F");
      } catch {
        pdf.rect(badgeX, badgeY, badgeW, badgeH, "F");
      }
      pdf.text("فروشنده", badgeX + badgeW / 2, badgeY + 9.5, { align: "center" } as any);
      pdf.setTextColor("#0a0a0a");
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(9);
      pdf.text(sellerInfo.name || "نام شما", sellerBoxX + boxW - 10, y + 32, { align: "right" } as any);
      if (sellerInfo.brand) {
        pdf.setFont("Vazirmatn", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor("#333");
        pdf.text(sellerInfo.brand, sellerBoxX + boxW - 10, y + 44, { align: "right" } as any);
      }
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor("#666");
      // Use Vazir for Persian fallback, keep LTR for actual phone/email but Vazir supports both
      pdf.text(sellerInfo.phone || "شماره تماس ثبت نشده", sellerBoxX + boxW - 10, y + 54, { align: "right" } as any);
      if (sellerInfo.email) {
        pdf.setFont("Vazirmatn", "normal");
        pdf.text(sellerInfo.email, sellerBoxX + boxW - 10, y + 62 - (sellerInfo.brand ? 0 : 8), { align: "right" } as any);
      }

      // Buyer label
      pdf.setFillColor("#11c69a");
      const bBadgeX = buyerBoxX + boxW - 48 - 8;
      try {
        // @ts-ignore
        pdf.roundedRect(bBadgeX, badgeY, 48, 14, 4, 4, "F");
      } catch {
        pdf.rect(bBadgeX, badgeY, 48, 14, "F");
      }
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(6.5);
      pdf.setTextColor("#ffffff");
      pdf.text("خریدار", bBadgeX + 24, badgeY + 9.5, { align: "center" } as any);
      pdf.setTextColor("#0a0a0a");
      pdf.setFontSize(9);
      pdf.text(buyerInfo.name || "نام مشتری", buyerBoxX + boxW - 10, y + 32, { align: "right" } as any);
      if (buyerInfo.company) {
        pdf.setFont("Vazirmatn", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor("#333");
        pdf.text(buyerInfo.company, buyerBoxX + boxW - 10, y + 44, { align: "right" } as any);
      }
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor("#666");
      pdf.text(buyerInfo.phone || "شماره مشتری", buyerBoxX + boxW - 10, y + 54, { align: "right" } as any);
      if (buyerInfo.email) {
        pdf.setFont("Vazirmatn", "normal");
        pdf.text(buyerInfo.email, buyerBoxX + boxW - 10, y + 62 - (buyerInfo.company ? 0 : 8), { align: "right" } as any);
      }

      y += boxH + 18;

      // Items table
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor("#0a0a0a");
      pdf.text("ریز آیتم ها", pdfW - margin, y, { align: "right" } as any);
      y += 10;

      // Table header
      const colW = {
        row: 38,
        desc: pdfW - margin * 2 - 38 - 56 - 110,
        count: 56,
        amount: 110,
      };
      const tableX = margin;
      const headerH = 22;
      pdf.setFillColor("#0a0a0a");
      pdf.rect(tableX, y, pdfW - margin * 2, headerH, "F");
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor("#ffffff");
      const hx = tableX;
      pdf.text("ردیف", hx + colW.row / 2, y + 14, { align: "center" } as any);
      pdf.text("شرح پروژه", hx + colW.row + colW.desc / 2, y + 14, { align: "center" } as any);
      pdf.text("تعداد", hx + colW.row + colW.desc + colW.count / 2, y + 14, { align: "center" } as any);
      pdf.text("مبلغ (تومان)", hx + colW.row + colW.desc + colW.count + colW.amount / 2, y + 14, { align: "center" } as any);
      y += headerH;

      // Rows
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7.5);
      const rowHPadding = 6;
      const maxTableY = pdfH - 160; // reserve for summary + footer
      for (let i = 0; i < itemsToPrint.length; i++) {
        const it: any = itemsToPrint[i];
        // Check page break
        if (y > maxTableY) {
          pdf.addPage();
          y = 32;
        }
        const servicesText = it.services?.length
          ? it.services.map((s: any) => s.label).join("، ")
          : "بدون خدمات اضافی";
        const title = `${it.typeLabel} • ${it.durationLabel} • ${it.countLabel}`;
        // Estimate row height based on services text length
        pdf.setFont("Vazirmatn", "bold");
        const titleLines = pdf.splitTextToSize(title, colW.desc - 12);
        pdf.setFont("Vazirmatn", "normal");
        const svcLines = pdf.splitTextToSize(servicesText, colW.desc - 12);
        const lines = 1 + svcLines.length;
        const rowH = Math.max(28, 14 + lines * 9 + rowHPadding);

        if (y + rowH > pdfH - 100) {
          pdf.addPage();
          y = 32;
        }

        // Row bg
        if (i % 2 === 1) {
          pdf.setFillColor("#f9f9f9");
          pdf.rect(tableX, y, pdfW - margin * 2, rowH, "F");
        }
        pdf.setDrawColor("#eeeeee");
        pdf.setLineWidth(0.4);
        pdf.rect(tableX, y, pdfW - margin * 2, rowH, "S");

        // Vertical dividers
        const c1 = tableX + colW.row;
        const c2 = c1 + colW.desc;
        const c3 = c2 + colW.count;
        pdf.line(c1, y, c1, y + rowH);
        pdf.line(c2, y, c2, y + rowH);
        pdf.line(c3, y, c3, y + rowH);

        // Row content
        pdf.setTextColor("#0a0a0a");
        pdf.setFont("Vazirmatn", "bold");
        pdf.setFontSize(7.5);
        pdf.text(toFaNum(i + 1), tableX + colW.row / 2, y + 14, { align: "center" } as any);

        // desc - title right aligned
        pdf.setFontSize(7.5);
        pdf.text(title, c1 + colW.desc - 6, y + 12, { align: "right" } as any);
        pdf.setFont("Vazirmatn", "normal");
        pdf.setFontSize(6.5);
        pdf.setTextColor("#777");
        // services - may be multiple lines
        let sy = y + 22;
        for (const line of svcLines) {
          pdf.text(line, c1 + colW.desc - 6, sy, { align: "right" } as any);
          sy += 8;
        }

        // count
        pdf.setFont("Vazirmatn", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor("#0a0a0a");
        const cntNum = it.countLabel ? it.countLabel.replace(/[^0-9]/g, "") || "1" : "1";
        pdf.text(toFaNum(parseInt(cntNum)), c2 + colW.count / 2, y + rowH / 2 + 2.5, { align: "center" } as any);

        // amount
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor("#0a0a0a");
        // use Vazir for Persian price but keep helvetica for numbers? Use Vazir
        pdf.setFont("Vazirmatn", "bold");
        pdf.text(toFaPrice(it.total), c3 + colW.amount / 2, y + rowH / 2 + 2.5, { align: "center" } as any);

        y += rowH;
      }

      // Summary box (right aligned)
      const summaryW = 220;
      const summaryX = pdfW - margin - summaryW;
      // ensure space
      if (y + 72 > pdfH - 60) {
        pdf.addPage();
        y = 32;
      }
      y += 12;
      // Box
      pdf.setDrawColor("#eeeeee");
      pdf.setFillColor("#ffffff");
      const summaryH = 56;
      try {
        // @ts-ignore
        pdf.roundedRect(summaryX, y, summaryW, summaryH, 8, 8, "FD");
      } catch {
        pdf.rect(summaryX, y, summaryW, summaryH, "FD");
      }
      // inner dividers
      pdf.setDrawColor("#f0f0f0");
      pdf.line(summaryX, y + 18, summaryX + summaryW, y + 18);
      pdf.line(summaryX, y + 36, summaryX + summaryW, y + 36);
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor("#666");
      pdf.text("جمع پایه", summaryX + 12, y + 12, { align: "left" } as any);
      pdf.setFont("Vazirmatn", "bold");
      pdf.setTextColor("#0a0a0a");
      pdf.text(toFaPrice(invoiceSubtotal) + " تومان", summaryX + summaryW - 12, y + 12, { align: "right" } as any);

      pdf.setFont("Vazirmatn", "normal");
      pdf.setTextColor("#666");
      pdf.text("میانگین افزایش", summaryX + 12, y + 30, { align: "left" } as any);
      pdf.setFont("Vazirmatn", "bold");
      pdf.setTextColor("#d68a00");
      pdf.text(`+${toFaNum(invoiceAvgPercent)}%`, summaryX + summaryW - 12, y + 30, { align: "right" } as any);

      // Total bar
      pdf.setFillColor("#ffdf00");
      try {
        // @ts-ignore - fill bottom part
        pdf.roundedRect(summaryX, y + 36, summaryW, 20, 0, 0, "F");
        // need to clip corners bottom only - simple rect for now
        pdf.rect(summaryX, y + 36, summaryW, 20, "F");
        // redraw border
        pdf.setDrawColor("#eeeeee");
        pdf.rect(summaryX, y, summaryW, summaryH, "S");
      } catch {
        pdf.setFillColor("#ffdf00");
        pdf.rect(summaryX, y + 36, summaryW, 20, "F");
      }
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor("#0a0a0a");
      pdf.text("مبلغ قابل پرداخت", summaryX + 12, y + 49, { align: "left" } as any);
      pdf.text(toFaPrice(invoiceTotal) + " تومان", summaryX + summaryW - 12, y + 49, { align: "right" } as any);

      y += summaryH + 10;
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor("#888");
      pdf.text("قیمت‌ها به تومان • جمع کل " + toFaNum(itemsToPrint.length) + " پروژه با احتساب کلیه خدمات", summaryX + summaryW / 2, y, { align: "center" } as any);

      y += 18;
      pdf.setDrawColor("#eeeeee");
      pdf.line(margin, y, pdfW - margin, y);
      y += 12;

      // Notes - minimal
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor("#0a0a0a");
      pdf.text("توضیحات:", pdfW - margin, y, { align: "right" } as any);
      y += 10;
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor("#777");
      const notes = [
        "این پیش فاکتور صرفا برآورد اولیه است و قیمت نهایی پس از بررسی دقیق فایل ها تایید می شود.",
        "اعتبار این پیش فاکتور ۷ روز از تاریخ صدور می باشد.",
        "پرداخت ۵۰٪ پیش پرداخت جهت شروع پروژه الزامی است.",
      ];
      for (const note of notes) {
        const lines = pdf.splitTextToSize("• " + note, pdfW - margin * 2);
        for (const line of lines) {
          pdf.text(line, pdfW - margin, y, { align: "right" } as any);
          y += 8;
        }
      }

      y += 8;
      pdf.setDrawColor("#e5e5e5");
      pdf.setLineDashPattern([3, 3], 0);
      pdf.line(margin, y, pdfW - margin, y);
      pdf.setLineDashPattern([], 0);
      y += 12;

      // Footer - Powered by bumim with logo + link
      const footerY = y;
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor("#999");
      // Try to add bumim logo
      try {
        const logoRes = await fetch("/bumim-transparent.png");
        if (logoRes.ok) {
          const logoBuf = await logoRes.arrayBuffer();
          const logoBytes = new Uint8Array(logoBuf);
          let binary = "";
          for (let i = 0; i < logoBytes.length; i += 4096) {
            binary += String.fromCharCode(...Array.from(logoBytes.subarray(i, i + 4096)));
          }
          const logoBase64 = btoa(binary);
          // png
          pdf.addImage("data:image/png;base64," + logoBase64, "PNG", margin, footerY - 4, 18, 18);
        }
      } catch {}
      pdf.text("قدرت گرفته از", margin + 22, footerY + 6, { align: "left" } as any);
      // Bumim link
      const bumimText = "بومیم";
      pdf.setFont("Vazirmatn", "bold");
      pdf.setTextColor("#0a0a0a");
      const bumimX = margin + 22 + pdf.getTextWidth("قدرت گرفته از ") + 2;
      pdf.text(bumimText, bumimX, footerY + 6, { align: "left" } as any);
      // link rect
      const tw = pdf.getTextWidth(bumimText);
      // @ts-ignore
      pdf.link(bumimX, footerY - 2, tw, 10, { url: "https://bumims.ir" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      pdf.setTextColor("#999");
      pdf.text("bumim.ir", margin + 22, footerY + 14, { align: "left" } as any);

      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor("#bbb");
      pdf.text("با تشکر از اعتماد شما", pdfW / 2, footerY + 10, { align: "center" } as any);

      // File name Farsi with customer name
      const customerName = buyerInfo.name || buyerInfo.company || "مشتری";
      const safeCustomer = customerName.replace(/[\/*?:"<>|]/g, "");
      const fileName = `پیش فاکتور برای ${safeCustomer} - ${invoiceNumber}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error("PDF export failed, fallback to print", e);
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
  }, [isExporting, price, invoiceNumber, invoiceDateFa, sellerInfo, buyerInfo, sellerLogo, invoiceItems, invoiceTotal, invoiceSubtotal, invoiceAvgPercent, typeIdx, durationIdx, countIdx, selectedServices]);

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

            {/* Add to invoice - for multi-project */}
            <button
              onClick={handleAddToInvoice}
              className="w-full max-w-[860px] mx-auto flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl border-2 border-[#ffdf00] bg-transparent hover:bg-[#ffdf00]/10 text-[#ffdf00] text-[13px] md:text-[14px] font-black tracking-tight transition-all duration-200 mt-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              افزودن این پروژه به فاکتور ({formattedPrice} تومان)
            </button>

            {/* Seller / Buyer info - standard */}
            <div className="w-full max-w-[860px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
                <div className="text-[12px] font-black text-[#ffdf00] mb-3 tracking-wide">فروشنده (شما)</div>
                <div className="space-y-2.5">
                  <input value={sellerInfo.name} onChange={(e)=>setSellerInfo(s=>({...s, name:e.target.value}))} placeholder="نام و نام خانوادگی *" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#ffdf00]/50" />
                  <input value={sellerInfo.brand} onChange={(e)=>setSellerInfo(s=>({...s, brand:e.target.value}))} placeholder="نام برند / شرکت (اختیاری)" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#ffdf00]/50" />
                  <input value={sellerInfo.phone} onChange={(e)=>setSellerInfo(s=>({...s, phone:e.target.value}))} placeholder="شماره تماس" dir="ltr" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#ffdf00]/50 text-left" />
                  <input value={sellerInfo.email} onChange={(e)=>setSellerInfo(s=>({...s, email:e.target.value}))} placeholder="ایمیل" dir="ltr" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#ffdf00]/50 text-left" />
                  <label className="flex items-center gap-2 text-[11px] text-[#9a9a9a] cursor-pointer hover:text-white">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                    <span className="px-3 py-1.5 rounded-lg bg-[#242424] border border-[#2a2a2a] text-[11px] font-bold">آپلود لوگو</span>
                    <span className="truncate">{sellerLogo ? "لوگو انتخاب شد ✓" : "اختیاری — در فاکتور نمایش داده می‌شود"}</span>
                  </label>
                  {sellerLogo && <img src={sellerLogo} alt="logo" className="w-12 h-12 rounded-xl object-cover border border-[#2a2a2a]" />}
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
                <div className="text-[12px] font-black text-[#11ffba] mb-3 tracking-wide">خریدار (مشتری)</div>
                <div className="space-y-2.5">
                  <input value={buyerInfo.name} onChange={(e)=>setBuyerInfo(s=>({...s, name:e.target.value}))} placeholder="نام و نام خانوادگی مشتری *" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#11ffba]/50" />
                  <input value={buyerInfo.company} onChange={(e)=>setBuyerInfo(s=>({...s, company:e.target.value}))} placeholder="نام شرکت / مجموعه (اختیاری)" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#11ffba]/50" />
                  <input value={buyerInfo.phone} onChange={(e)=>setBuyerInfo(s=>({...s, phone:e.target.value}))} placeholder="شماره تماس مشتری" dir="ltr" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#11ffba]/50 text-left" />
                  <input value={buyerInfo.email} onChange={(e)=>setBuyerInfo(s=>({...s, email:e.target.value}))} placeholder="ایمیل مشتری" dir="ltr" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-[#11ffba]/50 text-left" />
                </div>
              </div>
            </div>

            {/* Invoice items preview */}
            {invoiceItems.length > 0 && (
              <div className="w-full max-w-[860px] mx-auto mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-black text-white">آیتم‌های فاکتور ({toPersianNumber(invoiceItems.length)})</span>
                  <button onClick={()=>setInvoiceItems([])} className="text-[11px] text-[#ff5555] hover:text-[#ff7777] font-bold">حذف همه</button>
                </div>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {invoiceItems.map((it, idx)=>(
                    <div key={it.id} className="flex items-center gap-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2.5">
                      <span className="text-[11px] font-mono text-[#666] min-w-[18px]">{toPersianNumber(idx+1)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-white truncate">{it.typeLabel} • {it.durationLabel} • {it.countLabel}</div>
                        <div className="text-[10px] text-[#9a9a9a] truncate">{it.services.length ? it.services.map(s=>s.label).join("، ") : "بدون خدمات اضافی"} • {`+${toPersianNumber(it.totalPercent)}%`}</div>
                      </div>
                      <span className="text-[12px] font-black text-[#ffdf00] whitespace-nowrap">{toPersianPrice(it.total)} ت</span>
                      <button onClick={()=>handleRemoveItem(it.id)} className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#9a9a9a] hover:text-[#ff5555] hover:border-[#ff5555]/30 flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#9a9a9a]">جمع کل فاکتور</span>
                  <span className="text-[16px] font-black text-[#ffdf00]">{toPersianPrice(invoiceTotal)} تومان</span>
                </div>
                <div className="text-[10px] text-[#666] mt-1">پایه: {toPersianPrice(invoiceSubtotal)} • میانگین افزایش: +{toPersianNumber(invoiceAvgPercent)}%</div>
              </div>
            )}

            {/* Export PDF - big primary button */}
            <button
              data-html2canvas-ignore="true"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full max-w-[860px] mx-auto flex items-center justify-center gap-2.5 py-4 md:py-5 rounded-2xl bg-[#ffdf00] hover:bg-[#ffeb3b] active:bg-[#ffd600] text-[#0a0a0a] text-[14px] md:text-[15px] font-black tracking-tight shadow-[0_8px_24px_rgba(255,223,0,0.22)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
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
                  {invoiceItems.length ? `خروجی PDF فاکتور (${toPersianNumber(invoiceItems.length)} آیتم)` : "خروجی PDF"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </main>

      {/* Hidden پیش فاکتور invoice - professional dark_gold, seller/buyer, multi-items */}
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
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#ffdf00", letterSpacing: "-0.02em" }}>پیش فاکتور</div>
            <div style={{ fontSize: "11px", color: "#9a9a9a", marginTop: "4px" }}>صورتحساب خدمات تدوین ویدیو</div>
            <div style={{ fontSize: "9px", color: "#666", marginTop: "8px", fontFamily: "monospace", direction: "ltr", textAlign: "right" as const }}>{invoiceNumber}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "left" as const }}>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#ffffff" }}>{sellerInfo.brand || sellerInfo.name || "نام برند شما"}</div>
              <div style={{ fontSize: "9px", color: "#9a9a9a", marginTop: "2px" }}>{sellerInfo.phone || "شماره تماس"} {sellerInfo.email ? `• ${sellerInfo.email}` : ""}</div>
              <div style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>{invoiceDateFa}</div>
            </div>
            <div
              style={{
                width: "42px",
                height: "42px",
                background: sellerLogo ? "transparent" : "#ffdf00",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#0a0a0a",
                fontSize: "18px",
                flexShrink: 0,
                overflow: "hidden",
                border: sellerLogo ? "1px solid #2a2a2a" : "none",
              }}
            >
              {sellerLogo ? <img src={sellerLogo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : sellerInfo.brand ? sellerInfo.brand.charAt(0) : sellerInfo.name ? sellerInfo.name.charAt(0) : "ب"}
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
              تعداد آیتم: <span style={{ fontWeight: 700, color: "#0a0a0a" }}>{toPersianNumber(invoiceItems.length || 1)}</span>
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "#f8f8f8", border: "1px solid #eeeeee", borderRadius: "12px", padding: "12px 14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#ffdf00", background: "#0a0a0a", display: "inline-block", padding: "2px 8px", borderRadius: "6px", marginBottom: "8px" }}>فروشنده</div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#0a0a0a" }}>{sellerInfo.name || "نام شما"}</div>
              {sellerInfo.brand && <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>{sellerInfo.brand}</div>}
              <div style={{ fontSize: "11px", color: "#666", marginTop: "6px", fontFamily: "monospace", direction: "ltr", textAlign: "right" as const }}>{sellerInfo.phone || "شماره تماس ثبت نشده"} </div>
              <div style={{ fontSize: "11px", color: "#666", fontFamily: "monospace", direction: "ltr", textAlign: "right" as const }}>{sellerInfo.email || "ایمیل ثبت نشده"}</div>
            </div>
            <div style={{ background: "#f0faf8", border: "1px solid #d1f0e8", borderRadius: "12px", padding: "12px 14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#ffffff", background: "#11c69a", display: "inline-block", padding: "2px 8px", borderRadius: "6px", marginBottom: "8px" }}>خریدار</div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#0a0a0a" }}>{buyerInfo.name || "نام مشتری"}</div>
              {buyerInfo.company && <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>{buyerInfo.company}</div>}
              <div style={{ fontSize: "11px", color: "#666", marginTop: "6px", fontFamily: "monospace", direction: "ltr", textAlign: "right" as const }}>{buyerInfo.phone || "شماره مشتری"} </div>
              <div style={{ fontSize: "11px", color: "#666", fontFamily: "monospace", direction: "ltr", textAlign: "right" as const }}>{buyerInfo.email || "ایمیل مشتری"}</div>
            </div>
          </div>

          {(invoiceItems.length ? (
            (() => null)()
          ) : null)}
          {/* Items table - multi or single */}
          <div style={{ marginTop: "18px" }}>
            <div style={{ fontSize: "12px", fontWeight: 900, marginBottom: "8px", color: "#0a0a0a" }}>ریز آیتم ها</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", border: "1px solid #eeeeee", borderRadius: "12px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#0a0a0a", color: "#ffffff" }}>
                  <th style={{ padding: "11px 8px", textAlign: "center", width: "42px", fontWeight: 800, fontSize: "11px" }}>ردیف</th>
                  <th style={{ padding: "11px 12px", textAlign: "right", fontWeight: 800, fontSize: "11px" }}>شرح پروژه</th>
                  <th style={{ padding: "11px 8px", textAlign: "center", width: "62px", fontWeight: 800, fontSize: "11px" }}>تعداد</th>
                  <th style={{ padding: "11px 12px", textAlign: "center", width: "132px", fontWeight: 800, fontSize: "11px" }}>مبلغ (تومان)</th>
                </tr>
              </thead>
              <tbody>
                {(invoiceItems.length ? invoiceItems : [{ id: "single", typeLabel: typeOptions[typeIdx].label, durationLabel: durationOptions[durationIdx].label, countLabel: countOptions[countIdx].label, services: selectedServices, total: price.total } as any]).map((it: any, i: number) => (
                  <tr key={it.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f9f9f9", borderTop: "1px solid #eeeeee" }}>
                    <td style={{ padding: "10px 8px", textAlign: "center", color: "#0a0a0a", fontWeight: 700 }}>{toPersianNumber(i + 1)}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: "#1a1a1a" }}>
                      <div style={{ fontWeight: 700, fontSize: "11.5px", color: "#0a0a0a" }}>{it.typeLabel} • {it.durationLabel} • {it.countLabel}</div>
                      <div style={{ fontSize: "10px", color: "#888", marginTop: "3px", lineHeight: 1.5 }}>{it.services?.length ? it.services.map((s: Service) => `${s.label} (+${toPersianNumber(s.percent)}%)`).join("، ") : "بدون خدمات اضافی"}</div>
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", color: "#0a0a0a", fontWeight: 700 }}>{toPersianNumber(parseInt(it.countLabel?.replace(/[^0-9]/g, "") || "1"))}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", color: "#0a0a0a", fontWeight: 800, fontFamily: "monospace" }}>{toPersianPrice(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "340px", border: "1px solid #eeeeee", borderRadius: "14px", overflow: "hidden", background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", fontSize: "12px", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#666" }}>جمع پایه</span>
                <span style={{ fontWeight: 800, color: "#0a0a0a", fontFamily: "monospace" }}>{toPersianPrice(invoiceSubtotal)} تومان</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", fontSize: "12px", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#666" }}>میانگین افزایش</span>
                <span style={{ fontWeight: 800, color: "#d68a00", fontFamily: "monospace" }}>{`+${toPersianNumber(invoiceAvgPercent)}%`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "#ffdf00", fontSize: "13px", fontWeight: 900, color: "#0a0a0a" }}>
                <span>مبلغ قابل پرداخت</span>
                <span style={{ fontFamily: "monospace" }}>{toPersianPrice(invoiceTotal)} تومان</span>
              </div>
              <div style={{ padding: "8px 16px", fontSize: "9px", color: "#888", textAlign: "center", background: "#fffde7", borderTop: "1px solid #ffec99" }}>
                قیمت‌ها به تومان • جمع کل {invoiceItems.length ? `${toPersianNumber(invoiceItems.length)} پروژه` : "یک پروژه"} با احتساب کلیه خدمات
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px", fontSize: "10px", color: "#777", lineHeight: 1.8, borderTop: "1px solid #eeeeee", paddingTop: "14px" }}>
            <div style={{ fontWeight: 800, color: "#0a0a0a", marginBottom: "6px", fontSize: "11px" }}>توضیحات:</div>
            <div>• این پیش فاکتور صرفا برآورد اولیه است و قیمت نهایی پس از بررسی دقیق فایل ها و جزئیات پروژه تایید می شود.</div>
            <div>• اعتبار این پیش فاکتور ۷ روز از تاریخ صدور می باشد.</div>
            <div>• پرداخت ۵۰٪ پیش پرداخت جهت شروع پروژه الزامی است و مابقی پس از تحویل تسویه می گردد.</div>
            <div>• هرگونه خدمات خارج از لیست فوق، جداگانه محاسبه خواهد شد.</div>
          </div>

          <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e5e5e5", paddingTop: "14px" }}>
            <div style={{ fontSize: "10px", color: "#999" }}>
              <div>Powered by bumim — bumim.ir</div>
              <div style={{ fontFamily: "monospace", fontSize: "9px", marginTop: "2px" }}>برای تدوینگران حرفه ای</div>
            </div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: "10px", color: "#aaa" }}>امضا و مهر فروشنده</div>
              <div style={{ marginTop: "22px", width: "140px", borderTop: "1px solid #ccc" }} />
            </div>
          </div>

          <div style={{ marginTop: "10px", textAlign: "center", fontSize: "9px", color: "#bbb" }}>با تشکر از اعتماد شما</div>
        </div>
      </div>
    </>
  );
}
