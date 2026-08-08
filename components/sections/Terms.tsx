import { defaultTerms, defaultTermsContent, type TermsContent } from "@/lib/data/site";

const container = `w-full px-5 mt-15 md:px-20 lg:px-25 xl:px-30 2xl:px-100`;
const wrapper = `space-y-3`;
const title = `text-[length:var(--font-size-small)] text-[var(--font-color-third)]`;
const description = `text-justify leading-relaxed text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const list = `space-y-1 p-10 md:space-y-5 lg:space-y-1 xl:space-y-5 rounded-[var(--rounded-small)] border-[var(--border-main)] bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] shadow-[var(--shadow-small)] list-disc marker:text-[var(--font-color-third)]`;
const item = `leading-7 text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] text-justify transition-colors duration-200 hover:text-[var(--font-color-secondary)]`;

export default function Terms({
  content = defaultTermsContent,
  terms = defaultTerms,
}: {
  content?: TermsContent;
  terms?: string[];
}) {
  return (
    <main className={container}>
      <div className={wrapper}>
        <h1 className={title}>{content.title}</h1>
        <p className={description}>{content.description}</p>
        <ul className={list}>
          {terms.map((t, i) => (
            <li key={i} className={item}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
