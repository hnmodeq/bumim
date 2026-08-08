"use client";

import Link from "next/link";
import { defaultLogoContent, type LogoContent } from "@/lib/data/site";
import { Controls } from "@/lib/utils";

const base = `flex items-center gap-2 whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5`;
const responsive = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const image = `h-8 w-auto object-contain`;
const text = `leading-none`;

export default function Logo({ content = defaultLogoContent }: { content?: LogoContent }) {
  return (
    <Link href={content.href} className={Controls(base, responsive)}>
      <img src={content.imageSrc} alt={content.alt} className={image} />
      <p className={text}>{content.text}</p>
    </Link>
  );
}
