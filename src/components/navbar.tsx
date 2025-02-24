import { useContext } from "react";
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

export const Navbar = () => {
  const { user } = useContext(GlobalConfigContext)!;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout } = useUser();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // choose nav items based on auth state.
  const navItems = token
    ? siteConfig.authenticatedNavItems
    : siteConfig.unauthenticatedNavItems;

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <>
      <HeroUINavbar maxWidth="xl" position="sticky" className="border-b-2 border-default-500">
        <NavbarContent justify="start">
          <NavbarBrand>
            <Link color="foreground" href="/home">
              <span className="font-bold text-lg">{siteConfig.name}</span>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.link}>
              {item.label === "Logout" ? (
                <Button variant="flat" onPress={handleLogout}>
                  {item.label}
                </Button>
              ) : (
                // for login/register in unauthenticated state, open modal.
                (item.label === "Login/Register") ? (
                  <>
                    <Button variant="flat" onPress={onOpen}>
                      {item.label}
                    </Button>
                    <AuthModal onOpenChange={onOpenChange} isOpen={isOpen} />
                  </>

                ) : (
                  // for login/register in unauthenticated state, open modal.
                  (item.label === "Settings") ? (
                    <>
                      <User
                        avatarProps={{
                          src: user?.avatar,
                          name:user?.name.charAt(0),
                          showFallback:true,
                        }}
                        description={<Link href={`/settings`} size="sm">
                        @{user?.username}
                      </Link>}
                        name={user?.name}
                      />
                    </>

                  ) : (
                    <Link
                      className={clsx("px-3 py-2", "hover:text-primary")}
                      color="foreground"
                      href={item.link}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
            </NavbarItem>
          ))}
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>

        </NavbarContent>
      </HeroUINavbar>
    </>
  );
};
