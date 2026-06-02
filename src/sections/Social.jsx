import bale from "@/assets/icons/newpack/bale.svg";
import gmaillogo from "@/assets/icons/newpack/mail.svg";
import phone from "@/assets/icons/newpack/phone.svg";
import { Controls } from "@/utilities/Controls";

const wrapper = `
flex
flex-wrap
items-center

md:

lg:

`;

const link = `
p-2
inline-flex
items-center
justify-center
transition
duration-150
hover:scale-110
active:scale-95

md:

lg:

`;

const icon = `
w-8
h-auto
object-contain

md:

lg:

`;

const socials = [

{
id: "bale",
icon: bale,
label: "تلگرام",
href: "https://t.me",
},
{
id: "email",
icon: gmaillogo,
label: "ایمیل",
href: "mailto:info@example.com",
},
{
id: "phone",
icon: phone,
label: "تلفن",
href: "tel:+989000000000",
},

];

export default function Social({ className }) {
return (
<div
className={Controls(
wrapper,
className
)}
>
{socials.map((item) => (
<a
key={item.id}
href={item.href}
target="_blank"
rel="noreferrer"
aria-label={item.label}
className={link}
>
<img
src={item.icon}
alt={item.label}
className={icon}
/>
</a>
))}
</div>
);
}
