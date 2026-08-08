"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projectCategories as fallbackProjectCategories } from "@/lib/data/projects";
import type { Project, ProjectCategory } from "@/lib/types";

const INITIAL_VISIBLE_ROWS = 3;
const LOAD_MORE_ROWS = 3;
const GRID_COLUMNS = 2;

const container = `pt-10 p-5 w-full flex flex-col`;
const header = `flex flex-col p-5`;
const headingWrap = `w-full`;
const title = `mt-5 px-8 text-[length:var(--font-size-small)] text-[var(--font-color-third)]`;
const description = `px-10 pb-5 mt-1 max-w-2xl text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const filters = `gap-2 p-5 w-full grid grid-cols-1 justify-items-stretch md:grid-cols-2 lg:grid-cols-5`;
const filterButton = `p-3 bg-[var(--bg-color-primary)] rounded-[var(--rounded-small)] border-[var(--border-main)] text-[length:var(--font-size-small)] shadow-[var(--shadow-small)] backdrop-blur-[var(--blur-small)] transition hover:-translate-y-1`;
const activeFilter = `border-[var(--border-main)] text-[var(--font-color-third)]`;
const inactiveFilter = `border-[var(--border-main)] text-[var(--font-color-primary)] bg-[var(--bg-color-primary)] hover:bg-[var(--bg-color-primary)]`;
const emptyText = `px-6 py-12 text-center border-[var(--border-main)] text-[length:var(--font-size-small)] text-[var(--font-color-primary)]`;
const grid = `w-full grid grid-cols-2 gap-5 justify-items-stretch sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
const cardBase = `relative group overflow-hidden border-[var(--border-main)] rounded-[var(--rounded-small)] bg-gradient-cinematic backdrop-blur-[var(--blur-small)] shadow-[var(--shadow-small)]`;
const cardWithDescription = `w-full min-h-[320px] flex flex-col`;
const cardWithoutDescriptionLandscape = `w-full col-span-2 aspect-video`;
const cardWithoutDescriptionPortrait = `w-full aspect-[9/16] bg-white`;
const cardLandscape = `w-full h-full`;
const cardPortrait = `flex-row`;
const mediaWrap = `relative shrink-0 overflow-hidden w-full h-full cursor-pointer bg-[var(--bg-color-primary)]`;
const mediaLandscape = `w-full h-full`;
const mediaPortrait = `w-full h-full`;
const mediaOnly = `w-full h-full`;
const videoClass = `w-full h-full object-cover bg-[var(--bg-color-primary)]`;
const imageClass = `w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]`;
const audioWrap = `relative overflow-hidden flex items-center justify-center cursor-pointer bg-[var(--bg-color-primary)]`;
const audioImage = `w-40 h-auto object-contain opacity-80`;
const cardContent = `p-4 w-full h-full flex flex-1 flex-col gap-3`;
const descriptionWrap = `flex flex-1 items-top text-right leading-relaxed`;
const footerWrap = `flex min-h-0 items-end`;
const cardDescription = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)]`;
const link = `inline-flex items-center px-3 py-2 text-[length:var(--font-size-small)] text-[var(--font-color-third)] border-[var(--border-main)] rounded-[var(--rounded-small)] bg-gradient-cinematic transition-all duration-200 hover:-translate-y-1`;
const mediaTop = `absolute bottom-4 right-4 z-20 flex justify-center pointer-events-none`;
const visualOverlay = `absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition group-hover:bg-black/10`;
const overlayIcon = `w-10 h-10 flex items-center justify-center rounded-[var(--rounded-small)] bg-[var(--bg-color-primary)] text-[var(--font-color-primary)] shadow-[var(--shadow-small)]`;
const badgeWrap = `flex flex-col flex-wrap items-start justify-center gap-1`;
const badgePrimary = `inline-flex items-center justify-center px-1 py-0.5 rounded-[var(--rounded-xsmall)] border-[var(--border-main)] bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] shadow-[var(--shadow-big)] whitespace-nowrap`;
const badgeAccent = `inline-flex items-center justify-center px-1 py-0.5 rounded-[var(--rounded-xsmall)] border-[var(--border-main)] backdrop-blur-[var(--blur-small)] bg-[var(--bg-color-primary)] text-[length:var(--font-size-xsmall)] text-[var(--font-color-third)] shadow-[var(--shadow-big)] whitespace-nowrap`;
const modalBackdrop = `p-4 fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-color-primary)]`;
const modalContent = `relative overflow-hidden w-full max-w-5xl rounded-[var(--rounded-small)]`;
const modalMedia = `max-h-[85vh] w-full object-contain bg-[var(--bg-color-primary)]`;
const modalClose = `absolute top-3 left-3 z-20 w-10 h-10 flex items-center justify-center leading-none rounded-[var(--rounded-small)] bg-[var(--bg-color-primary)] text-[length:var(--font-size-small)] text-[var(--font-color-primary)]`;
const modalAudioBody = `py-10 flex flex-row items-center justify-center w-full rounded-[var(--rounded-small)] text-[var(--font-color-primary)]`;
const modalAudioPlayer = `w-full px-10`;
const loadMoreWrap = `mt-6 px-5 flex justify-center w-full`;
const loadMoreButton = `px-5 py-2 mt-5 inline-flex items-center justify-center rounded-[var(--rounded-small)] border-[var(--border-main)] backdrop-blur-[var(--blur-small)] bg-[var(--bg-color-primary)] text-[length:var(--font-size-xsmall)] text-[var(--font-color-third)] transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`;
const loadMoreInfo = `mt-5 px-5 text-center text-[length:var(--font-size-xsmall)] text-[var(--font-color-secondary)]`;

const orientationPriority: Record<string, number> = {
  portrait: 0,
  landscape: 1,
  square: 2,
};

const sortProjectsByPriority = (items: Project[], categoryPriority: Record<string, number>) => {
  return [...items].sort((a, b) => {
    const aCategory = categoryPriority[a.category] ?? 9;
    const bCategory = categoryPriority[b.category] ?? 9;
    if (aCategory !== bCategory) return aCategory - bCategory;
    const aOrientation = orientationPriority[a.orientation] ?? 9;
    const bOrientation = orientationPriority[b.orientation] ?? 9;
    if (aOrientation !== bOrientation) return aOrientation - bOrientation;
    return 0;
  });
};

const getProjectGridUnits = (project: Project) => {
  const hasDescription = Boolean(project.hasDescription);
  const isPortrait = project.orientation === "portrait";
  if (!hasDescription && !isPortrait) return 2;
  return 1;
};

const getVisibleProjectsByRows = (items: Project[], visibleRows: number) => {
  const maxUnits = visibleRows * GRID_COLUMNS;
  let usedUnits = 0;
  const visibleItems: Project[] = [];
  for (const project of items) {
    const projectUnits = getProjectGridUnits(project);
    if (usedUnits + projectUnits > maxUnits) break;
    visibleItems.push(project);
    usedUnits += projectUnits;
  }
  return visibleItems;
};

const playIcon = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10-6.86a1 1 0 0 0 0-1.72l-10-6.86A1 1 0 0 0 8 5.14z" />
  </svg>
);

const zoomIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </svg>
);

const audioIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14 3.23v17.54a1 1 0 0 1-1.64.77L7.7 17H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3.7l4.66-4.54A1 1 0 0 1 14 3.23z" />
    <path d="M17.5 8.5a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 0 1-1.41-1.41 3 3 0 0 0 0-4.25 1 1 0 0 1 0-1.41z" />
  </svg>
);

interface PortfolioProps {
  projects: Project[];
  projectCategories?: ProjectCategory[];
  titleText?: string;
  descriptionText?: string;
  limit?: number;
  showFilters?: boolean;
}

export default function Portfolio({
  projects,
  projectCategories = fallbackProjectCategories,
  titleText = "نمونه کار",
  descriptionText = "برخی از پروژه‌های اخیر در حوزه ادیت، گرافیک، موشن و نریشن.",
  limit,
  showFilters = true,
}: PortfolioProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || (showFilters ? projectCategories[0]?.key || "" : "");

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [modalItem, setModalItem] = useState<Project | null>(null);
  const [visibleRows, setVisibleRows] = useState(INITIAL_VISIBLE_ROWS);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalItem(null);
    };
    document.body.style.overflow = modalItem ? "hidden" : "";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalItem]);

  const categoryPriority = useMemo(
    () => Object.fromEntries(projectCategories.map((category, index) => [category.key, index])),
    [projectCategories]
  );

  const sortedProjects = useMemo(() => {
    const base = activeCategory
      ? projects.filter((project) => project.category === activeCategory)
      : projects;
    const sorted = sortProjectsByPriority(base, categoryPriority);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [activeCategory, categoryPriority, limit, projects]);

  const visibleProjects = useMemo(
    () => getVisibleProjectsByRows(sortedProjects, visibleRows),
    [sortedProjects, visibleRows]
  );

  const hasMoreProjects = visibleProjects.length < sortedProjects.length;
  const remainingProjectsCount = sortedProjects.length - visibleProjects.length;

  const handleLoadMore = () => setVisibleRows((prev) => prev + LOAD_MORE_ROWS);

  const renderOverlayIcon = (type: string) => {
    if (type === "video") return playIcon;
    if (type === "image") return zoomIcon;
    if (type === "audio") return audioIcon;
    return playIcon;
  };

  const renderBadges = (project: Project) => (
    <div className={badgeWrap}>
      {project.title && <span className={badgePrimary}>{project.title}</span>}
      {project.planLabel && <span className={badgeAccent}>{project.planLabel}</span>}
    </div>
  );

  const renderCompactOverlay = (project: Project) => (
    <div className={mediaTop}>{renderBadges(project)}</div>
  );

  const renderMedia = (project: Project, isCompact: boolean) => {
    const isPortrait = project.orientation === "portrait";
    const mediaRatio = isCompact ? mediaOnly : isPortrait ? mediaPortrait : mediaLandscape;

    if (project.type === "video") {
      return (
        <div className={`${mediaWrap} ${mediaRatio}`} onClick={() => setModalItem(project)}>
          <video className={videoClass} src={project.src} poster={project.poster || undefined} preload="metadata" playsInline muted />
          <div className={visualOverlay}>
            <div className={overlayIcon}>{renderOverlayIcon(project.type)}</div>
          </div>
          {isCompact ? renderCompactOverlay(project) : null}
        </div>
      );
    }

    if (project.type === "image") {
      return (
        <div className={`${mediaWrap} ${mediaRatio}`} onClick={() => setModalItem(project)}>
          <img src={project.src} alt={project.title} className={imageClass} loading="lazy" />
          <div className={visualOverlay}>
            <div className={overlayIcon}>{renderOverlayIcon(project.type)}</div>
          </div>
          {isCompact ? renderCompactOverlay(project) : null}
        </div>
      );
    }

    if (project.type === "audio") {
      return (
        <div className={`${audioWrap} ${mediaRatio}`} onClick={() => setModalItem(project)}>
          <img src={project.poster} alt={project.title} className={audioImage} loading="lazy" />
          <div className={visualOverlay}>
            <div className={overlayIcon}>{renderOverlayIcon(project.type)}</div>
          </div>
          {isCompact ? renderCompactOverlay(project) : null}
        </div>
      );
    }

    return null;
  };

  const renderModalContent = () => {
    if (!modalItem) return null;
    if (modalItem.type === "image") {
      return <img src={modalItem.src} alt={modalItem.title} className={modalMedia} />;
    }
    if (modalItem.type === "video") {
      return (
        <video className={modalMedia} src={modalItem.src} poster={modalItem.poster || undefined} controls autoPlay playsInline preload="metadata" />
      );
    }
    if (modalItem.type === "audio") {
      return (
        <div className={modalAudioBody}>
          <audio controls autoPlay className={modalAudioPlayer}>
            <source src={modalItem.src} />
            مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
          </audio>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <section className={container}>
        <div className={header}>
          <div className={headingWrap}>
            <h2 className={title}>{titleText}</h2>
            <p className={description}>{descriptionText}</p>
          </div>

          {showFilters && projectCategories.length > 0 && (
            <div className={filters}>
              {projectCategories.map((item) => {
                const isActive = activeCategory === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveCategory(item.key);
                      setVisibleRows(INITIAL_VISIBLE_ROWS);
                    }}
                    className={`${filterButton} ${isActive ? activeFilter : inactiveFilter}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {visibleProjects.length === 0 ? (
          <p className={emptyText}>فعلاً نمونه‌کاری در این دسته‌بندی ثبت نشده است.</p>
        ) : (
          <>
            <div className={grid}>
              {visibleProjects.map((project) => {
                const isPortrait = project.orientation === "portrait";
                const hasDescription = Boolean(project.hasDescription);
                const cardClass = hasDescription
                  ? `${cardBase} ${cardWithDescription} ${isPortrait ? cardPortrait : cardLandscape}`
                  : `${cardBase} ${isPortrait ? cardWithoutDescriptionPortrait : cardWithoutDescriptionLandscape}`;

                return (
                  <article key={project.id} className={cardClass}>
                    {renderMedia(project, !hasDescription)}
                    {hasDescription && (
                      <div className={cardContent}>
                        {renderBadges(project)}
                        <div className={descriptionWrap}>
                          <p className={cardDescription}>{project.description}</p>
                        </div>
                        <div className={footerWrap}>
                          <Link href={`/portfolio/${project.slug}`} className={link}>
                            جزئیات
                          </Link>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {hasMoreProjects && (
              <>
                <div className={loadMoreWrap}>
                  <button type="button" className={loadMoreButton} onClick={handleLoadMore}>
                    نمایش بیشتر
                  </button>
                </div>
                <p className={loadMoreInfo}>{remainingProjectsCount} نمونه‌کار دیگر باقی مانده است.</p>
              </>
            )}
          </>
        )}
      </section>

      {modalItem && (
        <div className={modalBackdrop} onClick={() => setModalItem(null)} role="dialog" aria-modal="true">
          <div className={modalContent} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={modalClose} onClick={() => setModalItem(null)} aria-label="بستن">
              x
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
}
