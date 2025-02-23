
'use client';

import { usePathname } from 'next/navigation';
import { Home, Plus, Search, Bell, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/app/(auth)/logoutButton';
import { Sun, Moon } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Create', href: '/post/create', icon: Plus },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function SideNavigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  if (['/signin', '/signup', '/forgot-password'].includes(pathname)) return null;

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-16 lg:w-64 border-r bg-background/95 transition-all duration-300 z-50">
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <b className='text-2xl hidden lg:block'>Synapse</b>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col gap-4">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-4 p-2 rounded-md hover:bg-accent active:scale-95 transition-all duration-300 ',
                  pathname === href && 'bg-accent'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="hidden lg:block text-sm">{name}</span>
              </Link>
            ))}
          </nav>

          {/* Settings Section */}
          <div className="flex flex-col gap-4 items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-full"
            >
              Switch theme
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <div className="hidden lg:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/" className='flex items-center'>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2Fsynapse_logo_c.jpg?alt=media&token=53517ee9-01a4-4e3c-87dc-f34de9a88193"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <b className='text-lg'>Synapse</b>
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur grid grid-cols-5 z-50">
        {navLinks.map(({ href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center justify-center p-2',
              pathname === href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="sr-only">{navLinks.find(l => l.href === href)?.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}