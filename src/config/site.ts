export const siteConfig = {
  name: "MASKoff",
  description: "A full-stack job platform with community engagement and direct messaging.",
  
  // nav for unauthenticated users.
  unauthenticatedNavItems: [
    { label: "Login/Register", link: "/#" },
  ],

  // nav for authenticated users.
  authenticatedNavItems: [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Explore", link: "/explore" },
    { label: "Jobs", link: "/jobs" },
    { label: "Friends", link: "/friends" },
    { label: "Chats", link: "/chat" },
    { label: "Profile", link: "/profile" },
    { label: "Settings", link: "/settings" },
    { label: "Logout", link: "/logout" }
  ]
};
