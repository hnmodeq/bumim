"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon,
  Calculator as CalcIcon,
  FileSpreadsheet,
  Layers,
  Film,
  UserCheck,
  Briefcase,
  Users,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  PAGE_VISIBILITY_STORAGE_KEY,
  defaultPageVisibility,
  type PageVisibility,
} from "@/app/lib/invoice-types";

export type NavItem = {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  glowColor: string;
  badge?: string;
};

const allNavItems: NavItem[] = [
  {
    id: "home",
    name: "خانه",
    href: "/",
    icon: HomeIcon,
    color: "#fafafa",
    glowColor: "rgba(255, 255, 255, 0.4)",
  },
  {
    id: "calculator",
    name: "ماشین حساب",
    href: "/calculator",
    icon: CalcIcon,
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.5)",
    badge: "جدید",
  },
  {
    id: "invoice",
    name: "پیش‌فاکتور",
    href: "/invoice",
    icon: FileSpreadsheet,
    color: "#ffdf00",
    glowColor: "rgba(255, 223, 0, 0.5)",
  },
  {
    id: "services",
    name: "تعرفه‌ها",
    href: "/services",
    icon: Layers,
    color: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.5)",
  },
  {
    id: "samples",
    name: "نمونه‌کارها",
    href: "/samples",
    icon: Film,
    color: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.5)",
  },
  {
    id: "portfolio",
    name: "پرتفولیو",
    href: "/portfolio",
    icon: UserCheck,
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
  {
    id: "jobs",
    name: "پروژه‌ها",
    href: "/jobs",
    icon: Briefcase,
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: "hire",
    name: "درخواست ادیتور",
    href: "/hire",
    icon: Users,
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
  {
    id: "account",
    name: "حساب کاربری",
    href: "/account",
    icon: User,
    color: "#e2e8f0",
    glowColor: "rgba(226, 232, 240, 0.4)",
  },
  {
    id: "admin",
    name: "مدیریت",
    href: "/admin",
    icon: Settings,
    color: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.5)",
  },
];

export function GlowMenu({ className }: { className?: string }) {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<PageVisibility>(defaultPageVisibility);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PAGE_VISIBILITY_STORAGE_KEY);
      if (stored) {
        setVisibility(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(PAGE_VISIBILITY_STORAGE_KEY);
        if (stored) setVisibility(JSON.parse(stored));
      } catch {}
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bumim_visibility_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bumim_visibility_updated", handleStorageChange);
    };
  }, []);

  // Filter items based on admin visibility settings
  const navItems = allNavItems.filter((item) => visibility[item.id] !== false);

  const activeIdx = navItems.findIndex((item) => {
    if (item.href === "/" && pathname === "/") return true;
    if (item.href !== "/" && pathname?.startsWith(item.href)) return true;
    return false;
  });

  const currentHoveredOrActive =
    hoveredIdx !== null ? navItems[hoveredIdx] : navItems[activeIdx >= 0 ? activeIdx : 0];

  return (
    <nav
      className={cn(
        "relative flex items-center justify-center select-none z-40 max-w-full",
        className
      )}
      aria-label="منوی اصلی"
    >
      {/* Outer Glow Halo underneath */}
      <AnimatePresence>
        {currentHoveredOrActive && (
          <motion.div
            key={currentHoveredOrActive.href}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.5, scale: 1.15 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute -inset-1 rounded-full blur-2xl pointer-events-none transition-colors duration-500 hidden md:block"
            style={{
              background: `radial-gradient(circle, ${currentHoveredOrActive.glowColor} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Frosted Glass Pill Dock */}
      <div className="relative flex items-center gap-1 p-1.5 rounded-full bg-zinc-950/60 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] max-w-full overflow-x-auto no-scrollbar scroll-smooth">
        {/* Menu Items */}
        <div className="flex items-center gap-0.5">
          {navItems.map((item, idx) => {
            const isActive = activeIdx === idx;
            const isHovered = hoveredIdx === idx;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap",
                  isActive
                    ? "text-white font-black"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {/* Active Sliding Frosted Glow Pill */}
                {isActive && (
                  <motion.div
                    layoutId="glow-menu-active-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.12] border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.15)]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full opacity-35"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${item.color}, transparent 80%)`,
                      }}
                    />
                  </motion.div>
                )}

                {/* Hover Aura */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="glow-menu-hover-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/15"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}

                {/* Content */}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      isActive ? "scale-110" : "",
                      isHovered ? "-translate-y-0.5" : ""
                    )}
                    style={{
                      color: isActive ? item.color : undefined,
                      filter: isActive ? `drop-shadow(0 0 6px ${item.glowColor})` : undefined,
                    }}
                  />
                  <span>{item.name}</span>

                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0 h-3.5 border-white/20 font-mono text-zinc-300 bg-white/5"
                      style={{
                        borderColor: isActive ? `${item.color}66` : undefined,
                        color: isActive ? item.color : undefined,
                      }}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
