'use client'
import { useWebSocket } from "@/hooks/websocket/useWebsocket";
import { cn } from "@/lib/utils";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IoSearch } from "react-icons/io5";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { usePathname } from 'next/navigation';



export default function SideNavigation() {
  const { notificationCount } = useWebSocket("ws://localhost:5000"); // Use WebSocket hook
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: HomeOutlinedIcon, FilledIcon: HomeIcon },
    { name: 'Create', href: '/post/create', icon: AddCircleOutlineIcon, FilledIcon: AddCircleIcon },
    { name: 'Search', href: '/search', icon: SearchIcon, FilledIcon: IoSearch },
    { 
      name: 'Notifications', 
      href: '/notifications', 
      icon: NotificationsNoneIcon, 
      FilledIcon: NotificationsIcon,
      badgeCount: notificationCount 
    },
  ];

  return (
    <>
      <nav className="flex flex-1 flex-col gap-4">
        {navLinks.map(({ name, href, icon: Icon, FilledIcon, badgeCount }) => {
          const isActive = pathname === href;
          return (
            <Link
              prefetch
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-2xl transition-all duration-200',
                isActive ? ' font-bold text-primary' : 'font-normal'
              )}
            >
              {isActive ? <FilledIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
              <span className="hidden lg:block">{name}</span>

              {badgeCount && badgeCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
