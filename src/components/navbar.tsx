import React, { useContext, useState } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { useDisclosure, User } from "@heroui/react";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { GlobalConfigContext } from "@/config/GlobalConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { AuthModal } from "@/components/AuthModal";
import { ThemeSwitch } from "./theme-switch";
// Import the logo from assets
import logo from "@/assets/MASKoff-logo.png";

export const Navbar = () => {
  const { user } = useContext(GlobalConfigContext)!;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // state for controlling the mobile dropdown menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // choose nav items based on authentication state
  const navItems = token
    ? siteConfig.authenticatedNavItems
    : siteConfig.unauthenticatedNavItems;

  const handleLogout = () => {
    logout();
    navigate("/home");
  };
  // helper to render each nav item
  const renderNavItem = (item: { label: string; link: string }) => {
    if (item.label === "Logout") {
      return (
        <Button variant="flat" onPress={handleLogout}>
          {item.label}
        </Button>
      );
    } else if (item.label === "Login/Register") {
      return (
        <>
          <Button variant="flat" onPress={() => { setMobileMenuOpen(false); onOpen(); }}>
            {item.label}
          </Button>
          <AuthModal onOpenChange={onOpenChange} isOpen={isOpen} />
        </>
      );
    } else if (item.label === "Settings") {
      return (
        <User
          avatarProps={{
            src: user?.avatar,
            name: user?.name?.charAt(0),
            showFallback: true,
          }}
          description={
            <Link href={`/settings`} size="sm">
              @{user?.username}
            </Link>
          }
          name={user?.name}
        />
      );
    } else {
      return (
        <Link
          className="px-3 py-2 hover:text-primary"
          color="foreground"
          href={item.link}
          onClick={() => setMobileMenuOpen(false)}
        >
          {item.label}
        </Link>
      );
    }
  };

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="border-b-2 border-default-500 relative"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <NavbarBrand>
          <Link color="foreground" href="/home" className="flex items-center">
            <img src={logo} alt="MASKoff Logo" className="h-8 w-8 mr-2" />
            <span className="font-bold text-lg">{siteConfig.name}</span>
          </Link>
        </NavbarBrand>
        {/* Hamburger icon visible on mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex">
          <NavbarContent justify="center">
            {navItems.map((item) => (
              <NavbarItem key={item.link}>{renderNavItem(item)}</NavbarItem>
            ))}
            <NavbarItem>
              <ThemeSwitch />
            </NavbarItem>
          </NavbarContent>
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-10">
          <div className="flex flex-col p-4 space-y-2 text-gray-800 dark:text-gray-100">
            {navItems.map((item) => (
              <div key={item.link}>{renderNavItem(item)}</div>
            ))}
            <div>
              <ThemeSwitch />
            </div>
          </div>
        </div>
      )}
    </HeroUINavbar>
  );
};
