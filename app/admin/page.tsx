"use client";

import { useState, useEffect } from "react";

type Package = {
  id: string;
  name: string;
  price: string;
  per: string;
  popular?: boolean;
  features: string[];
  color: string;
};

type Service = {
  id: string;
  name: string;
  packages: Package[];
};

const defaultServices: Service[] = [
  {
    id: "short",
    name: "ادیت ویدیوی کوتاه",
    packages: [
      { id: "eco", name: "اقتصادی", price: "۱.۴", per: "میلیون / دقیقه", features: ["کات و تدوین پایه", "اصلاح رنگ اولیه", "میکس صدا ساده", "—", "—"], color: "from-[#7c3aed] to-[#4f46e5]" },
      { id: "pro", name: "پیشرفته", price: "۲.۳", per: "میلیون / دقیقه", popular: true, features: ["کات و تدوین پایه", "اصلاح رنگ حرفه‌ای", "میکس و مسترینگ صدا", "افکت صوتی", "—"], color: "from-[#f97316] to-[#eab308]" },
      { id: "motion", name: "موشن‌دار", price: "۳.۲", per: "میلیون / دقیقه", features: ["کات و تدوین پایه", "اصلاح رنگ حرفه‌ای", "میکس و مسترینگ", "موشن گرافیک سبک", "افکت تصویری"], color: "from-[#06b6d4] to-[#10b981]" },
    ],
  },
  {
    id: "teaser",
    name: "تیزر و موشن",
    packages: [
      { id: "teaser", name: "تیزر تبلیغاتی", price: "۴.۴", per: "تا ۴۵ ثانیه", features: ["سناریو کوتاه", "تدوین ریتمیک", "موزیک و افکت", "اصلاح رنگ", "لوگو موشن"], color: "from-[#ec4899] to-[#f43f5e]" },
      { id: "motion25", name: "موشن ۲.۵ بعدی", price: "۸.۶", per: "/ ۳۰ ثانیه", popular: true, features: ["طراحی وکتور", "انیمیت ۲.۵ بعدی", "موزیک اختصاصی", "صداگذاری", "خروجی 4K"], color: "from-[#8b5cf6] to-[#ec4899]" },
    ],
  },
  {
    id: "course",
    name: "دوره آموزشی",
    packages: [
      { id: "c1", name: "۱ تا ۲ ساعت", price: "۱.۶", per: "میلیون / ساعت", features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "—"], color: "from-[#6366f1] to-[#8b5cf6]" },
      { id: "c2", name: "۳ تا ۵ ساعت", price: "۱.۴", per: "میلیون / ساعت", popular: true, features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "کاور ویدیو"], color: "from-[#f59e0b] to-[#f97316]" },
      { id: "c3", name: "۶ تا ۱۰ ساعت", price: "۱.۲", per: "میلیون / ساعت", features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "کاور + اینترو"], color: "from-[#10b981] to-[#06b6d4]" },
      { id: "c4", name: "بالای ۱۰ ساعت", price: "۱", per: "میلیون / ساعت", features: ["کات و تدوین", "اصلاح رنگ", "میکس صدا", "زیرنویس", "پشتیبانی کامل"], color: "from-[#ef4444] to-[#ec4899]" },
    ],
  },
];

const colorOptions = [
  "from-[#7c3aed] to-[#4f46e5]",
  "from-[#f97316] to-[#eab308]",
  "from-[#06b6d4] to-[#10b981]",
  "from-[#ec4899] to-[#f43f5e]",
  "from-[#8b5cf6] to-[#ec4899]",
  "from-[#6366f1] to-[#8b5cf6]",
  "from-[#f59e0b] to-[#f97316]",
  "from-[#10b981] to-[#06b6d4]",
  "from-[#ef4444] to-[#ec4899]",
];

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>("");
  const [newServiceName, setNewServiceName] = useState("");
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("bumim-services");
    const data = raw ? JSON.parse(raw) : defaultServices;
    setServices(data);
    setActiveServiceId(data[0]?.id || "");
  }, []);

  const save = (next: Service[]) => {
    setServices(next);
    localStorage.setItem("bumim-services", JSON.stringify(next));
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
    if (!confirm("بازگشت به پیش‌فرض؟")) return;
    localStorage.removeItem("bumim-services");
    setServices(defaultServices);
    setActiveServiceId(defaultServices[0].id);
  };

  const active = services.find((s) => s.id === activeServiceId);

  return (
    <main className="w-full min-h-[100dvh] bg-[#0a0a0a] px-4 md:px-6 py-6">
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-black text-white">پنل مدیریت تعرفه‌ها</h1>
            <p className="text-[11px] text-[#666] mt-1">سرویس‌ها → پکیج‌ها → قیمت و جزئیات • ذخیره در مرورگر (localStorage)</p>
          </div>
          <div className="flex gap-2">
            <a href="/services" className="px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[12px] font-bold text-[#9a9a9a] hover:text-white">
              مشاهده /services →
            </a>
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
