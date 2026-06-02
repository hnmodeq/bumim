import { Link } from "react-router-dom";
import logo from "/logo.png";
import { Controls } from "@/utilities/Controls";

const base = `
flex
items-center
gap-2
whitespace-nowrap
transition-all
duration-200
hover:-translate-y-0.5
`;

const responsive = `
text-[length:var(--font-size-xsmall)]
text-[var(--font-color-primary)]

`;

const image = `
h-8
w-auto
object-contain

`;

const text = `
leading-none
`;

const Logo = () => {
    return (
        <Link to="/" className={Controls(base, responsive)}>
            <img src={logo} alt="بومیم" className={image} />
            <p className={text}>بومیم هستیم.</p>
        </Link>
    );
};

export default Logo;
