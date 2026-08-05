"use client";

import { useState } from "react";
import { projectCategories } from "@/lib/data/projects";
import type { Project } from "@/lib/types";

const emptyForm = {
  slug: "",
  title: "",
  category: "short-video-edit",
  type: "video",
  src: "",
  poster: "",
  orientation: "portrait",
  hasDescription: false,
  description: "",
  detailAutoplay: false,
  planId: "",
  planLabel: "",
  sortOrder: 0,
};

type FormState = typeof emptyForm;

const fieldCls = `w-full rounded-[var(--rounded-xsmall)] border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[var(--font-color-third)]`;
const labelCls = `mb-1 block text-xs text-[var(--font-color-primary)]`;

export default function ProjectsManager({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const set = (key: keyof FormState, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      category: p.category,
      type: p.type,
      src: p.src,
      poster: p.poster,
      orientation: p.orientation,
      hasDescription: p.hasDescription,
      description: p.description,
      detailAutoplay: p.detailAutoplay,
      planId: p.planId,
      planLabel: p.planLabel,
      sortOrder: p.sortOrder ?? 0,
    });
  };

  const startNew = () => {
    setEditingId("new");
    setForm(emptyForm);
  };

  const cancel = () => {
    setEditingId(null);
    setMsg(null);
  };

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/projects" : `/api/projects/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "خطا");
      if (isNew) setProjects((prev) => [...prev, data]);
      else setProjects((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      setEditingId(null);
      setMsg({ type: "ok", text: "پروژه ذخیره شد. ✔" });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "خطا در ذخیره" });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("حذف این پروژه؟")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
    else alert("خطا در حذف");
  };

  const upload = async (file: File, target: "src" | "poster") => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "projects");
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "آپلود ناموفق");
      set(target, data.url);
      setMsg({ type: "ok", text: "فایل آپلود شد." });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "خطا در آپلود" });
    } finally {
      setBusy(false);
    }
  };

  const renderUpload = (target: "src" | "poster") => (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--rounded-xsmall)] border border-white/15 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10">
      آپلود
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f, target);
        }}
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">مدیریت پروژه‌ها / نمونه کارها</h1>
          <p className="mt-1 text-sm text-[var(--font-color-primary)]">
            می‌توانید فایل‌ها را به سرویس‌دهنده (Supabase) آپلود کنید و URL آن را روی پروژه بگذارید.
          </p>
        </div>
        {editingId === null && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-[var(--rounded-small)] bg-[var(--font-color-third)] px-5 py-2.5 font-bold text-black hover:brightness-110"
          >
            + پروژه جدید
          </button>
        )}
      </div>

      {msg && (
        <p
          className={`rounded-[var(--rounded-small)] border px-4 py-3 text-sm ${
            msg.type === "ok"
              ? "border-green-500/40 bg-green-500/10 text-green-300"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {msg.text}
        </p>
      )}

      {editingId !== null && (
        <div className="rounded-[var(--rounded-small)] border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 font-bold text-white">
            {editingId === "new" ? "پروژه جدید" : `ویرایش: ${form.title}`}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls}>Slug (شناسه آدرس)</label>
              <input className={fieldCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>عنوان</label>
              <input className={fieldCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>ترتیب</label>
              <input type="number" className={fieldCls} value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
            </div>

            <div>
              <label className={labelCls}>دسته‌بندی</label>
              <select className={fieldCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {projectCategories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>نوع</label>
              <select className={fieldCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="video">ویدیو</option>
                <option value="image">تصویر</option>
                <option value="audio">صوت</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>جهت</label>
              <select className={fieldCls} value={form.orientation} onChange={(e) => set("orientation", e.target.value)}>
                <option value="portrait">عمودی (Portrait)</option>
                <option value="landscape">افقی (Landscape)</option>
                <option value="square">مربع</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>آدرس فایل (src)</label>
              <div className="flex gap-2">
                <input className={fieldCls} value={form.src} onChange={(e) => set("src", e.target.value)} />
                {renderUpload("src")}
              </div>
            </div>
            <div>
              <label className={labelCls}>پستر (poster)</label>
              <div className="flex gap-2">
                <input className={fieldCls} value={form.poster} onChange={(e) => set("poster", e.target.value)} />
                {renderUpload("poster")}
              </div>
            </div>

            <div>
              <label className={labelCls}>پلن (planId)</label>
              <input className={fieldCls} value={form.planId} onChange={(e) => set("planId", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>برچسب پلن</label>
              <input className={fieldCls} value={form.planLabel} onChange={(e) => set("planLabel", e.target.value)} />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={form.hasDescription} onChange={(e) => set("hasDescription", e.target.checked)} />
                توضیح دارد
              </label>
              <label className="flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={form.detailAutoplay} onChange={(e) => set("detailAutoplay", e.target.checked)} />
                پخش خودکار
              </label>
            </div>

            <div className="md:col-span-3">
              <label className={labelCls}>توضیحات</label>
              <textarea className={fieldCls} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="rounded-[var(--rounded-small)] bg-[var(--font-color-third)] px-6 py-2.5 font-bold text-black hover:brightness-110 disabled:opacity-50"
            >
              {busy ? "در حال ذخیره..." : "ذخیره"}
            </button>
            <button type="button" onClick={cancel} className="rounded-[var(--rounded-small)] border border-white/15 px-6 py-2.5 text-white hover:bg-white/10">
              انصراف
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-[var(--rounded-small)] border border-white/10 bg-white/5">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-white/10 text-[var(--font-color-primary)]">
            <tr>
              <th className="px-4 py-3">عنوان</th>
              <th className="px-4 py-3">دسته</th>
              <th className="px-4 py-3">نوع</th>
              <th className="px-4 py-3">آدرس</th>
              <th className="px-4 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white">{p.title}</td>
                <td className="px-4 py-3">{projectCategories.find((c) => c.key === p.category)?.label ?? p.category}</td>
                <td className="px-4 py-3">{p.type}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-[var(--font-color-primary)]" dir="ltr">
                  {p.src}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(p)} className="rounded-[var(--rounded-xsmall)] border border-white/15 px-3 py-1 text-xs text-white hover:bg-white/10">
                      ویرایش
                    </button>
                    <button type="button" onClick={() => remove(p.id)} className="rounded-[var(--rounded-xsmall)] border border-red-500/40 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10">
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--font-color-primary)]">
                  پروژه‌ای ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
