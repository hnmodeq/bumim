import { Link } from "react-router-dom";

const link = `
whitespace-nowrap
transition-colors
text-[length:var(--font-size-small)]
text-[var(--font-color-primary)]
hover:text-black

md:

lg:

`;

const NavLink = ({ to, children }) => {
    return (
        <Link
            to={to}
            className={link}
        >
            {children}
        </Link>
    );
};

export default NavLink;
