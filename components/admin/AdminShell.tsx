"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "تعرفه‌ها (قیمت‌ها)" },
  { href: "/admin/projects", label: "پروژه‌ها / نمونه کارها" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#101010] text-[var(--font-color-primary)]" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1a1a1a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-6">
            <span className="font-bold text-[var(--font-color-third)]">پنل مدیریت بومیم</span>
            <nav className="flex items-center gap-4 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    pathname === item.href
                      ? "border-b-2 border-[var(--font-color-third)] pb-1 text-[var(--font-color-third)]"
                      : "pb-1 text-[var(--font-color-primary)] hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/" className="pb-1 text-[var(--font-color-primary)] hover:text-white">
                مشاهده سایت
              </Link>
            </nav>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-[var(--rounded-small)] border border-white/15 px-4 py-2 text-sm text-[var(--font-color-primary)] transition hover:bg-white/10"
          >
            خروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
