"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ParallaxBackground from "@/components/sections/ParallaxBackground";

const layout = `z-10 flex flex-col min-h-screen relative`;
const content = `flex-1`;
const main = `min-h-[calc(100vh-140px)]`;

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <ParallaxBackground gradientSpeed={0.12} iconsSpeed={0.28} />
      <div className={layout}>
        <Header />
        <div className={content}>
          <main className={main}>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
