import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Layers,
  Sparkles,
  ArrowLeft,
  Settings,
  Video,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-4 md:p-8 relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-black shadow-[0_0_20px_rgba(255,223,0,0.15)]">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight flex items-center gap-2">
              بومیم
              <Badge variant="outline" className="text-[10px] py-0 px-2 border-primary/40 text-primary">
                bumims.ir
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">پلتفرم ابزارهای ادیت ویدیو</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs gap-1.5")}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>مدیریت</span>
          </Link>
        </div>
      </header>

      {/* Center hero */}
      <section className="w-full max-w-4xl mx-auto my-auto py-12 z-10">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs font-semibold gap-1.5 bg-secondary/80 border border-border">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              نسخه در حال ارتقا • ۱۴۰۵
            </Badge>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground"
            style={{ letterSpacing: "-0.03em" }}
          >
            داره طراحی میشه
          </h1>

          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            صفحه اصلی بومیم با ظاهری جدید و ابزارهای پیشرفته‌تر در دست ساخت است. از طریق بخش‌های زیر می‌توانید دسترسی داشته باشید:
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Card 1: Invoice */}
          <Card className="relative group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,223,0,0.08)] bg-card/60 backdrop-blur">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
                <Calculator className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-black flex items-center justify-between">
                <span>محاسبه و صدور پیش‌فاکتور</span>
                <Badge className="bg-primary text-primary-foreground font-black text-[10px]">
                  ابزار اصلی
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                محاسبه قیمت بر اساس نوع پروژه، مدت زمان، تعداد ویدیو و ۱۵+ فاکتور فنی (اصلاح رنگ، راف‌کات، صدا، موشن...) با خروجی PDF استاندارد.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Link
                href="/invoice"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full font-bold flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                )}
              >
                <span>ورود به صدور پیش‌فاکتور</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </CardFooter>
          </Card>

          {/* Card 2: Services & Pricelist */}
          <Card className="relative group hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(17,255,186,0.08)] bg-card/60 backdrop-blur">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-black flex items-center justify-between">
                <span>تعرفه‌ها و پکیج‌ها</span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                  نرخ ۱۴۰۵
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                مشاهده جدول مقایسه‌ای تعرفه‌های تدوین ویدیوی کوتاه، تیزر تبلیغاتی، دوره‌های آموزشی و جزئیات هر پکیج.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full font-bold flex items-center justify-center gap-2 group-hover:bg-emerald-500 group-hover:text-black"
                )}
              >
                <span>مشاهده لیست تعرفه‌ها</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Skeleton Preview Teaser */}
        <div className="mt-8 max-w-3xl mx-auto">
          <Card className="bg-card/30 border-dashed border-border/60 p-4">
            <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                پیش‌نمایش بخش‌های در دست ساخت
              </span>
              <span className="text-[11px] font-mono">v2.0 preview</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
              <Separator className="bg-border/40" />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground z-10">
        <div className="flex items-center gap-2">
          <span>قدرت‌گرفته از</span>
          <span className="font-bold text-foreground">بومیم (bumim)</span>
          <span>•</span>
          <span className="font-mono text-[11px]">bumims.ir</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/services" className="hover:text-foreground transition-colors">
            تعرفه‌ها
          </Link>
          <Link href="/invoice" className="hover:text-foreground transition-colors">
            پیش‌فاکتور
          </Link>
          <Link href="/admin" className="hover:text-foreground transition-colors">
            مدیریت
          </Link>
        </div>
      </footer>
    </main>
  );
}
