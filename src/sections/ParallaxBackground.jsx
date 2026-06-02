import { useEffect, useRef } from "react";
import camera from "@/assets/images/ui/camera.png";
import clapboard from "@/assets/images/ui/clapboard.png";
import emptyreel from "@/assets/images/ui/emptyreel.png";
import canoncamera from "@/assets/images/ui/canoncamera.png";
import redcamera from "@/assets/images/ui/redcamera.png";
import cameralens from "@/assets/images/ui/cameralens.png";
import digitalcamera from "@/assets/images/ui/digitalcamera.png";
import slr from "@/assets/images/ui/slr.png";
import xmmcamera from "@/assets/images/ui/xmmcamera.png";
import directorchair from "@/assets/images/ui/directorchair.png";

const wrapper = `
justify-center
items-center
inset-0
-z-10
pointer-events-none
overflow-hidden
fixed
`;

const layer = `
justify-center
items-center
inset-0
absolute
transform-gpu
will-change-transform
`;

const imageBase = `
absolute
justify-center
items-center
select-none
opacity-100
transform-gpu
will-change-transform
animate-float
`;

const imageSoft = `
saturate-[0.9]
brightness-[1.02]
`;

const backgrounds = [
    camera,
    clapboard,
    emptyreel,
    canoncamera,
    redcamera,
    cameralens,
    digitalcamera,
    directorchair,
    slr,
    xmmcamera,
];

const randomImage =
    backgrounds[Math.floor(Math.random() * backgrounds.length)];

const images = [
    {
        src: randomImage,
        speed: 0.05,
        className: `
${imageBase}
${imageSoft}
top-[40%]
scale-[1.2]

md:top-[25%]
md:scale-[1.1]

lg:top-[-20%]
lg:scale-[0.7]

xl:top-[-10%]
xl:scale-[0.7]

2xl:top-[-10%]
2xl:scale-[0.6]
`,
    },
];

function ParallaxBackground() {
    const itemRefs = useRef([]);
    const scrollTarget = useRef(0);
    const scrollCurrent = useRef(0);
    const rafRef = useRef();

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) return;

        const lerp = (start, end, t) => start * (1 - t) + end * t;

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
            cancelAnimationFrame(rafRef.current);
        };
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
                        ref={(el) => (itemRefs.current[index] = el)}
                        src={image.src}
                        alt=""
                        draggable={false}
                        className={image.className}
                        style={{
                            "--float-amount": `${14 + index * 4}px`,
                            "--float-duration": `${10 + index * 2}s`,
                            "--float-delay": `${index * 0.8}s`,
                        }}
                    />
                ))}
            </div>

            <div className="parallax-vignette" />
        </div>
    );
}

export default ParallaxBackground;
