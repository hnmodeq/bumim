import { defaultFooterContent, type FooterContent } from "@/lib/data/site";

const footer = `w-full border-t border-white/10 bg-[var(--bg-color-primary)]/85 backdrop-blur-[var(--blur-small)] mt-16`;
const container = `w-full mx-auto px-4 py-5`;
const copy = `text-center text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const link = `text-[var(--font-color-third)] transition-colors duration-200 hover:text-[var(--font-color-secondary)]`;

export default function Footer({ content = defaultFooterContent }: { content?: FooterContent }) {
  return (
    <footer className={footer}>
      <div className={container}>
        <p className={copy}>
          © {new Date().getFullYear()} {content.copyrightPrefix}{" "}
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            {content.label}
          </a>{" "}
          {content.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
}
