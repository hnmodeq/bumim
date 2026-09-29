import type { Metadata } from "next";
import { Vazirmatn, Inconsolata, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

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
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <TooltipProvider delay={150}>
          {children}
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
