import { teamMembers } from "@/data/aboutus";

const section = `
flex
flex-col
items-center
w-full
px-5
pt-10
pb-25

md:

lg:

xl:

2xl:

`;

const container = `
flex
flex-col
w-full


md:

lg:

xl:

2xl:


`;

const header = `
w-full

md:

lg:

xl:

2xl:

`;

const title = `
pb-5
md:

lg:

xl:

2xl:

text-[length:var(--font-size-small)]
text-[var(--font-color-third)]
`;

const aboutContent = `
w-full

md:

lg:

xl:

2xl:

`;

const aboutParagraph = `
px-5

md:

lg:

xl:

2xl:

rounded-[var(--rounded-small)]
border-[var(--border-main)]
backdrop-blur-[var(--blur-small)]
bg-[var(--bg-color-primary)]
text-[length:var(--font-size-xsmall)]
text-[var(--font-color-primary)]
`;

const paragraphInside = `
p-5
mb-5
leading-5

md:leading-relaxed

lg:leading-4

xl:leading-relaxed

2xl:leading-relaxed



`;

const grid = `
grid
grid-cols-2
gap-3
items-start
auto-rows-fr
w-full

md:grid-cols-3

lg:grid-cols-4

xl:grid-cols-5

2xl:grid-cols-6


`;

const card = `
flex
flex-col

md:

lg:

xl:

2xl:

rounded-[var(--rounded-small)]
border-[var(--border-main)]
bg-[var(--bg-color-primary)]
backdrop-blur-[var(--blur-small)]
shadow-[var(--shadow-small)]
overflow-hidden
`;

const imageWrapper = `
w-full

md:

lg:

xl:

2xl:


overflow-hidden
rounded-[var(--rounded-small)]
border-[var(--border-main)]
`;

const image = `
w-full
h-50
object-cover
object-[50%_20%]

md:h-70

lg:h-50

xl:h-70

2xl:h-80

saturate-100
hover:saturate-75
transition-all
duration-500
`;

const content = `
flex
flex-col
justify-right
p-1

md:

lg:

xl:

2xl:



`;

const memberName = `

md:

lg:

xl:

2xl:



text-[length:var(--font-size-xsmall)]
text-[var(--font-color-third)]

`;

const role = `

md:

lg:

xl:

2xl:

text-[length:var(--font-size-xsmall)]
text-[var(--font-color-primary)]

`;

const socialRow = `
flex
flex-col
items-center
justify-center


md:

lg:

xl:

2xl:




`;

const alignBottom = `
flex
flex-row
justify-between
p-5

md:

lg:

xl:

2xl:


`;

const socialButton = `
flex
items-center
justify-center

md:

lg:

xl:

2xl:

border-[var(--border-main)]
saturate-100
opacity-100
transition-all
duration-300
hover:scale-105
hover:opacity-100
hover:saturate-50
rounded-[var(--rounded-big)]
text-[length:var(--font-size-xsmall)]

`;

const About = () => {
    return (
        <section className={section}>
            <div className={container}>
                <div className={header}></div>

                <div className={aboutContent}>
                    <section className={aboutParagraph}>
                        <div className={paragraphInside}>
                            <h2 className={title}>درباره ما</h2>
                            <p>
                                تیم بومیم از سال ۱۴۰۴ فعالیت خود را در زمینه تولید محتوای دیجیتال برای شبکه‌های اجتماعی آغاز کرد.
                            </p>
                            <br />
                            <p>
                                این تیم حاصل همکاری افرادی است که در کنار یکدیگر تلاش می‌کنند نتایجی خلاقانه و قابل توجه خلق کنند.
                            </p>
                            <br />
                            <p>
                                نگاه ما به محتوا همواره جدی و دقیق بوده است؛ تلاشی برای ساخت آثاری که پیش از شکل‌گیری ایده و اجرای ما وجود نداشته‌اند.
                            </p>
                            <br />
                            <p>
                                ما در هر پروژه تلاش می‌کنیم بهترین کیفیت و معنا را در کنار هم ارائه دهیم، با این امید که سهمی در بیشتر دیده شدن و رشد کسب‌وکار شما داشته باشیم.
                            </p>
                        </div>

                        <div className={grid}>
                            {teamMembers.map((member) => (
                                <article key={member.id} className={card}>
                                    <div className={imageWrapper}>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className={image}
                                        />
                                    </div>

                                    <div className={alignBottom}>
                                        <div className={content}>
                                            <h3 className={memberName}>{member.name}</h3>
                                            <span className={role}>{member.role}</span>
                                        </div>

                                        <div className={socialRow} dir="ltr">
                                            {Object.values(member.socials).map((social, index) => (
                                                <a
                                                    key={index}
                                                    href={social.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={socialButton}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default About;
