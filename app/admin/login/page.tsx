"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn("credentials", { password, redirect: false });
    setBusy(false);
    if (res?.error) {
      setError("رمز عبور اشتباه است.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  const hasGoogle = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === "true";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101010] px-5">
      <div className="w-full max-w-sm rounded-[var(--rounded-small)] border border-white/10 bg-white/5 p-8">
        <h1 className="mb-6 text-center text-xl font-bold text-white">ورود به پنل مدیریت</h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور مدیر"
            autoFocus
            className="w-full rounded-[var(--rounded-xsmall)] border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-[var(--font-color-third)]"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-[var(--rounded-small)] bg-[var(--font-color-third)] py-3 font-bold text-black hover:brightness-110 disabled:opacity-50"
          >
            {busy ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        {hasGoogle && (
          <>
            <div className="my-4 text-center text-xs text-[var(--font-color-primary)]">— یا —</div>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="w-full rounded-[var(--rounded-small)] border border-white/15 py-3 text-white hover:bg-white/10"
            >
              ورود با گوگل
            </button>
          </>
        )}
      </div>
    </div>
  );
}
