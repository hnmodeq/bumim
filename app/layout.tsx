import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { getFooterContent, getLogoContent, getNavLinks, getSeoContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoContent();
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navLinks, footerContent, logoContent] = await Promise.all([
    getNavLinks(),
    getFooterContent(),
    getLogoContent(),
  ]);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppShell navLinks={navLinks} footerContent={footerContent} logoContent={logoContent}>{children}</AppShell>
      </body>
    </html>
  );
}
