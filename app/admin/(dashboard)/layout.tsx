import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = { title: "پنل مدیریت | بومیم" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
