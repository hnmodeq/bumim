"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Layers,
  Settings,
  Sparkles,
  Video,
  Home as HomeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  glowColor: string;
  badge?: string;
};

const navItems: NavItem[] = [
  {
    name: "خانه",
    href: "/",
    icon: HomeIcon,
    color: "#fafafa",
    glowColor: "rgba(255, 255, 255, 0.4)",
  },
  {
    name: "پیش‌فاکتور",
    href: "/invoice",
    icon: Calculator,
    color: "#ffdf00",
    glowColor: "rgba(255, 223, 0, 0.5)",
    badge: "اصلی",
  },
  {
    name: "تعرفه‌ها",
    href: "/services",
    icon: Layers,
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.5)",
    badge: "۱۴۰۵",
  },
  {
    name: "مدیریت",
    href: "/admin",
    icon: Settings,
    color: "#11ffba",
    glowColor: "rgba(17, 255, 186, 0.5)",
  },
];

export function GlowMenu({ className }: { className?: string }) {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeIdx = navItems.findIndex((item) => {
    if (item.href === "/" && pathname === "/") return true;
    if (item.href !== "/" && pathname?.startsWith(item.href)) return true;
    return false;
  });

  const currentHoveredOrActive = hoveredIdx !== null ? navItems[hoveredIdx] : navItems[activeIdx >= 0 ? activeIdx : 0];

  return (
    <nav
      className={cn(
        "relative flex items-center justify-center select-none z-40",
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
            animate={{ opacity: 0.45, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute -inset-1 rounded-full blur-xl pointer-events-none transition-colors duration-500"
            style={{
              background: `radial-gradient(circle, ${currentHoveredOrActive.glowColor} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Glass Pill Dock */}
      <div className="relative flex items-center gap-1 p-1.5 rounded-full bg-black/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Brand Icon on start */}
        <Link
          href="/"
          className="flex items-center gap-1.5 ps-2.5 pe-2 py-1 rounded-full text-foreground hover:text-primary transition-colors group"
        >
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(255,223,0,0.3)]">
            <Video className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black tracking-tight hidden sm:inline">بومیم</span>
        </Link>

        <div className="h-4 w-[1px] bg-white/10 mx-0.5" />

        {/* Menu Items */}
        <div className="flex items-center gap-1">
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
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                  isActive
                    ? "text-white font-black"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {/* Active Sliding Glowing Pill */}
                {isActive && (
                  <motion.div
                    layoutId="glow-menu-active-pill"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_16px_rgba(255,255,255,0.1)]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
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
                    className="absolute inset-0 rounded-full bg-white/5 border border-white/10"
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
                      className="hidden sm:inline-flex text-[9px] px-1 py-0 h-4 border-white/20 font-mono text-zinc-300"
                      style={{
                        borderColor: isActive ? `${item.color}55` : undefined,
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
