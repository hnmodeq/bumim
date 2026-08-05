import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "بومیم - تولید محتوای دیجیتال",
  description:
    "تیم بومیم؛ تولید محتوای دیجیتال، ادیت ویدیو، موشن گرافیک، گرافیک و نریشن برای شبکه‌های اجتماعی.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
