"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ParallaxBackground from "@/components/sections/ParallaxBackground";
import type { FooterContent, LogoContent, NavLinkData } from "@/lib/data/site";

const layout = `z-10 flex flex-col min-h-screen relative`;
const content = `flex-1`;
const main = `min-h-[calc(100vh-140px)]`;

export default function AppShell({
  children,
  navLinks,
  footerContent,
  logoContent,
}: {
  children: React.ReactNode;
  navLinks?: NavLinkData[];
  footerContent?: FooterContent;
  logoContent?: LogoContent;
}) {
  return (
    <>
      <ScrollToTop />
      <ParallaxBackground gradientSpeed={0.12} iconsSpeed={0.28} />
      <div className={layout}>
        <Header navLinks={navLinks} logoContent={logoContent} />
        <div className={content}>
          <main className={main}>{children}</main>
        </div>
        <Footer content={footerContent} />
      </div>
    </>
  );
}
