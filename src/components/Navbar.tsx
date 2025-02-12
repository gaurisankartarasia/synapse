
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { X, Menu, Sun, Moon } from 'lucide-react';
// import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';
// import LogoutButton from '@/app/(auth)/logoutButton';
// import PageLoader from './PageLoader';

// const NAV_LINKS = [
//   { name: 'Create', href: '/post/create' },
//   { name: 'Search', href: '/search' },
//   { name: 'Notifications', href: '/notifications' },
//   { name: 'Profile', href: '/profile' },
// ];

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   const shouldHideNavbar = pathname === '/signin' || pathname === '/signup';

//   if (shouldHideNavbar) {
//     return null;
//   }

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle('dark', !isDarkMode);
//   };

//   return (
//     <nav className="bg-white dark:bg-gray-800 border-b sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
//             Synapse
//           </Link>

//           <div className="hidden md:flex space-x-8 items-center">
//             <NavigationMenu>
//               <NavigationMenuList className="flex space-x-4">
//                 {NAV_LINKS.map((link) => (
//                   <NavigationMenuItem key={link.href}>
//                     <Link
//                       href={link.href}
//                       className={`${
//                         pathname === link.href
//                           ? 'text-blue-600 border-b-2 border-blue-600'
//                           : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
//                       } px-1 transition-colors duration-200`}
//                     >
//                       {link.name}
//                     </Link>
//                   </NavigationMenuItem>
//                 ))}
//               </NavigationMenuList>
//             </NavigationMenu>
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
//               aria-label="Toggle theme"
//             >
//               {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
//             </button>
//             <LogoutButton />
//           </div>

//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {isOpen && (
//           <div className="md:hidden fixed inset-0 bg-white dark:bg-gray-800 z-50 mt-16">
//             <div className="px-4 pt-2 pb-3 space-y-1">
//               {NAV_LINKS.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`${
//                     pathname === link.href
//                       ? 'bg-blue-50 dark:bg-blue-900 text-blue-600'
//                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   } block px-4 py-2 rounded-md transition-colors duration-200`}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               <button
//                 onClick={toggleTheme}
//                 className="w-full text-left px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
//               >
//                 {isDarkMode ? 'Light Mode' : 'Dark Mode'}
//               </button>
//               <LogoutButton />
//             </div>
//           </div>
//         )}
//       </div>
//       <PageLoader />
//     </nav>
//   );
// }









'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import LogoutButton from '@/app/(auth)/logoutButton';
// import PageLoader from './PageLoader';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';


type NavLink = {
  name: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { name: 'Create', href: '/post/create' },
  { name: 'Search', href: '/search' },
  { name: 'Notifications', href: '/notifications' },
  { name: 'Profile', href: '/profile' },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const shouldHideNavbar = pathname === '/signin' || pathname === '/signup';

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Synapse</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-between md:flex">
          <div className="flex items-center space-x-6 px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="ml-2" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <LogoutButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* <PageLoader /> */}
      <ProgressBar
        height="4px"
        color="#29D"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </nav>
  );
}