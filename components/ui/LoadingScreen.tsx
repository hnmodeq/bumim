import Logo from "@/components/layout/Logo";

const wrapper = `fixed inset-0 z-50 flex items-center justify-center bg-gradient-cinematic backdrop-blur-[var(--blur-small)]`;
const content = `flex flex-col items-center gap-4 scale-100`;

export default function LoadingScreen() {
  return (
    <div className={wrapper}>
      <div className={content}>
        <Logo />
      </div>
    </div>
  );
}
