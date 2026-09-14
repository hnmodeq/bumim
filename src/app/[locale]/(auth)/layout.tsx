import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/shared/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="بومیم">
          <Logo />
        </Link>
        <LocaleSwitcher />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
