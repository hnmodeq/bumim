"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { GlowMenu } from "@/components/ui/glow-menu";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Plus,
  Trash2,
  FileDown,
  Upload,
  User,
  Building2,
  Sparkles,
  Layers,
  Settings,
  Video,
} from "lucide-react";

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
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className="relative w-full h-[140px] md:h-[170px] select-none outline-none cursor-grab active:cursor-grabbing bg-transparent touch-none overscroll-contain overflow-hidden rounded-2xl"
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[3px] h-[26px] bg-primary rounded-full pointer-events-none z-10 shadow-[0_0_10px_#ffdf00]" />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[3px] h-[26px] bg-emerald-400 rounded-full pointer-events-none z-10 shadow-[0_0_10px_#34d399]" />

      <div className="absolute inset-x-0 top-0 h-[36px] bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-[36px] bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

      <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[36px] bg-white/[0.08] border border-white/[0.15] rounded-xl pointer-events-none z-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            transform: `translateY(calc(-18px - ${selected * ITEM_PX}px + ${dragOffset}px))`,
            transition: isDragging ? "none" : "transform 480ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          {options.map((opt, idx) => {
            const liveIdx = selected - dragOffset / ITEM_PX;
            const liveDist = idx - liveIdx;
            const absLive = Math.abs(liveDist);
            const isSelected = absLive < 0.5;
            const abs = isDragging ? Math.round(absLive) : Math.abs(idx - selected);

            let opacity = 1;
            if (abs === 0) opacity = 1;
            else if (abs === 1) opacity = 0.85;
            else if (abs === 2) opacity = 0.55;
            else if (abs === 3) opacity = 0.32;
            else opacity = 0.14;

            const color = isSelected ? "#ffffff" : abs === 1 ? "#e4e4e7" : "#71717a";

            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onSelect(idx)}
                aria-selected={isSelected}
                className="w-full flex items-center justify-center text-center select-none cursor-pointer"
                style={{
                  height: `${ITEM_PX}px`,
                  opacity,
                  color,
                }}
              >
                <span
                  className={`block w-full px-2 text-center tracking-tight leading-none whitespace-nowrap overflow-hidden text-ellipsis ${
                    isSelected
                      ? "text-sm md:text-base font-black text-white"
                      : abs === 1
                      ? "text-xs md:text-sm font-bold text-zinc-300"
                      : "text-xs font-medium text-zinc-500"
                  }`}
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
      type="button"
      dir="ltr"
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-2 py-2.5 px-3 rounded-2xl cursor-pointer select-none border transition-all text-right",
        checked
          ? "bg-primary/10 border-primary/50 text-white shadow-[0_0_14px_rgba(255,223,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.2)] font-black"
          : "bg-white/[0.035] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/[0.06]"
      )}
    >
      <span
        className={cn(
          "text-[11px] font-black font-mono tracking-tight min-w-[36px] text-left shrink-0",
          checked ? "text-primary" : "text-zinc-500"
        )}
      >
        +{toPersianNumber(service.percent)}%
      </span>

      <Checkbox
        checked={checked}
        className={cn(
          "pointer-events-none rounded-md",
          checked ? "bg-primary text-primary-foreground border-primary shadow-[0_0_8px_#ffdf00]" : "border-white/20 bg-white/5"
        )}
      />

      <span className={cn("flex-1 min-w-0 text-right truncate text-xs font-bold", checked ? "text-white" : "")}>
        {service.label}
      </span>
    </button>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 w-full max-w-[640px] mx-auto my-3">
      <div className="h-[1px] flex-1 rounded-full bg-white/[0.08]" />
      <span className="text-[11px] font-black tracking-wider uppercase whitespace-nowrap text-primary shadow-[0_0_12px_rgba(255,223,0,0.25)]">
        {label}
      </span>
      <div className="h-[1px] flex-1 rounded-full bg-white/[0.08]" />
    </div>
  );
}

export default function InvoicePage() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [durationIdx, setDurationIdx] = useState(0);
  const [countIdx, setCountIdx] = useState(0);

  const [basicChecked, setBasicChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(basicServices.map((s) => [s.id, s.id === "rough_cut"]))
  );
  const [advChecked, setAdvChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(advancedServices.map((s) => [s.id, false]))
  );

  const [sellerInfo, setSellerInfo] = useState({
    name: "",
    brand: "",
    phone: "",
    email: "",
  });
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });
  const [sellerLogo, setSellerLogo] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const price = useMemo(() => {
    const basePrice = typeOptions[typeIdx].base || 888_000;
    const durFactor = durationOptions[durationIdx].factor || 1.0;
    const cntFactor = countOptions[countIdx].factor || 1.0;
    const cntMult = countMultiplier[countOptions[countIdx].label] || 1.0;

    const baseTotal = basePrice * durFactor * cntFactor * cntMult;

    let totalPercent = 0;
    basicServices.forEach((s) => {
      if (basicChecked[s.id]) totalPercent += s.percent;
    });
    advancedServices.forEach((s) => {
      if (advChecked[s.id]) totalPercent += s.percent;
    });

    const finalTotal = Math.round((baseTotal * (100 + totalPercent)) / 100);

    return {
      subtotal: Math.round(baseTotal),
      totalPercent,
      total: finalTotal,
    };
  }, [typeIdx, durationIdx, countIdx, basicChecked, advChecked]);

  const invoiceNumber = useMemo(() => {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BUM-${ymd}-${rand}`;
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
    toast.success("پروژه با موفقیت به پیش‌فاکتور افزوده شد");
  }, [typeIdx, durationIdx, countIdx, selectedServices, price]);

  const handleRemoveItem = useCallback((id: string) => {
    setInvoiceItems((prev) => prev.filter((x) => x.id !== id));
    toast.info("آیتم از پیش‌فاکتور حذف شد");
  }, []);

  const invoiceTotal = useMemo(() => {
    if (invoiceItems.length === 0) return price.total;
    return invoiceItems.reduce((sum, it) => sum + it.total, 0);
  }, [invoiceItems, price.total]);

  const invoiceSubtotal = useMemo(() => {
    if (invoiceItems.length === 0) return price.subtotal;
    return invoiceItems.reduce((sum, it) => sum + it.subtotal, 0);
  }, [invoiceItems, price.subtotal]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSellerLogo(reader.result as string);
      toast.success("لوگو با موفقیت بارگذاری شد");
    };
    reader.readAsDataURL(f);
  }, []);

  // PDF Export
  const handleExportPDF = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    toast.loading("در حال آماده‌سازی و ساخت فایل PDF استاندارد...", { id: "pdf-toast" });

    try {
      // @ts-ignore
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 80));

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

      let vazirRegularBase64: string | null = null;
      let vazirBoldBase64: string | null = null;
      try {
        [vazirRegularBase64, vazirBoldBase64] = await Promise.all([
          loadFont("/fonts/Vazirmatn-Regular.ttf"),
          loadFont("/fonts/Vazirmatn-Bold.ttf"),
        ]);
      } catch (e) {
        console.warn("Vazir font load fallback to helvetica", e);
      }

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
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

      const toFaPrice = (n: number) => toPersianPrice(n);
      const toFaNum = (n: number | string) => toPersianNumber(typeof n === "string" ? parseInt(n) || 0 : n);

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

      // Header (dark)
      pdf.setFillColor("#0a0a0a");
      pdf.rect(0, 0, pdfW, 78, "F");

      // Seller logo
      let logoAdded = false;
      if (sellerLogo) {
        try {
          pdf.addImage(sellerLogo, "PNG", margin, 18, 42, 42, undefined, "FAST");
          logoAdded = true;
        } catch {}
      }
      if (!logoAdded) {
        pdf.setFillColor("#ffdf00");
        const x = margin;
        const y = 18;
        try {
          // @ts-ignore
          pdf.roundedRect(x, y, 42, 42, 10, 10, "F");
        } catch {
          pdf.rect(x, y, 42, 42, "F");
        }
        pdf.setFont("Vazirmatn", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor("#0a0a0a");
        const initial = (sellerInfo.brand || sellerInfo.name || "ب").charAt(0);
        pdf.text(initial, x + 21, y + 27, { align: "center" });
      }

      const sellerX = margin + 52;
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor("#ffffff");
      const sellerTitle = sellerInfo.brand || sellerInfo.name || "نام برند ویدیو ادیتور ثبت نشده";
      pdf.text(sellerTitle, sellerX, 30, { align: "left" } as any);
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor("#9a9a9a");
      const sellerContact = sellerInfo.email || "پست الکترونیکی ویدیو ادیتور ثبت نشده";
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
      pdf.text("صورتحساب خدمات ادیت ویدیو", pdfW - margin, 46, { align: "right" } as any);

      let y = 90;
      const boxH = 62;
      const boxW = (pdfW - margin * 2 - 10) / 2;
      const boxR = 10;
      const sellerBoxX = pdfW - margin - boxW;
      const buyerBoxX = margin;

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

      // Seller badge
      pdf.setFillColor("#0a0a0a");
      pdf.setFontSize(6.5);
      pdf.setFont("Vazirmatn", "bold");
      pdf.setTextColor("#ffdf00");
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
      pdf.text(sellerInfo.name || "نام ویدیو ادیتور ثبت نشده", sellerBoxX + boxW - 10, y + 32, { align: "right" } as any);
      if (sellerInfo.brand) {
        pdf.setFont("Vazirmatn", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor("#333");
        pdf.text(sellerInfo.brand, sellerBoxX + boxW - 10, y + 44, { align: "right" } as any);
      }
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor("#666");
      pdf.text(sellerInfo.phone || "تلفن تماس ویدیو ادیتور ثبت نشده", sellerBoxX + boxW - 10, y + 54, { align: "right" } as any);
      if (sellerInfo.email) {
        pdf.text(sellerInfo.email, sellerBoxX + boxW - 10, y + 62 - (sellerInfo.brand ? 0 : 8), { align: "right" } as any);
      }

      // Buyer badge
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
      pdf.text(buyerInfo.name || "نام مشتری ثبت نشده", buyerBoxX + boxW - 10, y + 32, { align: "right" } as any);
      if (buyerInfo.company) {
        pdf.setFont("Vazirmatn", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor("#333");
        pdf.text(buyerInfo.company, buyerBoxX + boxW - 10, y + 44, { align: "right" } as any);
      }
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor("#666");
      pdf.text(buyerInfo.phone || "تلفن تماس مشتری ثبت نشده", buyerBoxX + boxW - 10, y + 54, { align: "right" } as any);
      if (buyerInfo.email) {
        pdf.text(buyerInfo.email, buyerBoxX + boxW - 10, y + 62 - (buyerInfo.company ? 0 : 8), { align: "right" } as any);
      }

      y += boxH + 18;

      // Items table
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor("#0a0a0a");
      pdf.text("ریز آیتم ها", pdfW - margin, y, { align: "right" } as any);
      y += 10;

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

      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7.5);
      const rowHPadding = 6;
      const maxTableY = pdfH - 160;

      for (let i = 0; i < itemsToPrint.length; i++) {
        const it: any = itemsToPrint[i];
        if (y > maxTableY) {
          pdf.addPage();
          y = 32;
        }
        const servicesText = it.services?.length
          ? it.services.map((s: any) => s.label).join("، ")
          : "بدون خدمات اضافی";

        function flipNumberToFront(label: string): string {
          const parts = label.trim().split(/\s+/);
          if (parts.length >= 2) {
            const first = parts[0];
            const second = parts[1];
            if (/^[0-9۰-۹]+$/.test(second)) {
              return `${second} ${first}`;
            }
          }
          return label;
        }

        const title = `${it.typeLabel} • ${flipNumberToFront(it.durationLabel)} • ${flipNumberToFront(it.countLabel)}`;
        pdf.setFont("Vazirmatn", "bold");
        const svcLines = pdf.splitTextToSize(servicesText, colW.desc - 12);
        const lines = 1 + svcLines.length;
        const rowH = Math.max(28, 14 + lines * 9 + rowHPadding);

        if (y + rowH > pdfH - 100) {
          pdf.addPage();
          y = 32;
        }

        if (i % 2 === 1) {
          pdf.setFillColor("#f9f9f9");
          pdf.rect(tableX, y, pdfW - margin * 2, rowH, "F");
        }
        pdf.setDrawColor("#eeeeee");
        pdf.setLineWidth(0.4);
        pdf.rect(tableX, y, pdfW - margin * 2, rowH, "S");

        const c1 = tableX + colW.row;
        const c2 = c1 + colW.desc;
        const c3 = c2 + colW.count;
        pdf.line(c1, y, c1, y + rowH);
        pdf.line(c2, y, c2, y + rowH);
        pdf.line(c3, y, c3, y + rowH);

        pdf.setTextColor("#0a0a0a");
        pdf.setFont("Vazirmatn", "bold");
        pdf.setFontSize(7.5);
        pdf.text(toFaNum(i + 1), tableX + colW.row / 2, y + 14, { align: "center" } as any);

        pdf.text(title, c1 + colW.desc - 6, y + 12, { align: "right" } as any);
        pdf.setFont("Vazirmatn", "normal");
        pdf.setFontSize(6.5);
        pdf.setTextColor("#777");
        let sy = y + 22;
        for (const line of svcLines) {
          pdf.text(line, c1 + colW.desc - 6, sy, { align: "right" } as any);
          sy += 8;
        }

        pdf.setFont("Vazirmatn", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor("#0a0a0a");
        const cntNum = it.countLabel ? it.countLabel.replace(/[^0-9]/g, "") || "1" : "1";
        pdf.text(toFaNum(parseInt(cntNum)), c2 + colW.count / 2, y + rowH / 2 + 2.5, { align: "center" } as any);

        pdf.setFont("Vazirmatn", "bold");
        pdf.text(toFaPrice(it.total), c3 + colW.amount / 2, y + rowH / 2 + 2.5, { align: "center" } as any);

        y += rowH;
      }

      // Summary
      const summaryW = 220;
      const summaryX = pdfW - margin - summaryW;
      if (y + 72 > pdfH - 60) {
        pdf.addPage();
        y = 32;
      }
      y += 12;

      pdf.setDrawColor("#eeeeee");
      pdf.setFillColor("#ffffff");
      const summaryH = 38;
      try {
        // @ts-ignore
        pdf.roundedRect(summaryX, y, summaryW, summaryH, 8, 8, "FD");
      } catch {
        pdf.rect(summaryX, y, summaryW, summaryH, "FD");
      }

      pdf.setDrawColor("#f0f0f0");
      pdf.line(summaryX, y + 18, summaryX + summaryW, y + 18);
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor("#666");
      pdf.text("جمع پایه", summaryX + 12, y + 12, { align: "left" } as any);
      pdf.setFont("Vazirmatn", "bold");
      pdf.setTextColor("#0a0a0a");
      pdf.text(toFaPrice(invoiceSubtotal) + " تومان", summaryX + summaryW - 12, y + 12, { align: "right" } as any);

      pdf.setFillColor("#ffdf00");
      try {
        // @ts-ignore
        pdf.roundedRect(summaryX, y + 18, summaryW, 20, 0, 0, "F");
        pdf.rect(summaryX, y + 18, summaryW, 20, "F");
        pdf.setDrawColor("#eeeeee");
        pdf.rect(summaryX, y, summaryW, summaryH, "S");
      } catch {
        pdf.setFillColor("#ffdf00");
        pdf.rect(summaryX, y + 18, summaryW, 20, "F");
      }
      pdf.setFont("Vazirmatn", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor("#0a0a0a");
      pdf.text("مبلغ قابل پرداخت", summaryX + 12, y + 31, { align: "left" } as any);
      pdf.text(toFaPrice(invoiceTotal) + " تومان", summaryX + summaryW - 12, y + 31, { align: "right" } as any);

      y += summaryH + 10;
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor("#888");
      pdf.text("قیمت‌ها به تومان • جمع کل " + toFaNum(itemsToPrint.length) + " پروژه با احتساب کلیه خدمات", summaryX + summaryW / 2, y, { align: "center" } as any);

      y += 18;
      pdf.setDrawColor("#eeeeee");
      pdf.line(margin, y, pdfW - margin, y);
      y += 12;

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

      // Footer
      const footerY = y;
      pdf.setFont("Vazirmatn", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor("#999");
      const footerLogoSize = 14;
      const footerText = "قدرت گرفته از بومیم";
      let logoX = 0;

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
          pdf.setFont("Vazirmatn", "normal");
          pdf.setFontSize(7);
          const textW = pdf.getTextWidth(footerText);
          const totalW = textW + footerLogoSize + 4;
          logoX = pdfW / 2 - totalW / 2;
          pdf.addImage("data:image/png;base64," + logoBase64, "PNG", logoX, footerY - 3, footerLogoSize, footerLogoSize);
          pdf.text(footerText, logoX + footerLogoSize + 4, footerY + 6, { align: "left" } as any);

          const prefixW = pdf.getTextWidth("قدرت گرفته از ");
          const bumimX2 = logoX + footerLogoSize + 4 + prefixW;
          const bumimW = pdf.getTextWidth("بومیم");
          // @ts-ignore
          pdf.link(bumimX2, footerY - 2, bumimW, 10, { url: "https://bumims.ir" });
        } else {
          pdf.text(footerText, pdfW / 2, footerY + 6, { align: "center" } as any);
          const textW = pdf.getTextWidth(footerText);
          const prefixW = pdf.getTextWidth("قدرت گرفته از ");
          const bumimX2 = pdfW / 2 - textW / 2 + prefixW;
          const bumimW = pdf.getTextWidth("بومیم");
          // @ts-ignore
          pdf.link(bumimX2, footerY - 2, bumimW, 10, { url: "https://bumims.ir" });
        }
      } catch {
        pdf.text(footerText, pdfW / 2, footerY + 6, { align: "center" } as any);
      }

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      pdf.setTextColor("#999");
      pdf.text("bumims.ir", pdfW / 2, footerY + 14, { align: "center" } as any);

      const customerName = buyerInfo.name || buyerInfo.company || "مشتری";
      const safeCustomer = customerName.replace(/[\/*?:"<>|]/g, "");
      const fileName = `پیش فاکتور برای ${safeCustomer} - ${invoiceNumber}.pdf`;
      pdf.save(fileName);

      toast.success("فایل PDF پیش‌فاکتور با موفقیت دانلود شد", { id: "pdf-toast" });
    } catch (e) {
      console.error("PDF export error", e);
      toast.error("خطا در ایجاد PDF", { id: "pdf-toast" });
    } finally {
      setIsExporting(false);
    }
  }, [
    isExporting,
    price,
    invoiceNumber,
    invoiceDateFa,
    sellerInfo,
    buyerInfo,
    sellerLogo,
    invoiceItems,
    invoiceTotal,
    invoiceSubtotal,
    typeIdx,
    durationIdx,
    countIdx,
    selectedServices,
  ]);

  const formattedPrice = useMemo(() => {
    return toPersianPrice(price.total);
  }, [price.total]);

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
                <span className="text-zinc-200">محاسبه‌گر هوشمند دستمزد تدوین</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
              چقدر دستمزد بگیرم؟
            </h1>
            <p className="text-xs text-zinc-400">
              نوع پروژه، مدت زمان راش و تعداد ویدیو را انتخاب کنید
            </p>
          </div>

          {/* Wheels Container */}
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
                className="w-full sm:w-auto font-black text-xs h-11 px-5 rounded-xl gap-1.5 shadow-[0_0_24px_rgba(255,223,0,0.35)] hover:shadow-[0_0_36px_rgba(255,223,0,0.55)]"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن این پروژه به پیش‌فاکتور</span>
              </Button>
            </div>
          </div>

          {/* Multi-project invoice items list */}
          {invoiceItems.length > 0 && (
            <div className="rounded-3xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <div className="p-4 px-5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="text-xs font-black text-white flex items-center gap-2">
                  <span>پروژه‌های ثبت‌شده در پیش‌فاکتور</span>
                  <Badge variant="secondary" className="text-[10px] font-mono bg-white/10 text-white border-white/10">
                    {toPersianNumber(invoiceItems.length)} آیتم
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInvoiceItems([]);
                    toast.info("لیست پیش‌فاکتور خالی شد");
                  }}
                  className="text-xs text-red-400 hover:bg-red-500/10 h-7 px-2 rounded-lg"
                >
                  <Trash2 className="w-3 h-3 ms-1" />
                  پاک کردن همه
                </Button>
              </div>

              <Table>
                <TableHeader className="bg-white/[0.03]">
                  <TableRow className="border-white/[0.08]">
                    <TableHead className="w-12 text-center text-[11px] font-black text-white">ردیف</TableHead>
                    <TableHead className="text-right text-[11px] font-black text-white">شرح پروژه</TableHead>
                    <TableHead className="text-center text-[11px] font-black text-white">تعداد</TableHead>
                    <TableHead className="text-center text-[11px] font-black text-white">مبلغ</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.map((it, idx) => (
                    <TableRow key={it.id} className="border-white/[0.05] hover:bg-white/[0.03]">
                      <TableCell className="text-center font-mono text-xs text-zinc-400">{toPersianNumber(idx + 1)}</TableCell>
                      <TableCell className="text-right py-3">
                        <div className="text-xs font-bold text-white">
                          {it.typeLabel} • {it.durationLabel} • {it.countLabel}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-xs mt-0.5">
                          {it.services.length ? it.services.map((s) => s.label).join("، ") : "بدون خدمات اضافی"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-bold text-zinc-300">
                        {it.countLabel ? toPersianNumber(parseInt(it.countLabel.replace(/[^0-9]/g, "") || "1")) : "۱"}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-black text-primary">
                        {toPersianPrice(it.total)}
                      </TableCell>
                      <TableCell className="text-center p-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(it.id)}
                          className="w-6 h-6 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="p-4 px-5 bg-white/[0.04] border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-400">جمع کل فاکتور ({toPersianNumber(invoiceItems.length)} پروژه):</span>
                <span className="font-black text-base text-primary font-mono">{toPersianPrice(invoiceTotal)} تومان</span>
              </div>
            </div>
          )}

          {/* Seller & Buyer Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Seller */}
            <div className="rounded-3xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl p-4 md:p-5 space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <div className="text-xs font-black text-primary flex items-center gap-1.5 pb-1">
                <User className="w-3.5 h-3.5" />
                <span>اطلاعات فروشنده (شما)</span>
              </div>
              <Input
                value={sellerInfo.name}
                onChange={(e) => setSellerInfo((s) => ({ ...s, name: e.target.value }))}
                placeholder="نام ویدیو ادیتور"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10"
              />
              <Input
                value={sellerInfo.brand}
                onChange={(e) => setSellerInfo((s) => ({ ...s, brand: e.target.value }))}
                placeholder="نام برند / شرکت (اختیاری)"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10"
              />
              <Input
                value={sellerInfo.phone}
                onChange={(e) => setSellerInfo((s) => ({ ...s, phone: e.target.value }))}
                placeholder="تلفن تماس ویدیو ادیتور"
                dir="ltr"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10 text-left font-mono"
              />
              <Input
                value={sellerInfo.email}
                onChange={(e) => setSellerInfo((s) => ({ ...s, email: e.target.value }))}
                placeholder="پست الکترونیکی"
                dir="ltr"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10 text-left font-mono"
              />
              <div className="flex items-center gap-2 pt-1">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] text-xs font-bold hover:bg-white/[0.15] transition-colors text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود لوگوی اختصاصی</span>
                  </div>
                </label>
                <span className="text-[11px] text-zinc-400 truncate">
                  {sellerLogo ? "✓ لوگو انتخاب شد" : "اختیاری (نمایش در PDF)"}
                </span>
              </div>
            </div>

            {/* Buyer */}
            <div className="rounded-3xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl p-4 md:p-5 space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5 pb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>اطلاعات خریدار (مشتری)</span>
              </div>
              <Input
                value={buyerInfo.name}
                onChange={(e) => setBuyerInfo((s) => ({ ...s, name: e.target.value }))}
                placeholder="نام مشتری"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10"
              />
              <Input
                value={buyerInfo.company}
                onChange={(e) => setBuyerInfo((s) => ({ ...s, company: e.target.value }))}
                placeholder="نام شرکت / پیج / مجموعه (اختیاری)"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10"
              />
              <Input
                value={buyerInfo.phone}
                onChange={(e) => setBuyerInfo((s) => ({ ...s, phone: e.target.value }))}
                placeholder="تلفن تماس مشتری"
                dir="ltr"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10 text-left font-mono"
              />
              <Input
                value={buyerInfo.email}
                onChange={(e) => setBuyerInfo((s) => ({ ...s, email: e.target.value }))}
                placeholder="ایمیل مشتری"
                dir="ltr"
                className="text-xs bg-white/[0.035] border-white/[0.1] rounded-xl h-10 text-left font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              size="lg"
              className="w-full font-black text-sm md:text-base py-6 shadow-[0_0_36px_rgba(255,223,0,0.35)] hover:shadow-[0_0_50px_rgba(255,223,0,0.6)] transition-all gap-2 rounded-2xl"
            >
              {isExporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>در حال ساخت پیش‌فاکتور PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  <span>
                    {invoiceItems.length > 0
                      ? `خروجی پیش‌فاکتور PDF استاندارد (${toPersianNumber(invoiceItems.length)} پروژه — ${toPersianPrice(invoiceTotal)} تومان)`
                      : `خروجی پیش‌فاکتور PDF استاندارد (${formattedPrice} تومان)`}
                  </span>
                </>
              )}
            </Button>
          </div>
        </FrostedCard>
      </div>
    </main>
  );
}
