import { defaultHeroContent, type HeroContent } from "@/lib/data/site";

const section = `flex flex-col w-full pt-10 pb-15 justify-center items-center`;
const description = `text-[length:var(--font-size-small)] text-[var(--font-color-third)]`;
const title = `leading-20 font-black text-[8rem] text-[var(--font-color-hero)] hero-glow text-cinematic-blur`;

export default function Hero({ content = defaultHeroContent }: { content?: HeroContent }) {
  return (
    <section className={section}>
      <p className={description}>{content.kicker}</p>
      <h1 className={title} data-text={content.title}>
        {content.title}
      </h1>
    </section>
  );
}
