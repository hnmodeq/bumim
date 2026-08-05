import { Controls } from "@/lib/utils";

const wrapper = `flex flex-wrap items-center`;
const link = `p-2 inline-flex items-center justify-center transition duration-150 hover:scale-110 active:scale-95`;
const icon = `w-8 h-auto object-contain`;

const socials = [
  { id: "bale", icon: "/media/icons/newpack/bale.svg", label: "بله", href: "https://ble.ir/hnmodeq" },
  { id: "email", icon: "/media/icons/newpack/mail.svg", label: "ایمیل", href: "mailto:info@bumimstudio.ir" },
  { id: "phone", icon: "/media/icons/newpack/phone.svg", label: "تلفن", href: "tel:+989000000000" },
];

export default function Social({ className }: { className?: string }) {
  return (
    <div className={Controls(wrapper, className)}>
      {socials.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className={link}
        >
          <img src={item.icon} alt={item.label} className={icon} />
        </a>
      ))}
    </div>
  );
}
