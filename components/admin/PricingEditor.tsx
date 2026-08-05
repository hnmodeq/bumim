"use client";

import { useState } from "react";
import { services, formatToman } from "@/lib/data/services";
import type { PricingData } from "@/lib/types";

export default function PricingEditor({ initial }: { initial: PricingData }) {
  const [basePrice, setBasePrice] = useState(initial.basePrice);
  const [multipliers, setMultipliers] = useState<Record<string, number>>(
    initial.multipliers
  );
  const [status, setStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const setMultiplier = (planId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setMultipliers((prev) => ({ ...prev, [planId]: isNaN(num) ? 0 : num }));
  };

  const priceOf = (planId: string) => formatToman(basePrice * (multipliers[planId] || 0));

  const save = async () => {
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basePrice, multipliers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "خطا در ذخیره‌سازی");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message || "خطا در ذخیره‌سازی");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">مدیریت تعرفه‌ها</h1>
          <p className="mt-1 text-sm text-[var(--font-color-primary)]">
            مبلغ پایه و ضریب هر پلن را تغییر دهید. قیمت هر پلن = مبلغ پایه × ضریب.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-[var(--rounded-small)] bg-[var(--font-color-third)] px-6 py-3 font-bold text-black transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "saving" ? "در حال ذخیره..." : "ذخیره تعرفه‌ها"}
        </button>
      </div>

      {status === "success" && (
        <p className="rounded-[var(--rounded-small)] border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          تعرفه‌ها با موفقیت ذخیره شد. ✔
        </p>
      )}
      {status === "error" && (
        <p className="rounded-[var(--rounded-small)] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      <div className="rounded-[var(--rounded-small)] border border-white/10 bg-white/5 p-5">
        <label className="mb-2 block text-sm text-[var(--font-color-primary)]">مبلغ پایه (تومان)</label>
        <input
          type="number"
          min={0}
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
          className="w-64 rounded-[var(--rounded-xsmall)] border border-white/15 bg-black/40 px-4 py-2 text-white outline-none focus:border-[var(--font-color-third)]"
        />
      </div>

      {services.map((service) => (
        <section key={service.id} className="rounded-[var(--rounded-small)] border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 font-bold text-white">{service.label}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {service.plans.map((plan) => (
              <div key={plan.id} className="rounded-[var(--rounded-xsmall)] border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{plan.name}</span>
                  <span className="text-sm text-[var(--font-color-secondary)]">{priceOf(plan.id)} تومان</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm text-[var(--font-color-primary)]">ضریب:</label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={multipliers[plan.id] ?? 0}
                    onChange={(e) => setMultiplier(plan.id, e.target.value)}
                    className="w-28 rounded-[var(--rounded-xsmall)] border border-white/15 bg-black/40 px-3 py-1.5 text-white outline-none focus:border-[var(--font-color-third)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
