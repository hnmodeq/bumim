import type { Metadata } from "next";
import { Vazirmatn, Inconsolata } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "700", "900"],
  variable: "--font-vazir",
  display: "swap",
});

const mono = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بومیم",
  description: "بومیم — محاسبه دستمزد تدوین و موشن گرافیک",
  icons: {
    icon: "/bumim-transparent.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${mono.variable}`}>
      <body className="h-[100dvh] h-[100svh] overflow-hidden bg-[#0a0a0a] text-[#ededed] antialiased overscroll-none">
        {children}
      </body>
    </html>
  );
}
