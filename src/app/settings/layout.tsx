

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/settings/profile/edit", label: "Edit profile", icon: <EditNoteOutlinedIcon /> },
  { href: "/settings/account_privacy", label: "Account Privacy", icon: <LockClockOutlinedIcon /> },
  { href: "/settings/account/account_type", label: "Account type", icon: <AssignmentIndOutlinedIcon /> },
  { href: "/settings/activity/liked", label: "Your activity", icon: <TimelineOutlinedIcon /> },
  { href: "/settings/blocked", label: "Blocked", icon: <BlockOutlinedIcon /> },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-80 fixed h-full bg-background border-r p-3">
        <h1 className="text-lg font-bold mb-8 text-center">Settings</h1>
        <nav className="flex flex-col">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`p-3 m-1 flex items-center gap-5 rounded-md ${
                pathname === href ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="ml-80 flex-1 p-8">{children}</main>
    </div>
  );
}