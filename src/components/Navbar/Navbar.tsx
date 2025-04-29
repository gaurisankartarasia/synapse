//Navbar.tsx

"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { navLinks, createDropdownItems } from "./config";
import { DesktopSidebar } from "./components/DesktopSidebar";
import { MobileHeader } from "./components/MobileHeader";
import { MobileBottomNav } from "./components/MobileBottomNav";
import UserDropdown from "./components/UserDropdown";
import { useProfile } from "@/hooks/useProfile";
import { Avatar } from "@mui/material";

export default function SideNavigation() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  if (["/signin", "/signup", "/forgot-password", "/signout"].includes(pathname))
    return null;
  if (!profile) return null;

  // Create a profile nav item for use in the NavigationLink component

  const profileImage = () => {
    return (
      <Avatar
        src={profile.profilePhotoURL}
        alt={profile.username}
        sx={{ width: "25px", height: "25px" }}
      >
        {profile.username.slice(0, 1).toUpperCase()}
      </Avatar>
    );
  };

  const profileNavItem = {
    name: "Profile",
    href: `/${profile.username}`,
    icon: profileImage,
  };

  const dropdownItems = createDropdownItems(profile, setTheme);

  // Prepare the dropdown component instance for desktop and mobile
  const desktopDropdown = (
    <UserDropdown
      dropdownItems={dropdownItems}
      theme={theme}
      setTheme={setTheme}
    />
  );
  const mobileDropdown = (
    <UserDropdown
      dropdownItems={dropdownItems}
      theme={theme}
      setTheme={setTheme}
      isMobile
    />
  );

  return (
    <>
      <DesktopSidebar
        navLinks={navLinks}
        pathname={pathname}
        profileNavItem={profileNavItem}
        UserDropdown={desktopDropdown}
      />

      <MobileHeader UserDropdown={mobileDropdown} />

      <MobileBottomNav
        navLinks={navLinks}
        pathname={pathname}
        profileNavItem={profileNavItem}
      />
    </>
  );
}
