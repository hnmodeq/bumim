"use client";

import { useState, useEffect } from "react";

import { defaultServices, featureNames, type Service } from "../lib/pricing";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [activeId, setActiveId] = useState<string>(defaultServices[0].id);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((j) => {
        const data = Array.isArray(j?.services) && j.services.length ? j.services : defaultServices;
        setServices(data);
        if (!data.find((x: Service) => x.id === activeId)) setActiveId(data[0].id);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = services.find((s) => s.id === activeId) || services[0];

  return (
    <main className="w-full min-h-[100dvh] bg-[#0a0a0a] px-4 md:px-6 py-8 md:py-10">
      <div className="w-full max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] md:text-[36px] font-black tracking-tight" style={{ letterSpacing: "-0.03em" }}>
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] bg-clip-text text-transparent">PRICE LIST</span>
            <span className="text-white mr-2">تعرفه‌ها</span>
          </h1>
          <p className="text-[12px] text-[#9a9a9a] mt-2">برای ۳ ماه دوم ۱۴۰۵ • مدت زمان راش محاسبه می‌شود • یک اصلاحیه رایگان</p>
        </div>

        {/* Service switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`px-4 md:px-5 py-2.5 rounded-full text-[13px] font-black transition-all border ${
                activeId === s.id
                  ? "bg-white text-[#0a0a0a] border-white shadow-[0_4px_16px_rgba(255,255,255,0.15)]"
                  : "bg-[#141414] text-[#9a9a9a] border-[#2a2a2a] hover:text-white hover:border-[#3a3a3a]"
              }`}
            >
              {s.name}
            </button>
          ))}
          <a
            href="/admin"
            className="px-3 py-2 rounded-full text-[11px] font-bold text-[#666] hover:text-[#999] border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a]"
          >
            مدیریت ←
          </a>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-[#141414]/50 border border-[#1f1f1f] rounded-[24px] overflow-hidden backdrop-blur">
          <div className="grid gap-0" style={{ gridTemplateColumns: `280px repeat(${active.packages.length}, 1fr)` }}>
            {/* Header row */}
            <div className="p-6">
              <div className="text-[11px] font-bold text-[#666] tracking-widest">FEATURES</div>
              <div className="text-[10px] text-[#555] mt-1">جزئیات هر پکیج</div>
            </div>
            {active.packages.map((pkg) => (
              <div key={pkg.id} className="p-4 flex flex-col items-center text-center border-r border-[#1f1f1f]/50">
                <div className="text-[11px] font-black tracking-widest text-white">{pkg.name}</div>
                <div className="text-[10px] text-[#666] mt-1">▼</div>
                <div className={`mt-3 w-full rounded-[18px] bg-gradient-to-br ${pkg.color} p-[1.5px]`}>
                  <div className={`rounded-[16px] bg-gradient-to-br ${pkg.color} px-3 py-3 flex items-center justify-center gap-1`}>
                    <span className="text-[11px] font-black text-white/80">$</span>
                    <span className="text-[28px] font-black leading-none text-white">{pkg.price}</span>
                    <span className="text-[9px] font-bold text-white/80 leading-[1]">
                      {pkg.per.split(" ")[0]}
                      <br />
                      {pkg.per.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                </div>
                {pkg.popular && (
                  <span className="mt-2 text-[10px] font-black text-[#ffdf00] tracking-wide">★ پرطرفدار</span>
                )}
              </div>
            ))}

            {/* Feature rows */}
            {featureNames.map((feat, idx) => (
              <div key={feat} className="contents">
                <div className={`px-6 py-4 text-[12px] font-bold border-t border-[#1f1f1f]/50 ${idx % 2 === 0 ? "bg-[#141414]" : "bg-[#0a0a0a]/50"} text-[#ededed]`}>
                  <div className="font-black text-white text-[12px]">{feat}</div>
                  <div className="text-[10px] text-[#666] font-normal mt-0.5">توضیح کوتاه ویژگی</div>
                </div>
                {active.packages.map((pkg) => {
                  const has = pkg.features[idx] && pkg.features[idx] !== "—";
                  return (
                    <div
                      key={pkg.id + feat}
                      className={`flex items-center justify-center border-t border-r border-[#1f1f1f]/50 px-4 py-4 ${
                        idx % 2 === 0 ? "bg-[#141414]" : "bg-[#0a0a0a]/50"
                      }`}
                    >
                      {has ? (
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold bg-gradient-to-br ${pkg.color} text-white`}
                        >
                          ✓
                        </span>
                      ) : (
                        <span className="text-[#444] text-[14px]">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {active.packages.map((pkg) => (
            <div key={pkg.id} className="bg-[#141414] border border-[#2a2a2a] rounded-[20px] overflow-hidden">
              <div className={`bg-gradient-to-br ${pkg.color} p-4 flex items-center justify-between`}>
                <div>
                  <div className="text-[14px] font-black text-white">{pkg.name}</div>
                  <div className="text-[11px] text-white/70">{pkg.per}</div>
                </div>
                <div className="flex items-baseline gap-1 bg-white text-[#0a0a0a] rounded-full px-3.5 py-2">
                  <span className="text-[11px] font-black">$</span>
                  <span className="text-[22px] font-black leading-none">{pkg.price}</span>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[12px]">
                    {f === "—" ? (
                      <>
                        <span className="w-5 h-5 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[#444] text-[10px]">—</span>
                        <span className="text-[#555] line-through">{featureNames[i]}</span>
                      </>
                    ) : (
                      <>
                        <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center text-white text-[10px]`}>✓</span>
                        <span className="text-[#ededed] font-medium">{f}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-[11px] text-[#666]">
          قیمت‌ها برای ۳ ماه دوم ۱۴۰۵ • <span className="text-[#9a9a9a]">یک اصلاحیه رایگان</span> • مدت زمان راش محاسبه می‌شود
        </div>
      </div>
    </main>
  );
}
