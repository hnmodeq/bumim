import { defaultAboutContent, type AboutContent } from "@/lib/data/site";
import type { TeamMember } from "@/lib/types";
import { teamMembers as fallbackTeamMembers } from "@/lib/data/aboutus";

const section = `flex flex-col items-center w-full px-5 pt-10 pb-25`;
const container = `flex flex-col w-full`;
const title = `pb-5 text-[length:var(--font-size-small)] text-[var(--font-color-third)]`;
const aboutParagraph = `px-5 rounded-[var(--rounded-small)] border-[var(--border-main)] backdrop-blur-[var(--blur-small)] bg-[var(--bg-color-primary)] text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const paragraphInside = `p-5 mb-5 leading-5 md:leading-relaxed lg:leading-4 xl:leading-relaxed 2xl:leading-relaxed`;
const grid = `grid grid-cols-2 gap-3 items-start auto-rows-fr w-full md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`;
const card = `flex flex-col rounded-[var(--rounded-small)] border-[var(--border-main)] bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] shadow-[var(--shadow-small)] overflow-hidden`;
const imageWrapper = `w-full overflow-hidden rounded-[var(--rounded-small)] border-[var(--border-main)]`;
const image = `w-full h-50 object-cover object-[50%_20%] md:h-70 lg:h-50 xl:h-70 2xl:h-80 saturate-100 hover:saturate-75 transition-all duration-500`;
const contentCls = `flex flex-col justify-end p-1`;
const memberName = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-third)]`;
const role = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const alignBottom = `flex flex-row justify-between p-5`;
const socialButton = `flex items-center justify-center border-[var(--border-main)] saturate-100 opacity-100 transition-all duration-300 hover:scale-105 hover:opacity-100 hover:saturate-50 rounded-[var(--rounded-big)] text-[length:var(--font-size-xsmall)]`;

export default function About({
  content = defaultAboutContent,
  teamMembers = fallbackTeamMembers,
}: {
  content?: AboutContent;
  teamMembers?: TeamMember[];
}) {
  return (
    <section className={section}>
      <div className={container}>
        <section className={aboutParagraph}>
          <div className={paragraphInside}>
            <h2 className={title}>{content.title}</h2>
            {content.paragraphs.map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-4" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={grid}>
            {teamMembers.map((member) => (
              <article key={member.id} className={card}>
                <div className={imageWrapper}>
                  <img src={member.image} alt={member.name} className={image} />
                </div>

                <div className={alignBottom}>
                  <div className={contentCls}>
                    <h3 className={memberName}>{member.name}</h3>
                    <span className={role}>{member.role}</span>
                  </div>
                  <div dir="ltr">
                    {Object.values(member.socials).map((social, index) => (
                      <a key={index} href={social.link} target="_blank" rel="noreferrer" className={socialButton}>
                        {social.text}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
