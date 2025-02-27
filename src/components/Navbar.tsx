

// 'use client';

// import { usePathname } from 'next/navigation';
// import { Home, Plus, Search, Bell, User, LogOut, Settings, User2, ChevronUp } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { useTheme } from 'next-themes';
// import { Button } from '@/components/ui/button';
// import LogoutButton from '@/app/(auth)/logoutButton';
// import { Sun, Moon } from 'lucide-react';
// import { useProfile } from '@/hooks/useProfile';
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default function SideNavigation() {
//   const { profile } = useProfile();
//   const pathname = usePathname();
//   const { theme, setTheme } = useTheme();

//   if (['/signin', '/signup', '/forgot-password'].includes(pathname)) return null;

//   if (!profile) {
//     return null;
//   }

//   const navLinks = [
//     { name: 'Home', href: '/', icon: Home },
//     { name: 'Create', href: '/post/create', icon: Plus },
//     { name: 'Search', href: '/search', icon: Search },
//     { name: 'Notifications', href: '/notifications', icon: Bell },
//   ];

//   return (
//     <>
//       {/* Desktop & Tablet Navigation */}
//       <aside className="hidden md:block fixed left-0 top-0 h-screen w-20 lg:w-64 border-r bg-background/95 backdrop-blur-sm transition-all duration-300 z-10 shadow-sm">
//         <div className="flex flex-col h-full p-4">
//           {/* Logo */}
//           <Link href="/" className="py-6 flex items-center justify-center lg:justify-start gap-3 mb-6">
//             <Image
//               src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
//               alt="Logo"
//               width={40}
//               height={40}
//               className="rounded-full"
//             />
//             <span className="text-2xl font-bold hidden lg:block">Synapse</span>
//           </Link>

//           {/* Navigation Links */}
//           <nav className="flex flex-1 flex-col gap-4">
//             {navLinks.map(({ name, href, icon: Icon }) => (
//               <Link
//                 prefetch
//                 key={href}
//                 href={href}
//                 className={cn(
//                   'flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-md transition-all duration-200 font-medium',
//                   pathname === href && 'bg-accent font-semibold'
//                 )}
//               >
//                 <Icon className="h-6 w-6 md:h-6 md:w-6" />
//                 <span className="hidden lg:block">{name}</span>
//               </Link>
//             ))}
//           </nav>

//           {/* User Section with Dropdown */}
//           <div className="mt-auto pt-4 border-t">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button 
//                   variant="ghost" 
//                   className="w-full flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-md transition-all"
//                 >
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src={profile.profilePhotoURL} alt={profile.username} className="object-cover" />
//                     <AvatarFallback>{profile.username.slice(0,1).toUpperCase()}</AvatarFallback>
//                   </Avatar>
//                   <div className="hidden lg:flex flex-col items-start text-left overflow-hidden">
//                     <span className="font-medium truncate w-40">{profile.username}</span>
//                   </div>
//                   <ChevronUp className="ml-auto hidden lg:block h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuItem asChild>
//                   <Link href={`/${profile.username}`} className="flex items-center gap-2 ">
//                     <User className="h-4 w-4" />
//                     <span>Profile</span>
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/settings" className="flex items-center gap-2 ">
//                     <Settings className="h-4 w-4" />
//                     <span>Settings</span>
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex items-center gap-2 ">
//                   {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
//                   <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                 <LogoutButton/>

//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile Header */}
//       <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50 shadow-sm">
//         <div className="flex items-center justify-between px-4 h-full">
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
//               alt="Logo"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//             <span className="text-lg font-bold">Synapse</span>
//           </Link>
          
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="h-10 w-10">
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage src={profile.profilePhotoURL} alt={profile.username} className="object-cover" />
//                   <AvatarFallback>{profile.username.slice(0,1).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem asChild>
//                 <Link href={`/${profile.username}`} className="flex items-center gap-2">
//                   <User className="h-4 w-4" />
//                   <span>Profile</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/settings" className="flex items-center gap-2">
//                   <Settings className="h-4 w-4" />
//                   <span>Settings</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex items-center gap-2">
//                 {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
//                 <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <LogoutButton/>
                  
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Mobile Bottom Navigation */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur grid grid-cols-4 z-50 shadow-sm">
//         {navLinks.map(({ href, icon: Icon }) => (
//           <Link
//             key={href}
//             href={href}
//             className={cn(
//               'flex flex-col items-center justify-center gap-1 p-2',
//               pathname === href ? 'text-primary' : 'text-muted-foreground'
//             )}
//           >
//             <Icon className="h-6 w-6" />
//             <span className="text-xs">{navLinks.find(l => l.href === href)?.name}</span>
//           </Link>
//         ))}
//       </nav>
//     </>
//   );
// }




// 'use client';

// import { usePathname } from 'next/navigation';
// import { User, Settings, ChevronUp } from 'lucide-react';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import HomeIcon from '@mui/icons-material/Home';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import { IoSearch } from "react-icons/io5";
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import SearchIcon from '@mui/icons-material/Search';
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
// import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

// import Link from 'next/link';
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { useTheme } from 'next-themes';
// import { Button } from '@/components/ui/button';
// import { Sun, Moon } from 'lucide-react';
// import { useProfile } from '@/hooks/useProfile';
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuPortal  ,
//   DropdownMenuSubTrigger
// } from "@/components/ui/dropdown-menu";
// import ThemeSwitcher from './theme';


// export default function SideNavigation() {
//   const { profile } = useProfile();
//   const pathname = usePathname();
//   const { theme, setTheme } = useTheme();

//   if (['/signin', '/signup', '/forgot-password', '/signout'].includes(pathname)) return null;

//   if (!profile) {
//     return null;
//   }

//   const navLinks = [
//     { name: 'Home', href: '/', icon: HomeOutlinedIcon, FilledIcon : HomeIcon  },
//     { name: 'Create', href: '/post/create', icon: AddCircleOutlineIcon, FilledIcon : AddCircleIcon  },
//     { name: 'Search', href: '/search', icon: SearchIcon, FilledIcon : IoSearch  },
//     { name: 'Notifications', href: '/notifications', icon: NotificationsNoneIcon, FilledIcon : NotificationsIcon  },
//   ];

//   return (
//     <>
//       {/* Desktop & Tablet Navigation */}
//       <aside className="hidden md:block fixed left-0 top-0 h-screen w-20 lg:w-64 border-r bg-background/95  transition-all duration-300 z-10 shadow-sm">
//         <div className="flex flex-col h-full p-4">
//           {/* Logo */}
//           <Link href="/" className="py-6 flex items-center justify-center lg:justify-start gap-3 mb-6">
//             <Image
//               src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
//               alt="Logo"
//               width={40}
//               height={40}
//               className="rounded-full"
//             />
//             <span className="text-2xl font-bold hidden lg:block">Synapse</span>
//           </Link>

//           {/* Navigation Links */}
//           <nav className="flex flex-1 flex-col gap-4">
//             {navLinks.map(({ name, href, icon: Icon , FilledIcon: FilledIcon }) => {
//               const isActive = pathname === href;
//               // Note: You'll need to replace the Icon component with the filled version when active
//               return (
//                 <Link
//                   prefetch
//                   key={href}
//                   href={href}
//                   className={cn(
//                     'flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-md transition-all duration-200',
//                     isActive ? ' font-bold text-primary' : 'font-normal'
//                   )}
//                 >
//                   {/* 
//                     When implementing, replace this Icon component with the filled version when isActive is true
//                     For example: isActive ? <FilledIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />
//                   */}
//                   {/* <Icon className="h-6 w-6" /> */}
//                   {
//                     isActive ? <FilledIcon className="h-12 w-12" /> : <Icon className="h-12 w-12" />
//                   }
//                   <span className="hidden lg:block">{name}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* User Section with Dropdown */}
//           <div className="mt-auto pt-4 border-t">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button 
//                   variant="ghost" 
//                   className="w-full flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-md transition-all"
//                 >
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src={profile.profilePhotoURL} alt={profile.username} className="object-cover" />
//                     <AvatarFallback>{profile.username.slice(0,1).toUpperCase()}</AvatarFallback>
//                   </Avatar>
//                   <div className="hidden lg:flex flex-col items-start text-left overflow-hidden">
//                     <span className="font-medium truncate w-40">{profile.username}</span>
//                   </div>
//                   <ChevronUp className="ml-auto hidden lg:block h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuItem asChild>
//                   <Link href={`/${profile.username}`} className="flex items-center gap-2 ">
//                     <User />
//                     <span>Profile</span>
//                   </Link>
//                 </DropdownMenuItem>

//                 <DropdownMenuItem asChild>
//                   <Link href="/settings" className="flex items-center gap-2 ">
//                     <Settings  />
//                     <span>Settings</span>
//                   </Link>
//                 </DropdownMenuItem>

//                 <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex items-center gap-2 ">
//                   {theme === 'light' ? <Moon /> : <Sun />}
//                   <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
//                 </DropdownMenuItem>

//                 <DropdownMenuSeparator/>

//                 <DropdownMenuItem asChild>
//                   <Link href="/signout" className="flex items-center gap-2 ">
//                     <LogoutOutlinedIcon  />
//                     <span>Logout</span>
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
// <ThemeSwitcher/>
//                 </DropdownMenuItem>
                
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile Header */}
//       <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50 shadow-sm">
//         <div className="flex items-center justify-between px-4 h-full">
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
//               alt="Logo"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//             <span className="text-lg font-bold">Synapse</span>
//           </Link>
          
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="h-10 w-10">
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage src={profile.profilePhotoURL} alt={profile.username} className="object-cover" />
//                   <AvatarFallback>{profile.username.slice(0,1).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem asChild>
//                 <Link href={`/${profile.username}`} className="flex items-center gap-2">
//                   <PersonOutlineOutlinedIcon className="h-4 w-4" />
//                   <span>Profile</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/settings" className="flex items-center gap-2">
//                   <SettingsOutlinedIcon className="h-4 w-4" />
//                   <span>Settings</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex items-center gap-2">
//                 {theme === 'light' ? <DarkModeOutlinedIcon className="h-4 w-4" /> : <LightModeOutlinedIcon className="h-4 w-4" />}
//                 <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
//               </DropdownMenuItem>
              
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Mobile Bottom Navigation */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur grid grid-cols-4 z-50 shadow-sm">
//         {navLinks.map(({ href, icon: Icon }) => {
//           const isActive = pathname === href;
//           return (
//             <Link
//               key={href}
//               href={href}
//               className={cn(
//                 'flex flex-col items-center justify-center gap-1 p-2',
//                 isActive 
//                   ? 'text-primary font-bold' 
//                   : 'text-muted-foreground'
//               )}
//             >
//               {/* 
//                 When implementing, replace this Icon component with the filled version when isActive is true
//                 For example: isActive ? <FilledIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />
//               */}
//               <Icon className="h-6 w-6" />
//               <span className="text-xs">{navLinks.find(l => l.href === href)?.name}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </>
//   );
// }



'use client';

import { usePathname } from 'next/navigation';
import { User, Settings, ChevronUp } from 'lucide-react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IoSearch } from "react-icons/io5";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";


export default function SideNavigation() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  if (['/signin', '/signup', '/forgot-password', '/signout'].includes(pathname)) return null;

  if (!profile) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/', icon: HomeOutlinedIcon, FilledIcon : HomeIcon  },
    { name: 'Create', href: '/post/create', icon: AddCircleOutlineIcon, FilledIcon : AddCircleIcon  },
    { name: 'Search', href: '/search', icon: SearchIcon, FilledIcon : IoSearch  },
    { name: 'Notifications', href: '/notifications', icon: NotificationsNoneIcon, FilledIcon : NotificationsIcon  },
  ];

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-20 lg:w-64 border-r bg-background/95  transition-all duration-300 z-10 shadow-sm">
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <Link href="/" className="py-6 flex items-center justify-center lg:justify-start gap-3 mb-6">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-2xl font-bold hidden lg:block">Synapse</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col gap-4">
            {navLinks.map(({ name, href, icon: Icon , FilledIcon: FilledIcon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  prefetch
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-md transition-all duration-200',
                    isActive ? ' font-bold text-primary' : 'font-normal'
                  )}
                >
                  {
                    isActive ? <FilledIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />
                  }
                  <span className="hidden lg:block">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section with Dropdown */}
          <div className="mt-auto pt-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-md transition-all"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.profilePhotoURL} alt={profile.username} className="object-cover" />
                    <AvatarFallback>{profile.username.slice(0,1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start text-left overflow-hidden">
                    <span className="font-medium truncate w-40">{profile.username}</span>
                  </div>
                  <ChevronUp className="ml-auto hidden lg:block h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={`/${profile.username}`} className="flex items-center gap-2 ">
                    <User />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 ">
                    <Settings  />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                {/* Theme Switcher - Changed to submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-2">
                    {theme === 'light' ? <Sun /> : <Moon />}
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
                        <LightModeOutlinedIcon className="h-4 w-4" />
                        <span>Light Mode</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
                        <DarkModeOutlinedIcon className="h-4 w-4" />
                        <span>Dark Mode</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
                        <DevicesOutlinedIcon className="h-4 w-4" />
                        <span>System Theme</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator/>

                <DropdownMenuItem asChild>
                  <Link href="/signout" className="flex items-center gap-2 ">
                    <LogoutOutlinedIcon  />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
                
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-lg font-bold">Synapse</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile.profilePhotoURL} alt={profile.username} className="object-cover" />
                  <AvatarFallback>{profile.username.slice(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/${profile.username}`} className="flex items-center gap-2">
                  <PersonOutlineOutlinedIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <SettingsOutlinedIcon className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              {/* Mobile Theme Switcher - Changed to submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2">
                  {theme === 'light' ? 
                    <LightModeOutlinedIcon className="h-4 w-4" /> : 
                    <DarkModeOutlinedIcon className="h-4 w-4" />
                  }
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
                      <LightModeOutlinedIcon className="h-4 w-4" />
                      <span>Light Mode</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
                      <DarkModeOutlinedIcon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
                      <DevicesOutlinedIcon className="h-4 w-4" />
                      <span>System Theme</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator/>
              <DropdownMenuItem asChild>
                  <Link href="/signout" className="flex items-center gap-2 ">
                    <LogoutOutlinedIcon  />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur grid grid-cols-4 z-50 shadow-sm">
        {navLinks.map(({ href, icon: Icon, FilledIcon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-2',
                isActive 
                  ? 'text-primary font-bold' 
                  : 'text-muted-foreground'
              )}
            >
              {isActive ? <FilledIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
              <span className="text-xs">{navLinks.find(l => l.href === href)?.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}