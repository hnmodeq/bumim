import type { Metadata } from "next";
import { Vazirmatn, Inconsolata, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { GlowMenu } from "@/components/ui/glow-menu";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
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
  title: "بومیم | bumim — پلتفرم تدوینگران ویدیو",
  description: "محاسبه دقیق دستمزد تدوین، صدور پیش‌فاکتور حرفه‌ای و مشاهده تعرفه‌های رسمی",
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
    <html
      lang="fa"
      dir="rtl"
      className={cn(
        "dark",
        vazir.variable,
        mono.variable,
        geist.variable,
        "font-sans"
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#060608] text-foreground antialiased selection:bg-primary selection:text-primary-foreground relative overflow-x-hidden">
        {/* Universal Persistent Background Ambient Gradient Mesh */}
        <div className="fixed -top-40 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/15 via-yellow-500/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0 transform-gpu" />
        <div className="fixed top-1/3 -left-40 w-[550px] h-[550px] bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0 transform-gpu" />
        <div className="fixed -bottom-40 right-1/3 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-[150px] pointer-events-none z-0 transform-gpu" />

        <TooltipProvider delay={150}>
          {/* Universal Persistent Header Navigation Dock */}
          <header className="sticky top-3 md:top-4 w-full max-w-5xl mx-auto flex items-center justify-center px-4 z-50 pb-2 transform-gpu">
            <GlowMenu />
          </header>

          {/* Page Content Container */}
          <main className="relative z-10 w-full min-h-[calc(100vh-80px)] flex flex-col">
            {children}
          </main>

          <Toaster
            position="bottom-center"
            richColors
            closeButton
            theme="dark"
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
