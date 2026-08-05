// About page data — media served from /media (local fallback) or Supabase URLs.

export interface TeamSocial {
  icon: string;
  link: string;
  text: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  socials: {
    instagram: TeamSocial;
    telegram: TeamSocial;
  };
}

export const aboutSlides: string[] = [
  "/media/images/about-slider/1.webp",
  "/media/images/about-slider/2.webp",
  "/media/images/about-slider/3.webp",
];

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "هومن مدق",
    role: "طراح موشن گرافیک",
    description: '""',
    image: "/media/images/team/hooman.png",
    socials: {
      instagram: {
        icon: "/media/icons/newpack/instagram.svg",
        link: "http://instagram.com/hnmodeq",
        text: "@hnmodeq",
      },
      telegram: {
        icon: "/media/icons/newpack/telegram_app.svg",
        link: "http://telegram.com/hnmodeq",
        text: "@hnmodeq",
      },
    },
  },
  {
    id: 2,
    name: "عطیه حاتمی",
    role: "محتوا نویس / نریتور",
    description: "درباره کوتاه",
    image: "/media/images/team/atiye.png",
    socials: {
      instagram: {
        icon: "/media/icons/newpack/instagram.svg",
        link: "http://instagram.com/hatami",
        text: "@hatami",
      },
      telegram: {
        icon: "/media/icons/newpack/telegram_app.svg",
        link: "http://telegram.com/hatami",
        text: "@hatami",
      },
    },
  },
  {
    id: 3,
    name: "بهناز قادری",
    role: "طراح گرافیک",
    description: "درباره کوتاه",
    image: "/media/images/team/behnaz.png",
    socials: {
      instagram: {
        icon: "/media/icons/newpack/instagram.svg",
        link: "http://instagram.com/behnaz",
        text: "@behnaz",
      },
      telegram: {
        icon: "/media/icons/newpack/telegram_app.svg",
        link: "http://telegram.com/behnaz",
        text: "@behnaz",
      },
    },
  },
  {
    id: 4,
    name: "نسترن خداکرمی",
    role: "طراح ایلوستریشن",
    description: "درباره کوتاه",
    image: "/media/images/team/nastaran.png",
    socials: {
      instagram: {
        icon: "/media/icons/newpack/instagram.svg",
        link: "http://instagram.com/nskarami",
        text: "@nskarami",
      },
      telegram: {
        icon: "/media/icons/newpack/telegram_app.svg",
        link: "http://telegram.com/nskarami",
        text: "@nskarami",
      },
    },
  },
  {
    id: 5,
    name: "روژینا باقری",
    role: "ویدیو ادیتور",
    description: "درباره کوتاه",
    image: "/media/images/team/rojina.png",
    socials: {
      instagram: {
        icon: "/media/icons/newpack/instagram.svg",
        link: "http://instagram.com/rbagheri",
        text: "@rbagheri",
      },
      telegram: {
        icon: "/media/icons/newpack/telegram_app.svg",
        link: "http://telegram.com/rbagheri",
        text: "@rbagheri",
      },
    },
  },
];
