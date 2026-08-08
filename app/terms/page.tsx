import Terms from "@/components/sections/Terms";
import { getTerms, getTermsContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "شرایط همکاری | بومیم" };

export default async function TermsPage() {
  const [content, terms] = await Promise.all([getTermsContent(), getTerms()]);
  return <Terms content={content} terms={terms} />;
}
