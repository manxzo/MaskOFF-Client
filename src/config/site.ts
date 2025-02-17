// src/config/site.ts
export const siteConfig = {
  name: "MASKoff",
  description:
    "A full-stack job platform with community engagement, direct messaging, and interview scheduling.",
  defaultNavItems: [
    { label: "Home", href: "/home" },
    { label: "Login", href: "/login" },
    { label: "Create User", href: "/newuser" },
    { label: "About", href: "/about" },
  ],
  dashboardNavItems: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Find Users", href: "/find-users" },
    { label: "Friend List", href: "/friends" },
    { label: "Messages", href: "/messages" },
    { label: "Logout", href: "/logout" },
  ],
  navMenuItems: [
    { label: "Profile", href: "/profile" },
    { label: "Projects", href: "/projects" },
    { label: "Team", href: "/team" },
    { label: "Calendar", href: "/calendar" },
    { label: "Settings", href: "/settings" },
    { label: "Help & Feedback", href: "/help-feedback" },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
