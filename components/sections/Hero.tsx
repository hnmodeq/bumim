const section = `flex flex-col w-full pt-10 pb-15 justify-center items-center`;
const description = `text-[length:var(--font-size-small)] text-[var(--font-color-third)]`;
const title = `leading-20 font-black text-[8rem] text-[var(--font-color-hero)] hero-glow text-cinematic-blur`;

export default function Hero() {
  return (
    <section className={section}>
      <p className={description}>تولید محتوای دیجیتال</p>
      <h1 className={title} data-text="بومیم">
        بومیم
      </h1>
    </section>
  );
}
