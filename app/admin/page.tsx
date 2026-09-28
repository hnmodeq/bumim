"use client";

import { useState, useEffect } from "react";

import { defaultServices, colorOptions, type Package, type Service } from "../lib/pricing";

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>("");
  const [newServiceName, setNewServiceName] = useState("");
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((j) => (Array.isArray(j?.services) && j.services.length ? j.services : defaultServices))
      .catch(() => defaultServices)
      .then((data: Service[]) => {
        setServices(data);
        setActiveServiceId(data[0]?.id || "");
      });
  }, []);

  const [status, setStatus] = useState<string>("");

  const save = (next: Service[], allowRetry = true) => {
    setServices(next);
    setStatus("در حال ذخیره…");
    const key = typeof window !== "undefined" ? localStorage.getItem("bumim-admin-key") || "" : "";
    fetch("/api/services", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ services: next }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({} as Record<string, string>));
        if (r.status === 401 && allowRetry) {
          const entered = window.prompt("رمز ادمین را وارد کنید:");
          if (entered) {
            localStorage.setItem("bumim-admin-key", entered.trim());
            save(next, false);
          } else {
            setStatus("رمز وارد نشد — ذخیره نشد");
          }
          return;
        }
        if (j?.ok) setStatus("✓ در دیتابیس ذخیره شد");
        else setStatus(`خطا: ${j?.error || r.status}`);
      })
      .catch(() => setStatus("خطای شبکه — ذخیره نشد"));
  };

  const addService = () => {
    if (!newServiceName.trim()) return;
    const svc: Service = { id: Date.now().toString(), name: newServiceName.trim(), packages: [] };
    const next = [...services, svc];
    save(next);
    setActiveServiceId(svc.id);
    setNewServiceName("");
  };

  const deleteService = (id: string) => {
    if (!confirm("حذف سرویس؟")) return;
    const next = services.filter((s) => s.id !== id);
    save(next);
    if (activeServiceId === id) setActiveServiceId(next[0]?.id || "");
  };

  const updateServiceName = (id: string, name: string) => {
    const next = services.map((s) => (s.id === id ? { ...s, name } : s));
    save(next);
  };

  const addOrUpdatePackage = (pkg: Package) => {
    const next = services.map((s) => {
      if (s.id !== activeServiceId) return s;
      const exists = s.packages.find((p) => p.id === pkg.id);
      if (exists) {
        return { ...s, packages: s.packages.map((p) => (p.id === pkg.id ? pkg : p)) };
      }
      return { ...s, packages: [...s.packages, pkg] };
    });
    save(next);
    setEditingPackage(null);
    setIsAddingPackage(false);
  };

  const deletePackage = (pkgId: string) => {
    if (!confirm("حذف پکیج؟")) return;
    const next = services.map((s) => (s.id === activeServiceId ? { ...s, packages: s.packages.filter((p) => p.id !== pkgId) } : s));
    save(next);
  };

  const reset = () => {
    if (!confirm("بازگشت به تعرفه‌های پیش‌فرض و ذخیره در دیتابیس؟")) return;
    save(defaultServices);
    setActiveServiceId(defaultServices[0].id);
  };

  const active = services.find((s) => s.id === activeServiceId);

  return (
    <main className="w-full min-h-[100dvh] bg-[#0a0a0a] px-4 md:px-6 py-6">
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-black text-white">پنل مدیریت تعرفه‌ها</h1>
            <p className="text-[11px] text-[#666] mt-1">سرویس‌ها → پکیج‌ها → قیمت و جزئیات • ذخیره مستقیم در دیتابیس (Supabase)</p>
          </div>
          <div className="flex gap-2">
            <a href="/services" className="px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[12px] font-bold text-[#9a9a9a] hover:text-white">
              مشاهده /services →
            </a>
            {status ? (
              <span className={`px-3 py-2 rounded-xl text-[11px] font-bold border ${String(status).startsWith("✓") ? "bg-[#0d2818] border-[#14532d] text-[#4ade80]" : "bg-[#2a1212] border-[#5c1f1f] text-[#ff8b8b]"}`}>{status}</span>
            ) : null}
            <button onClick={reset} className="px-3 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[11px] font-bold text-[#666] hover:text-[#ff5555]">
              ریست
            </button>
          </div>
        </div>

        {/* Services */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 mb-4">
          <div className="text-[12px] font-black text-white mb-3">سرویس‌ها ({services.length})</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {services.map((s) => (
              <div key={s.id} className={`flex items-center gap-2 px-3 py-2 rounded-full border text-[12px] font-bold ${activeServiceId === s.id ? "bg-white text-[#0a0a0a] border-white" : "bg-[#0a0a0a] text-[#9a9a9a] border-[#2a2a2a]"}`}>
                <button onClick={() => setActiveServiceId(s.id)}>{s.name}</button>
                <button onClick={() => deleteService(s.id)} className="w-5 h-5 rounded-full bg-black/10 hover:bg-[#ff5555] hover:text-white flex items-center justify-center text-[10px]">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} placeholder="نام سرویس جدید (مثلاً: ادیت پادکست)" className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#ffdf00]/50" />
            <button onClick={addService} className="px-5 py-2.5 rounded-xl bg-[#ffdf00] text-[#0a0a0a] text-[12px] font-black">افزودن سرویس</button>
          </div>
          {active && (
            <div className="mt-3 flex gap-2">
              <input value={active.name} onChange={(e) => updateServiceName(active.id, e.target.value)} className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#ffdf00]/30" />
              <span className="text-[11px] text-[#666] self-center">ویرایش نام سرویس فعال</span>
            </div>
          )}
        </div>

        {/* Packages */}
        {active && (
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[12px] font-black text-white">پکیج‌های «{active.name}» ({active.packages.length})</div>
              <button onClick={() => { setEditingPackage({ id: Date.now().toString(), name: "", price: "", per: "میلیون / دقیقه", features: ["", "", "", "", ""], color: colorOptions[0] }); setIsAddingPackage(true); }} className="px-3 py-1.5 rounded-full bg-white text-[#0a0a0a] text-[11px] font-black">+ افزودن پکیج</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {active.packages.map((pkg) => (
                <div key={pkg.id} className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-4">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${pkg.color} mb-3`} />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[13px] font-black text-white">{pkg.name}</div>
                      <div className="text-[11px] text-[#666]">{pkg.per}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-[18px] font-black text-[#ffdf00]">{pkg.price}</div>
                      {pkg.popular && <span className="text-[10px] font-black text-[#ffdf00]">★ محبوب</span>}
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="text-[11px] flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${f === "—" ? "bg-[#1f1f1f] text-[#444]" : "bg-[#ffdf00] text-[#0a0a0a]"}`}>{f === "—" ? "—" : "✓"}</span>
                        <span className={f === "—" ? "text-[#555] line-through" : "text-[#ccc]"}>{f || "—"}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setEditingPackage(pkg); setIsAddingPackage(true); }} className="flex-1 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[11px] font-bold text-[#9a9a9a] hover:text-white">ویرایش</button>
                    <button onClick={() => deletePackage(pkg.id)} className="px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[11px] font-bold text-[#ff5555] hover:bg-[#ff5555] hover:text-white">حذف</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit modal */}
            {isAddingPackage && editingPackage && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-[560px] bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
                  <div className="text-[14px] font-black text-white mb-4">{services.find((s) => s.packages.find((p) => p.id === editingPackage.id)) ? "ویرایش پکیج" : "افزودن پکیج"}</div>
                  <div className="space-y-3">
                    <input value={editingPackage.name} onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })} placeholder="نام پکیج (اقتصادی، پیشرفته...)" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#ffdf00]/50" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={editingPackage.price} onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })} placeholder="قیمت (۱.۴، ۴.۴...)" className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#ffdf00]/50" />
                      <input value={editingPackage.per} onChange={(e) => setEditingPackage({ ...editingPackage, per: e.target.value })} placeholder="واحد (میلیون / دقیقه)" className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#ffdf00]/50" />
                    </div>
                    <label className="flex items-center gap-2 text-[12px] text-[#9a9a9a]">
                      <input type="checkbox" checked={!!editingPackage.popular} onChange={(e) => setEditingPackage({ ...editingPackage, popular: e.target.checked })} />
                      پرطرفدار
                    </label>
                    <div className="text-[11px] font-bold text-[#666]">رنگ گرادینت</div>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((c) => (
                        <button key={c} onClick={() => setEditingPackage({ ...editingPackage, color: c })} className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 ${editingPackage.color === c ? "border-white" : "border-transparent"}`} />
                      ))}
                    </div>
                    <div className="text-[11px] font-bold text-[#666]">جزئیات (۵ مورد) — برای نداشتن بنویس —</div>
                    {editingPackage.features.map((f, i) => (
                      <input key={i} value={f} onChange={(e) => { const next = [...editingPackage.features]; next[i] = e.target.value; setEditingPackage({ ...editingPackage, features: next }); }} placeholder={`ویژگی ${i + 1} (— برای نداشتن)`} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#ffdf00]/30" />
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => addOrUpdatePackage(editingPackage)} className="flex-1 py-2.5 rounded-xl bg-[#ffdf00] text-[#0a0a0a] text-[13px] font-black">ذخیره</button>
                      <button onClick={() => { setIsAddingPackage(false); setEditingPackage(null); }} className="px-5 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[13px] font-bold text-[#9a9a9a]">انصراف</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-center text-[10px] text-[#555]">ذخیره خودکار در حافظه مرورگر • برای انتشار دائمی، کد را به توسعه‌دهنده بده</div>
      </div>
    </main>
  );
}
