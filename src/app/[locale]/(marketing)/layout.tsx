import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <SiteHeader />
      {/* `main` landmark: the auth layout and the dashboard/admin shell both have
          one, and without it screen-reader users get no way to jump past the
          header on any public page. */}
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
