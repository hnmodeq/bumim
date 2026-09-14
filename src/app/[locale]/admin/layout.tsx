import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Server-side guard: unauthenticated → /login; non-admin → /dashboard.
  await requireAdmin(locale);

  return <AdminShell locale={locale}>{children}</AdminShell>;
}
