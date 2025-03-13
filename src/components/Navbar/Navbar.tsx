'use client';

import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
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
} from "@/components/ui/dropdown-menu";
import { NavigationLink } from './components/NavigationLink';
import { ThemeMenu } from './components/ThemeMenu';
import { navLinks, createDropdownItems } from './config';

export default function SideNavigation() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  if (['/signin', '/signup', '/forgot-password', '/signout'].includes(pathname)) return null;
  if (!profile) return null;

  const dropdownItems = createDropdownItems(profile, setTheme);

  const renderDropdownItems = (items: any[]) => (
    items.map(item => (
      item.href ? (
        <DropdownMenuItem key={item.name} asChild>
          <Link href={item.href} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem key={item.name} onClick={item.onClick}>
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
        </DropdownMenuItem>
      )
    ))
  );

  const UserDropdown = ({ isMobile = false }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            isMobile ? "h-10 w-10" : "w-full flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent/50 rounded-md transition-all"
          )}
        >
          <Avatar className={cn(isMobile ? "h-9 w-9" : "h-10 w-10")}>
            <AvatarImage src={profile.profilePhotoURL} alt={profile.username} className="object-cover" />
            <AvatarFallback>{profile.username.slice(0,1).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!isMobile && (
            <>
              <div className="hidden lg:flex flex-col items-start text-left overflow-hidden">
                <span className="font-medium truncate w-40">{profile.username}</span>
              </div>
              <ChevronUp className="ml-auto hidden lg:block h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {renderDropdownItems(dropdownItems)}
        <DropdownMenuSeparator />
        <ThemeMenu theme={theme} setTheme={setTheme} />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-20 lg:w-64 border-r bg-background/95 transition-all duration-300 shadow-sm">
        <div className="flex flex-col h-full p-4">
          <Link href="/" className="py-6 flex items-center justify-center lg:justify-start gap-3 mb-6">
            <Image src="/favicon.ico" alt="Logo" width={30} height={30} className="rounded-full" />
            <span className="text-2xl font-semibold hidden lg:block">Synapse</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-4">
            {navLinks.map((item) => (
              <NavigationLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t">
            <UserDropdown />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="rounded-full" />
            <span className="text-lg font-bold">Synapse</span>
          </Link>
          <UserDropdown isMobile />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur grid grid-cols-4 z-50 shadow-sm">
        {navLinks.map((item) => (
          <NavigationLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            isMobile
          />
        ))}
      </nav>
    </>
  );
}