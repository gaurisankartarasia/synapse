// app/settings/layout.tsx
import Link from "next/link";
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="  ">
      {/* Left Sidebar */}
      <div className="w-80 fixed h-full bg-background border-r p-3">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        <nav className="w-full flex flex-col">
          <Link
            href="/settings/account_privacy"
            className="hover:bg-accent p-3 w-full flex items-center gap-5 " 
          >
            <HttpsOutlinedIcon/>
           <span> Account Privacy</span>


          </Link>
          <Link
            href="/settings/activity"
            className="hover:bg-accent p-3 w-full flex items-center gap-5 " 
          >
            <TimelineOutlinedIcon/>
           <span> Your activity</span>
          </Link>
        </nav>
      </div>

      <div className="ml-80 flex-1 p-8">{children}</div>
    </div>
  );
}