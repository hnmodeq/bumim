import Contact from "@/components/sections/Contact";
import { getContactContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "سفارش پروژه | بومیم" };

export default async function ContactPage() {
  const content = await getContactContent();
  return <Contact content={content} />;
}
