"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { defaultContactContent, type ContactContent } from "@/lib/data/site";

const container = `w-full flex flex-col gap-5 items-center justify-center px-5 mt-10 lg:flex-row lg:items-start`;
const button = `w-25 h-10 justify-center bg-[var(--bg-color-primary)] rounded-[var(--rounded-small)] border-[var(--border-main)] backdrop-blur-[var(--blur-small)] text-[length:var(--font-size-xsmall)] text-[var(--font-color-third)] transition-all duration-200 hover:-translate-y-1`;
const checkAndSend = `flex flex-row justify-around items-center`;
const form = `flex flex-col w-full gap-2 md:w-150 md:gap-3 xl:gap-4`;
const input = `w-full py-5 px-5 rounded-[var(--rounded-small)] text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] outline-none transition focus:ring-2 focus:ring-yellow-400 backdrop-blur-[var(--blur-small)] resize-none bg-[var(--bg-color-primary)]`;
const headerWrapper = `text-center w-full h-auto px-5 py-5 md:w-150 bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] rounded-[var(--rounded-small)] shadow-[var(--shadow-small)] border-[var(--border-main)]`;
const h1 = `text-right text-[length:var(--font-size-small)] text-[var(--font-color-third)] text-shadow-[var(--font-shadow-small)]`;
const paragraph = `text-right text-[length:var(--font-size-xsmall)] leading-relaxed text-[var(--font-color-primary)]`;
const hidden = `hidden`;
const label = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const errorText = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-third)]`;
const checkbox = `h-5 w-5 accent-yellow-400`;
const termsWrapper = `text-justify rounded-[var(--rounded-small)] text-shadow-[var(--font-shadow-small)]`;
const flexGap = `flex items-start`;
const termsLabel = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] md:text-[length:var(--font-size-small)]`;
const termsLink = `hover:text-[var(--font-color-third)] text-[var(--font-color-secondary)]`;
const buttonWrapper = `px-4 md:px-0`;

interface FormData {
  name: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
}

const emptyForm: FormData = { name: "", phone: "", subject: "", message: "", website: "" };

export default function Contact({ content = defaultContactContent }: { content?: ContactContent }) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string, type: string = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, type, message });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name) newErrors.name = "لطفاً نام خود را وارد کنید.";
    else if (name.length < 2) newErrors.name = "نام باید دست کم ۲ کاراکتر باشد.";

    if (!phone) newErrors.phone = "لطفاً شماره تماس خود را وارد کنید.";
    else if (!/^09\d{9}$/.test(phone)) newErrors.phone = "شماره تماس باید با 09 شروع شود و 11 رقم باشد.";

    if (!subject) newErrors.subject = "لطفاً نوع پروژه را مشخص کنید.";
    else if (subject.length < 3) newErrors.subject = "عنوان باید دست کم ۳ کاراکتر باشد.";

    if (!message) newErrors.message = "لطفاً شرح درخواست را وارد کنید.";
    else if (message.length < 10) newErrors.message = "شرح درخواست باید دست کم ۱۰ کاراکتر باشد.";

    if (!agreedToTerms) newErrors.agreedToTerms = "برای ادامه، باید شرایط همکاری را بپذیرید.";

    return newErrors;
  };

  const buildBaleMessage = () => {
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    return `
سلام وقت بخیر
من از طریق سایت بومیم پیام می‌دهم.

نام: ${name}
شماره تماس: ${phone}
عنوان پروژه / درخواست: ${subject}

شرح درخواست:
${message}

تأیید شرایط همکاری:
این کاربر شرایط همکاری را مطالعه کرده و با آن موافقت کرده است.
    `.trim();
  };

  const fallbackCopyText = async (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let copied: boolean;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    document.body.removeChild(textarea);
    return copied;
  };

  const copyMessage = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return await fallbackCopyText(text);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setAgreedToTerms(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website.trim() !== "") {
      showToast("ارسال نامعتبر شناسایی شد.", "error");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("لطفاً فرم را تکمیل کنید.", "error");
      return;
    }

    const text = buildBaleMessage();
    let saved = false;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });
      saved = res.ok;
    } catch {
      saved = false;
    }

    try {
      const copied = await copyMessage(text);
      window.open(content.baleUrl, "_blank", "noopener,noreferrer");
      showToast(saved ? content.savedMessage : content.errorMessage, copied ? "success" : "info");
    } catch {
      window.open(content.baleUrl, "_blank", "noopener,noreferrer");
      showToast(saved ? content.savedMessage : content.errorMessage, saved ? "info" : "error");
    }

    resetForm();
  };

  return (
    <div className={container}>
      <div className={headerWrapper}>
        <h1 className={h1}>{content.title}</h1>
        <p className={paragraph}>{content.description}</p>
      </div>

      <form onSubmit={handleSubmit} className={form} noValidate>
        <div className={hidden} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="name" className={label} />
          <input id="name" name="name" type="text" className={input} placeholder="نام و نام خانوادگی" value={formData.name} onChange={handleChange} autoComplete="off" />
          {errors.name && <p className={errorText}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className={label} />
          <input id="phone" name="phone" type="tel" inputMode="numeric" className={input} placeholder="شماره تماس" value={formData.phone} onChange={handleChange} autoComplete="off" dir="rtl" />
          {errors.phone && <p className={errorText}>{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="subject" className={label} />
          <input id="subject" name="subject" type="text" className={input} placeholder="نوع پروژه" value={formData.subject} onChange={handleChange} autoComplete="off" />
          {errors.subject && <p className={errorText}>{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className={label} />
          <textarea id="message" name="message" rows={6} className={input} placeholder="شرح جزئیات و توضیحات تکمیلی پروژه" value={formData.message} onChange={handleChange} autoComplete="off" />
          {errors.message && <p className={errorText}>{errors.message}</p>}
        </div>

        <section className={checkAndSend}>
          <div className={termsWrapper}>
            <div className={flexGap}>
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setErrors((prev) => ({ ...prev, agreedToTerms: "" }));
                }}
                className={checkbox}
              />
              <div>
                <label htmlFor="terms" className={termsLabel}>
                  با <Link href="/terms" className={termsLink}>شرایط همکاری</Link> موافقم.
                </label>
              </div>
            </div>
            {errors.agreedToTerms && <p className={errorText}>{errors.agreedToTerms}</p>}
          </div>

          <div className={buttonWrapper}>
            <button type="submit" disabled={!agreedToTerms} className={button}>
              {content.submitLabel}
            </button>
          </div>
        </section>
      </form>

      {toast.show && (
        <div className="fixed bottom-6 right-1/2 z-[1000] translate-x-1/2 rounded-[var(--rounded-small)] border border-white/10 bg-[var(--bg-color-solid)] px-5 py-3 text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] shadow-[var(--shadow-big)]">
          {toast.message}
        </div>
      )}
    </div>
  );
}
