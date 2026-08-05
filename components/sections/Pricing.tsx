"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";
import { priceFor } from "@/lib/pricing";
import type { Project, PricingData } from "@/lib/types";

const container = `w-full flex flex-row items-start justify-center px-5 gap-5 pt-20 rounded-[var(--rounded-small)]`;
const sidebar = `w-40 flex flex-col gap-5 md:w-100 lg:flex-row lg:justify-center lg:w-94 xl:w-120`;
const samplesWrap = `w-full h-auto flex flex-col gap-5 items-center justify-center lg:w-auto`;
const samplesGrid = `grid grid-cols-1 gap-5 md:w-70 md:grid-cols-1 lg:w-50`;
const grid = `w-60 flex flex-col justify-center items-center gap-5 md:w-150 lg:flex-row lg:items-start xl:w-200 xl:justify-center`;
const buttonsArea = `flex flex-col w-full h-full gap-1 md:gap-2 xl:gap-3`;
const card = `w-full flex flex-col px-5 md:w-90 lg:w-70 xl:w-80 2xl:w-90 rounded-[var(--rounded-small)] backdrop-blur-[var(--blur-small)] bg-[var(--bg-color-primary)]`;
const sampleCard = `w-full h-full group relative overflow-hidden rounded-[var(--rounded-small)] border-[var(--border-main)] bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] shadow-[var(--shadow-small)] transition duration-300 hover:-translate-y-1 cursor-pointer`;
const sampleMediaWrap = `relative w-full aspect-video overflow-hidden bg-[var(--bg-color-primary)] flex items-center justify-center h-40 md:h-60 lg:h-50 xl:h-50 2xl:h-50`;
const sampleMedia = `absolute top-0 left-0 w-full h-full object-cover`;
const sampleAudio = `w-full h-full flex items-center justify-center text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] bg-[var(--bg-color-primary)]`;
const sampleOverlay = `absolute inset-0 flex items-center justify-around bg-black/18 opacity-100 transition w-full h-full`;
const sampleCta = `flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-color-primary)] backdrop-blur-md border border-white/18 text-[var(--font-color-primary)] text-[length:var(--font-size-xsmall)] shadow-sm`;
const sampleIcon = `w-4 h-4 shrink-0`;
const moreButtonWrap = `mt-1`;
const moreButton = `w-full flex items-center justify-center text-center px-3 py-2 rounded-[var(--rounded-small)] border-[var(--border-main)] text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] transition duration-350 hover:-translate-y-1 bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] md:py-2.5 lg:py-3`;
const cardTitle = `text-[length:var(--font-size-med)] text-[var(--font-color-third)] font-bold`;
const cardPrice = `flex flex-col-reverse items-end`;
const priceUnit = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] pr-1`;
const priceItSelf = `text-[length:var(--font-size-med)] text-[var(--font-color-secondary)] font-bold xl:text-[calc(var(--font-size-med)+2px)] 2xl:text-[calc(var(--font-size-med)+4px)]`;
const cardLimit = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-third)] pt-4`;
const featureList = `text-[length:var(--font-size-xsmall)] text-[var(--font-color-primary)] py-4 space-y-1 md:space-y-1.5 xl:space-y-2`;
const featureDetail = `pr-4 leading-6`;
const alignheader = `flex flex-row justify-between items-center w-full px-1 pt-3 gap-3`;
const modalBackdrop = `fixed inset-0 z-[999] bg-[var(--bg-color-primary)] backdrop-blur-[var(--blur-small)] flex items-center justify-center px-3 md:px-6 lg:px-10 xl:px-14 2xl:px-20`;
const modalBox = `relative w-full max-w-sm rounded-[var(--rounded-small)] bg-[var(--bg-color-primary)] border-[var(--border-main)] overflow-hidden shadow-[var(--shadow-small)] md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl`;
const modalClose = `absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-color-primary)] text-[var(--font-color-third)] font-bold backdrop-blur-[var(--blur-small)] md:top-5 md:left-5 lg:top-6 lg:left-6`;
const modalMediaWrap = `w-full max-h-[80vh] bg-[var(--bg-color-primary)] flex items-center justify-center`;
const modalMedia = `w-full max-h-[80vh] object-contain`;
const modalAudioWrap = `w-full min-h-[220px] flex flex-col items-center justify-center gap-4 px-4 py-8 bg-[var(--bg-color-primary)] md:min-h-[260px] md:px-6 md:py-10 lg:min-h-[300px] xl:min-h-[340px]`;
const modalTitle = `text-[length:var(--font-size-small)] text-[var(--font-color-third)] text-center`;

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={sampleIcon}>
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default function Pricing({ pricing, projects = [] }: { pricing: PricingData; projects?: Project[] }) {
  const [activeService, setActiveService] = useState("short");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const currentService = services.find((s) => s.id === activeService) || services[0];

  const serviceSamples = useMemo(() => {
    if (!currentService?.categoryKey) return [];
    return projects
      .filter((project) => project.category === currentService.categoryKey)
      .slice(0, 2);
  }, [currentService, projects]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  const renderSampleMedia = (project: Project) => {
    if (project.type === "image") {
      return <img src={project.src} alt={project.title} className={sampleMedia} loading="lazy" />;
    }
    if (project.type === "video") {
      return (
        <video className={sampleMedia} src={project.src} poster={project.poster || undefined} muted playsInline preload="metadata" />
      );
    }
    if (project.type === "audio") {
      return (
        <div className={sampleAudio}>
          {project.poster && <img src={project.poster} alt={project.title} className={sampleMedia} />}
        </div>
      );
    }
    return null;
  };

  const renderModalMedia = () => {
    if (!activeProject) return null;
    if (activeProject.type === "image") {
      return <img src={activeProject.src} alt={activeProject.title} className={modalMedia} />;
    }
    if (activeProject.type === "video") {
      return (
        <video src={activeProject.src} poster={activeProject.poster || undefined} className={modalMedia} controls autoPlay playsInline />
      );
    }
    if (activeProject.type === "audio") {
      return (
        <div className={modalAudioWrap}>
          <p className={modalTitle}>{activeProject.title}</p>
          <audio src={activeProject.src} controls autoPlay />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className={container}>
        <div className={sidebar}>
          <section className={buttonsArea}>
            {services.map((service) => {
              const isActive = activeService === service.id;
              return (
                <Button
                  key={service.id}
                  size="sm"
                  variant={isActive ? "primary" : "secondary"}
                  onClick={() => setActiveService(service.id)}
                >
                  {service.label}
                </Button>
              );
            })}
          </section>

          {serviceSamples.length > 0 && (
            <section>
              <div className={samplesWrap}>
                <div className={samplesGrid}>
                  {serviceSamples.map((project) => (
                    <article key={project.id} className={sampleCard} onClick={() => setActiveProject(project)}>
                      <div className={sampleMediaWrap}>
                        {renderSampleMedia(project)}
                        <div className={sampleOverlay}>
                          <div className={sampleCta}>
                            <EyeIcon />
                            <span>مشاهده</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={moreButtonWrap}>
                  <Link
                    href={`/portfolio?cat=${currentService.portfolioTab}`}
                    className={moreButton}
                  >
                    نمونه کارهای بیشتر
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className={grid}>
          {currentService.plans.map((plan) => (
            <article key={plan.id} className={card}>
              <div className={alignheader}>
                <h3 className={cardTitle}>{plan.name}</h3>
                <p className={cardPrice}>
                  <span className={priceUnit}>تومان</span>
                  <span className={priceItSelf}>{priceFor(plan.id, pricing)}</span>
                </p>
              </div>

              <ul className={featureList}>
                {plan.features.map((feature, i) => (
                  <li key={i} className={featureDetail}>
                    • {feature}
                  </li>
                ))}
                <p className={cardLimit}>{plan.limit}</p>
              </ul>
            </article>
          ))}
        </div>
      </div>

      {activeProject && (
        <div className={modalBackdrop} onClick={() => setActiveProject(null)}>
          <div className={modalBox} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={modalClose} onClick={() => setActiveProject(null)} aria-label="بستن">
              <CloseIcon />
            </button>
            <div className={modalMediaWrap}>{renderModalMedia()}</div>
          </div>
        </div>
      )}
    </>
  );
}
