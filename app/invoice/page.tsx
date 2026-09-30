"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { GlowMenu } from "@/components/ui/glow-menu";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  type InvoiceItem,
  toPersianNumber,
  toPersianPrice,
  INVOICE_STORAGE_KEY,
} from "@/app/lib/invoice-types";
import {
  Calculator as CalcIcon,
  Plus,
  Trash2,
  FileDown,
  Upload,
  User,
  Building2,
  Sparkles,
  ArrowLeft,
  FileSpreadsheet,
  CheckCircle2,
  Receipt,
} from "lucide-react";

export default function InvoicePage() {
  // Invoice items list
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Seller info
  const [sellerInfo, setSellerInfo] = useState({
    name: "",
    brand: "",
    phone: "",
    email: "",
  });
  const [sellerLogo, setSellerLogo] = useState<string | null>(null);

  // Buyer info
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  // Invoice meta
  const [invoiceNumber] = useState<string>(() => {
    const d = new Date();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BUM-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${rand}`;
  });

  const invoiceDateFa = useMemo(() => {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      dateStyle: "full",
    }).format(new Date());
  }, []);

  // Load stored invoice items and user profile on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(INVOICE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInvoiceItems(parsed);
        }
      }
    } catch {
      // ignore
    }

    try {
      const storedProfile = localStorage.getItem("bumim_customer_profile");
      if (storedProfile) {
        const p = JSON.parse(storedProfile);
        if (p.name) setBuyerInfo((prev) => ({ ...prev, name: p.name }));
        if (p.phone) setBuyerInfo((prev) => ({ ...prev, phone: p.phone }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync invoice items to localStorage
  const updateInvoiceItems = (items: InvoiceItem[]) => {
    setInvoiceItems(items);
    try {
      localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const handleRemoveItem = useCallback(
    (id: string) => {
      const updated = invoiceItems.filter((x) => x.id !== id);
      updateInvoiceItems(updated);
      toast.info("آیتم از پیش‌فاکتور حذف شد");
    },
    [invoiceItems]
  );

  const handleClearAll = useCallback(() => {
    updateInvoiceItems([]);
    toast.info("لیست پیش‌فاکتور خالی شد");
  }, []);

  const handleAddQuickSample = () => {
    const sampleItem: InvoiceItem = {
      id: "item-" + Date.now(),
      typeLabel: "ادیت ویدیوی ریلز اینستاگرامی",
      durationLabel: "۶۰ ثانیه",
      countLabel: "ویدیو ۱",
      services: [
        { label: "کات و راف کات", percent: 8 },
        { label: "اصلاح رنگ حرفه‌ای", percent: 12 },
        { label: "موزیک و افکت صوتی", percent: 10 },
      ],
      subtotal: 1800000,
      totalPercent: 30,
      total: 2340000,
    };
    updateInvoiceItems([...invoiceItems, sampleItem]);
    toast.success("ردیف تستی اضافه شد");
  };

  const invoiceTotal = useMemo(() => {
    if (invoiceItems.length === 0) return 0;
    return invoiceItems.reduce((sum, it) => sum + it.total, 0);
  }, [invoiceItems]);

  const invoiceSubtotal = useMemo(() => {
    if (invoiceItems.length === 0) return 0;
    return invoiceItems.reduce((sum, it) => sum + it.subtotal, 0);
  }, [invoiceItems]);

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
    if (invoiceItems.length === 0) {
      toast.error("لطفاً حداقل یک پروژه به لیست پیش‌فاکتور اضافه کنید.");
      return;
    }

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

      const itemsToPrint = invoiceItems;

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
        const it = itemsToPrint[i];
        if (y > maxTableY) {
          pdf.addPage();
          y = 32;
        }
        const servicesText = it.services?.length
          ? it.services.map((s) => s.label).join("، ")
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
    invoiceNumber,
    invoiceDateFa,
    sellerInfo,
    buyerInfo,
    sellerLogo,
    invoiceItems,
    invoiceTotal,
    invoiceSubtotal,
  ]);

  return (
    <main className="min-h-screen bg-[#060608] text-foreground px-3 md:px-6 py-6 md:py-10 relative overflow-hidden selection:bg-primary/20">
      {/* Background ambient iridescent orbs */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Glow Menu Dock */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pb-8 z-20">
        <GlowMenu />
      </header>

      <div className="w-full max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-1.5 mx-auto">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-xs font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Receipt className="w-3.5 h-3.5 text-primary" />
              <span className="text-zinc-200">سیستم صدور پیش‌فاکتور رسمی تدوینگران</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
            صدور و چاپ پیش‌فاکتور
          </h1>
          <p className="text-xs text-zinc-400">
            مشخصات خود و کارفرما را وارد کنید و پیش‌فاکتور استاندارد و قابل کپی در قالب PDF دریافت کنید
          </p>
        </div>

        {/* Main Invoice Card */}
        <FrostedCard accentGlow="rgba(255, 223, 0, 0.2)" className="p-5 md:p-8 space-y-6">
          {/* Top Actions & Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="space-y-0.5">
              <div className="text-xs text-zinc-400">شماره پیش‌فاکتور:</div>
              <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <span>{invoiceNumber}</span>
                <Badge variant="outline" className="border-white/15 text-[10px] text-zinc-400 font-sans">
                  {invoiceDateFa}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/calculator"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "font-bold text-xs h-9 gap-1.5 rounded-xl shadow-[0_0_16px_rgba(255,223,0,0.3)] w-full sm:w-auto"
                )}
              >
                <Plus className="w-4 h-4" />
                <span>+ افزودن پروژه از ماشین حساب</span>
              </Link>
            </div>
          </div>

          {/* Invoice Items Table */}
          {invoiceItems.length > 0 ? (
            <div className="rounded-3xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <div className="p-4 px-5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="text-xs font-black text-white flex items-center gap-2">
                  <span>ریز پروژه‌ها و خدمات</span>
                  <Badge variant="secondary" className="text-[10px] font-mono bg-white/10 text-white border-white/10">
                    {toPersianNumber(invoiceItems.length)} ردیف
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-red-400 hover:bg-red-500/10 h-7 px-2 rounded-lg cursor-pointer"
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
                      <TableCell className="text-center font-mono text-xs text-zinc-400">
                        {toPersianNumber(idx + 1)}
                      </TableCell>
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
                <span className="font-bold text-zinc-400">
                  جمع کل فاکتور ({toPersianNumber(invoiceItems.length)} پروژه):
                </span>
                <span className="font-black text-base text-primary font-mono">
                  {toPersianPrice(invoiceTotal)} تومان
                </span>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">هنوز پروژه‌ای به پیش‌فاکتور اضافه نشده است</h4>
                <p className="text-xs text-zinc-400">
                  برای برآورد دقیق قیمت و افزودن به این فاکتور، وارد ماشین حساب شوید یا یک نمونه تستی اضافه کنید.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Link
                  href="/calculator"
                  className={cn(buttonVariants({ size: "sm" }), "font-bold text-xs h-9 gap-1.5 rounded-xl")}
                >
                  <CalcIcon className="w-4 h-4" />
                  <span>ورود به ماشین حساب و انتخاب پروژه</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuickSample}
                  className="font-bold text-xs h-9 rounded-xl border-white/15 text-zinc-300 hover:text-white"
                >
                  + افزودن نمونه تستی
                </Button>
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

          {/* PDF Download Button */}
          <div className="pt-2">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting || invoiceItems.length === 0}
              size="lg"
              className="w-full font-black text-sm md:text-base py-6 shadow-[0_0_36px_rgba(255,223,0,0.35)] hover:shadow-[0_0_50px_rgba(255,223,0,0.6)] transition-all gap-2 rounded-2xl cursor-pointer"
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
                      : "برای صدور PDF ابتدا یک پروژه اضافه کنید"}
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
