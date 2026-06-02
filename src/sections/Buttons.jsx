import { Controls } from "@/utilities/Controls";

const baseBtn = `
w-full
h-10
inline-flex
items-center
justify-center

md:h-12

lg:h-14

xl:h-15

2xl:h-16

rounded-[var(--rounded-small)]
border-[var(--border-main)]
bg-[var(--bg-color-primary)]
backdrop-blur-[var(--blur-small)]
shadow-[var(--shadow-small)]
transition-all
duration-300
hover:-translate-y-0.5
disabled:cursor-not-allowed
disabled:opacity-50


`;

const variants = {
    primary: `
text-[var(--font-color-third)]
`,
    secondary: `
text-[var(--font-color-primary)]
`,
    ghost: `
border-transparent
shadow-none
text-[var(--font-color-primary)]
bg-transparent
`,
};

const sizes = {
    sm: `
px-3
py-2

text-[length:var(--font-size-xsmall)]
`,
    md: `

px-4
py-2.5

text-[length:var(--font-size-small)]
`,
    lg: `

px-5
py-3

text-[length:var(--font-size-med)]
`,
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    ...props
}) {
    return (
        <button
            className={Controls(baseBtn, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
