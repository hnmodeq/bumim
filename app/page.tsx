export default function Home() {
  return (
    <main className="w-full h-[100dvh] h-[100svh] flex flex-col items-center justify-center bg-[#0a0a0a] px-6 py-12 select-none">
      <div className="text-center">
        <h1 className="text-[32px] md:text-[40px] font-black tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
          داره طراحی میشه
        </h1>
        <p className="text-[13px] md:text-[14px] text-[#9a9a9a] mt-3 font-medium">
          به زودی با طراحی جدید برمی‌گردیم
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#666]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffdf00] animate-pulse" />
          bumim.ir
        </div>
      </div>
    </main>
  );
}
