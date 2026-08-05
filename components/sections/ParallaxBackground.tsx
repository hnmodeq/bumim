"use client";

import { useEffect, useRef } from "react";

const backgrounds = [
  "/media/images/ui/camera.png",
  "/media/images/ui/clapboard.png",
  "/media/images/ui/emptyreel.png",
  "/media/images/ui/canoncamera.png",
  "/media/images/ui/redcamera.png",
  "/media/images/ui/cameralens.png",
  "/media/images/ui/digitalcamera.png",
  "/media/images/ui/directorchair.png",
  "/media/images/ui/slr.png",
  "/media/images/ui/xmmcamera.png",
];

const wrapper = `justify-center items-center inset-0 -z-10 pointer-events-none overflow-hidden fixed`;
const layer = `justify-center items-center inset-0 absolute transform-gpu will-change-transform`;
const imageBase = `absolute justify-center items-center select-none opacity-100 transform-gpu will-change-transform animate-float`;
const imageSoft = `saturate-[0.9] brightness-[1.02]`;

interface ParallaxBackgroundProps {
  gradientSpeed?: number;
  iconsSpeed?: number;
}

export default function ParallaxBackground({
  gradientSpeed = 0.12,
  iconsSpeed = 0.28,
}: ParallaxBackgroundProps) {
  void gradientSpeed;
  void iconsSpeed;
  const itemRefs = useRef<Array<HTMLImageElement | null>>([]);
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  const images = [
    {
      src: backgrounds[0],
      speed: 0.05,
      className: `${imageBase} ${imageSoft} top-[40%] scale-[1.2] md:top-[25%] md:scale-[1.1] lg:top-[-20%] lg:scale-[0.7] xl:top-[-10%] xl:scale-[0.7] 2xl:top-[-10%] 2xl:scale-[0.6]`,
    },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const lerp = (start: number, end: number, t: number) =>
      start * (1 - t) + end * t;

    const update = () => {
      scrollCurrent.current = lerp(
        scrollCurrent.current,
        scrollTarget.current,
        0.08
      );

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const offset = scrollCurrent.current * images[index].speed;
        el.style.setProperty("--parallax-offset", `${-offset}px`);
      });

      rafRef.current = requestAnimationFrame(update);
    };

    const handleScroll = () => {
      scrollTarget.current = window.scrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={wrapper} aria-hidden="true">
      <div className="parallax-baseGradient" />
      <div className="parallax-topGlow" />
      <div className="parallax-leftGlow" />
      <div className="parallax-rightGlow" />
      <div className="parallax-gridOverlay" />

      <div className={layer}>
        {images.map((image, index) => (
          <img
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            src={image.src}
            alt=""
            draggable={false}
            className={image.className}
            style={{
              "--float-amount": `${14 + index * 4}px`,
              "--float-duration": `${10 + index * 2}s`,
              "--float-delay": `${index * 0.8}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="parallax-vignette" />
    </div>
  );
}
