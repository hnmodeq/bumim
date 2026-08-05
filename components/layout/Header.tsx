import Navbar from "@/components/layout/Navbar";
import Logo from "@/components/layout/Logo";

const header = `sticky top-0 z-40 w-full h-14 border-b border-white/10 bg-[var(--bg-color-primary)]/85 backdrop-blur-[var(--blur-small)] shadow-[var(--shadow-small)]`;
const container = `w-full h-full mx-auto flex items-center justify-between px-4`;

export default function Header() {
  return (
    <header className={header}>
      <div className={container}>
        <Logo />
        <Navbar />
      </div>
    </header>
  );
}
