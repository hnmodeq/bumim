"use client";

import { GlowMenu } from "@/components/ui/glow-menu";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-4 md:p-8 relative overflow-hidden bg-[#060608] selection:bg-primary/20">
      {/* Dynamic Ambient Iridescent Gradient Mesh */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Glow Menu Dock at Top */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-center pt-2 pb-6 z-20">
        <GlowMenu />
      </header>

      {/* Center Message */}
      <section className="w-full max-w-2xl mx-auto my-auto py-12 z-10 text-center space-y-4">
        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/[0.1] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-3">
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight"
            style={{ letterSpacing: "-0.04em" }}
          >
            داره طراحی میشه
          </h1>
          <p className="text-xs md:text-sm text-zinc-400">
            پلتفرم تخصصی ویدیو ادیتورها • بومیم
          </p>
        </div>
      </section>

      {/* Subtle Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-6 text-center text-xs text-zinc-500 z-10">
        <span>بومیم (bumim)</span> • <span className="font-mono text-zinc-400">bumims.ir</span>
      </footer>
    </main>
  );
}
