import Navbar from "@/sections/Navbar";
import Logo from "@/sections/Logo";

const header = `
sticky
top-0
z-40
w-full
h-14
border-b
border-white/10
bg-[var(--bg-color-primary)]/85
backdrop-blur-[var(--blur-small)]
shadow-[var(--shadow-small)]

`;

const container = `
w-full
h-full
mx-auto
flex
items-center
justify-between
px-4

`;

function Header() {
    return (
        <header className={header}>
            <div className={container}>
                <Logo />
                <Navbar />
            </div>
        </header>
    );
}

export default Header;
