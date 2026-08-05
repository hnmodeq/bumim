"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "تعرفه", to: "/pricing" },
  { label: "نمونه کار", to: "/portfolio" },
  { label: "شرایط همکاری", to: "/terms" },
  { label: "سفارش پروژه", to: "/contact" },
  { label: "درباره ما", to: "/about" },
];

const container = `relative flex flex-row items-center`;
const menuButton = `flex flex-col justify-center gap-1 lg:hidden`;
const menuLine = `w-6 h-0.5 rounded-full bg-[var(--font-color-primary)] transition-all duration-300`;
const desktopNav = `hidden flex flex-row w-full items-center gap-10 pl-20 lg:flex lg:items-center`;
const navLinkBase = `text-[length:var(--font-size-small)] text-[var(--font-color-primary)] transition-all duration-200 hover:text-[var(--font-color-third)] hover:-translate-y-0.5`;
const navLinkActive = `text-[var(--font-color-third)]`;
const mobileMenu = `absolute left-0 top-[calc(100%+1rem)] z-50 w-[min(22rem,calc(100vw-2rem))] rounded-[var(--rounded-small)] border border-white/10 bg-gradient-cinematic-solid backdrop-blur-[var(--blur-small)] shadow-[var(--shadow-small)] p-3 flex flex-col gap-1 transition-all duration-300 lg:hidden`;
const mobileOpen = `opacity-100 translate-y-0 pointer-events-auto`;
const mobileClosed = `opacity-0 -translate-y-3 pointer-events-none`;
const mobileLink = `flex items-center justify-between rounded-xl px-4 py-3 text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] transition-all duration-200 hover:bg-white/8`;
const mobileLinkActive = `bg-white/10 text-[var(--font-color-third)]`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav ref={navRef} className={container}>
      <button
        type="button"
        aria-label="باز کردن منو"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={menuButton}
      >
        <span className={menuLine} />
        <span className={menuLine} />
        <span className={menuLine} />
      </button>

      <div className={desktopNav}>
        {links.map((link) => {
          const isActive = pathname === link.to;
          return (
            <Link
              key={link.to}
              href={link.to}
              className={`${navLinkBase} ${isActive ? navLinkActive : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className={`${mobileMenu} ${open ? mobileOpen : mobileClosed}`}>
        {links.map((link) => {
          const isActive = pathname === link.to;
          return (
            <Link
              key={link.to}
              href={link.to}
              onClick={() => setOpen(false)}
              className={`${mobileLink} ${isActive ? mobileLinkActive : ""}`}
            >
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
