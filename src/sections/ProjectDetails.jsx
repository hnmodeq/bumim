import { Link, useParams } from "react-router-dom";
import { categoryMap, projects } from "@/data/projects";

const container = `
mx-auto
px-4
py-10
max-w-6xl

md:

lg:

`;

const content = `
space-y-8
`;

const errorText = `
mb-4
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]

md:

lg:

`;

const backLink = `
inline-flex
items-center
text-[length:var(--font-size-small)]
transition
hover:underline
text-[var(--font-color-primary)]

md:

lg:

`;

const topBar = `
flex
flex-col
gap-4

md:

lg:

`;

const metaRow = `
flex
flex-wrap
items-center
gap-2

md:

lg:

`;

const badge = `
inline-flex
w-fit
px-3
py-1
rounded-[var(--rounded-small)]
text-[length:var(--font-size-small)]
bg-[var(--bg-color-primary)]
text-[var(--font-color-primary)]

md:

lg:

`;

const projectMeta = `
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]

md:

lg:

`;

const title = `
tracking-tight
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]

md:

lg:

`;

const mediaShell = `
overflow-hidden
rounded-[var(--rounded-small)]
border-[var(--border-main)]
bg-[var(--bg-color-primary)]

md:

lg:

`;

const videoFrameLandscape = `
aspect-video
bg-[var(--bg-color-primary)]

md:

lg:

`;

const videoFramePortrait = `
mx-auto
aspect-[9/16]
max-w-md
bg-[var(--bg-color-primary)]

md:

lg:

`;

const videoClass = `
w-full
h-full
object-cover
bg-[var(--bg-color-primary)]

md:

lg:

`;

const imageLandscape = `
w-full
aspect-video
object-cover

md:

lg:

`;

const imagePortrait = `
mx-auto
w-full
max-w-md
aspect-[9/16]
object-cover

md:

lg:

`;

const audioSection = `
flex
flex-col
justify-center
gap-6
min-h-[320px]
p-6
bg-gradient-to-br
from-neutral-50
via-white
to-neutral-100

md:

lg:

`;

const audioBadge = `
inline-flex
w-fit
px-3
py-1
rounded-[var(--rounded-small)]
text-[length:var(--font-size-small)]
bg-[var(--bg-color-primary)]
text-[var(--font-color-primary)]

md:

lg:

`;

const audioIcon = `
inline-flex
items-center
justify-center
w-16
h-16
rounded-[var(--rounded-small)]
text-xl
bg-[var(--bg-color-primary)]
text-[var(--font-color-primary)]

md:

lg:

`;

const description = `
max-w-3xl
leading-8
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]

md:

lg:

`;

const similarSection = `
pt-8
border-t
border-[var(--border-main)]

md:

lg:

`;

const similarTitle = `
mb-4
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]

md:

lg:

`;

const similarGrid = `
grid
gap-4
grid-cols-2

md:

lg:

`;

const similarCard = `
p-4
border-[var(--border-main)]
bg-[var(--bg-color-primary)]
transition
hover:-translate-y-1
hover:shadow-md

md:

lg:

`;

const similarCardTitle = `
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]

md:

lg:

`;

const similarCardText = `
mt-2
leading-6
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]

md:

lg:

`;

const similarLink = `
inline-flex
mt-3
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]
hover:underline

md:

lg:

`;

const ProjectDetails = () => {
    const { slug } = useParams();

    const project = projects.find((item) => item.slug === slug);

    if (!project) {
        return (
            <main className={container}>
                <p className={errorText}>
                    پروژه موردنظر پیدا نشد.
                </p>

                <Link
                    to="/portfolio"
                    className={backLink}
                >
                    بازگشت به نمونه کارها
                </Link>
            </main>
        );
    }

    const similarProjects = projects
        .filter(
            (item) =>
                item.slug !== project.slug &&
                item.category === project.category
        )
        .slice(0, 3);

    const renderProjectMedia = () => {
        const isPortrait = project.orientation === "portrait";

        if (project.type === "video") {
            return (
                <div className={mediaShell}>
                    <div
                        className={
                            isPortrait
                                ? videoFramePortrait
                                : videoFrameLandscape
                        }
                    >
                        <video
                            className={videoClass}
                            src={project.src}
                            poster={project.poster || undefined}
                            controls
                            autoPlay={project.detailAutoplay ?? true}
                            playsInline
                            preload="metadata"
                        />
                    </div>
                </div>
            );
        }

        if (project.type === "image") {
            return (
                <div className={mediaShell}>
                    <img
                        src={project.src}
                        alt={project.title}
                        className={isPortrait ? imagePortrait : imageLandscape}
                    />
                </div>
            );
        }

        if (project.type === "audio") {
            return (
                <div className={mediaShell}>
                    <div className={audioSection}>
                        <div className={audioIcon}>♪</div>

                        <span className={audioBadge}>
                            فایل صوتی / نریشن
                        </span>

                        <audio
                            controls
                            autoPlay={project.detailAutoplay ?? true}
                            className="w-full"
                        >
                            <source src={project.src} />
                            مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
                        </audio>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <main className={`${container} ${content}`}>
            <Link
                to="/portfolio"
                className={backLink}
            >
                بازگشت به لیست نمونه کارها
            </Link>

            <header className={topBar}>
                <div className={metaRow}>
                    <span className={badge}>
                        {categoryMap[project.category] || project.category}
                    </span>

                    <p className={projectMeta}>
                        پروژه شماره {project.id}
                    </p>
                </div>

                <h1 className={title}>
                    {project.title}
                </h1>
            </header>

            {renderProjectMedia()}

            <p className={description}>
                {project.description ||
                    "توضیحات این پروژه به زودی اضافه می‌شود."}
            </p>

            {similarProjects.length > 0 && (
                <section className={similarSection}>
                    <h2 className={similarTitle}>
                        پروژه‌های مشابه
                    </h2>

                    <div className={similarGrid}>
                        {similarProjects.map((item) => (
                            <article
                                key={item.id}
                                className={similarCard}
                            >
                                <span className={badge}>
                                    {categoryMap[item.category] || item.category}
                                </span>

                                <h3 className={similarCardTitle}>
                                    {item.title}
                                </h3>

                                <p className={similarCardText}>
                                    {item.description}
                                </p>

                                <Link
                                    to={`/portfolio/${item.slug}`}
                                    className={similarLink}
                                >
                                    مشاهده پروژه
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

export default ProjectDetails;
