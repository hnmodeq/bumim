import {
  LayoutDashboard,
  User,
  Briefcase,
  Users,
  MessageSquare,
  Star,
  Settings,
  FolderKanban,
  ClipboardList,
  ShieldCheck,
  Flag,
  Banknote,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  /** i18n key under the relevant namespace */
  key: string;
  href: string;
  icon?: LucideIcon;
};

/** Primary public navigation (header). */
export const publicNav: NavItem[] = [
  { key: "editors", href: "/editors" },
  { key: "projects", href: "/projects" },
  { key: "rateGuide", href: "/rate-guide" },
  { key: "quote", href: "/quote" },
  { key: "community", href: "/community" },
  { key: "resources", href: "/resources" },
];

/** Secondary public links (footer). */
export const footerNav: NavItem[] = [
  { key: "howItWorks", href: "/how-it-works" },
  { key: "about", href: "/about" },
  { key: "editors", href: "/editors" },
  { key: "rateGuide", href: "/rate-guide" },
];

/** Authenticated dashboard sidebar. */
export const dashboardNav: NavItem[] = [
  { key: "overview", href: "/dashboard", icon: LayoutDashboard },
  { key: "profile", href: "/dashboard/profile", icon: User },
  { key: "portfolio", href: "/dashboard/portfolio", icon: FolderKanban },
  { key: "projects", href: "/dashboard/projects", icon: Briefcase },
  { key: "applications", href: "/dashboard/applications", icon: ClipboardList },
  {
    key: "collaborations",
    href: "/dashboard/collaborations",
    icon: Users,
  },
  { key: "messages", href: "/dashboard/messages", icon: MessageSquare },
  { key: "reviews", href: "/dashboard/reviews", icon: Star },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];

/** Admin sidebar. */
export const adminNav: NavItem[] = [
  { key: "overview", href: "/admin", icon: LayoutDashboard },
  { key: "users", href: "/admin/users", icon: Users },
  { key: "projects", href: "/admin/projects", icon: Briefcase },
  { key: "reports", href: "/admin/reports", icon: Flag },
  { key: "verification", href: "/admin/verification", icon: ShieldCheck },
  { key: "rates", href: "/admin/rates", icon: Banknote },
  { key: "community", href: "/admin/community", icon: Megaphone },
];

export type { LucideIcon };
