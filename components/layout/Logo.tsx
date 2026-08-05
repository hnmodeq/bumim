"use client";

import Link from "next/link";
import { Controls } from "@/lib/utils";

const base = `flex items-center gap-2 whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5`;
const responsive = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const image = `h-8 w-auto object-contain`;
const text = `leading-none`;

export default function Logo() {
  return (
    <Link href="/" className={Controls(base, responsive)}>
      <img src="/logo.png" alt="بومیم" className={image} />
      <p className={text}>بومیم هستیم.</p>
    </Link>
  );
}
