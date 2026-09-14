import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Server-side guard: unauthenticated users are redirected to /login.
  await requireUser(locale);

  return <DashboardShell locale={locale}>{children}</DashboardShell>;
}
