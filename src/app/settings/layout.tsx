

// // app/settings/layout.tsx
// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
// import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
// import BlockIcon from '@mui/icons-material/Block';
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// interface SettingsLayoutProps {
//   children: React.ReactNode;
// }

// export default function SettingsLayout({ children }: SettingsLayoutProps) {
//   const pathname = usePathname();

//   return (
//     <div className="  ">
//       {/* Left Sidebar */}
//       <div className="w-80 fixed h-full bg-background border-r p-3">
//         <h1 className="text-2xl font-bold mb-8">Settings</h1>
//         <nav className="w-full flex flex-col">


//         <Link
//             href="/settings/profile/edit"
//             className={`p-3 w-full flex items-center gap-5 ${
//               pathname === "/settings/profile/edit" ? "bg-accent" : "hover:bg-accent"
//             }`}
//           >
//             <AccountCircleOutlinedIcon/>

//             <span>Edit profile</span>

//           </Link>
//           <Link
//             href="/settings/account_privacy"
//             className={`p-3 w-full flex items-center gap-5 ${
//               pathname === "/settings/account_privacy" ? "bg-accent" : "hover:bg-accent"
//             }`}
//           >
//             <HttpsOutlinedIcon />
//             <span>Account Privacy</span>
//           </Link>
//           <Link
//             href="/settings/activity/liked"
//             className={`p-3 w-full flex items-center gap-5 ${
//               pathname === "/settings/activity" ? "bg-accent" : "hover:bg-accent"
//             }`}
//           >
//             <TimelineOutlinedIcon />
//             <span>Your activity</span>
//           </Link>
//           <Link
//             href="/settings/blocked"
//             className={`p-3 w-full flex items-center gap-5 ${
//               pathname === "/settings/blocked" ? "bg-accent" : "hover:bg-accent"
//             }`}
//           >
//             <BlockIcon />
//             <span>Blocked</span>
//           </Link>

         

//         </nav>
//       </div>

//       <div className="ml-80 flex-1 p-8">{children}</div>
//     </div>
//   );
// }





"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HttpsOutlined as PrivacyIcon,
  Block as BlockIcon,
  AccountCircleOutlined as ProfileIcon,
} from "@mui/icons-material";
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/settings/profile/edit", label: "Edit profile", icon: <ProfileIcon /> },
  { href: "/settings/account_privacy", label: "Account Privacy", icon: <PrivacyIcon /> },
  { href: "/settings/account/account_type", label: "Account type", icon: <AutoGraphOutlinedIcon /> },
  { href: "/settings/activity/liked", label: "Your activity", icon: <InsertChartOutlinedIcon /> },
  { href: "/settings/blocked", label: "Blocked", icon: <BlockIcon /> },
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
