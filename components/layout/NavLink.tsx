"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const link = `whitespace-nowrap transition-colors text-[length:var(--font-size-small)] text-[var(--font-color-primary)] hover:text-black`;

export default function NavLink({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={to} className={className ?? link} onClick={onClick}>
      {children}
    </Link>
  );
}

export function useIsActive(to: string) {
  const pathname = usePathname();
  return pathname === to;
}
