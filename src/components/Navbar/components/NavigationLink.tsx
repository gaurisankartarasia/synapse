// components/NavigationLink.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavItem } from '../types';

interface NavigationLinkProps {
  item: NavItem;
  isActive: boolean;
  isMobile?: boolean;
}

export const NavigationLink = ({ item, isActive, isMobile = false }: NavigationLinkProps) => {
  const Icon = isActive ? item.FilledIcon : item.icon;
  
  if (isMobile) {
    return (
      <Link
        href={item.href}
        className={cn(
          'flex flex-col items-center justify-center gap-1 p-2',
          isActive ? 'text-primary font-bold' : 'text-muted-foreground'
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-xs">{item.name}</span>
      </Link>
    );
  }

  return (
    <Link
      prefetch
      href={item.href}
      className={cn(
        'flex items-center justify-center lg:justify-start gap-4 py-4 lg:py-3 px-3 hover:bg-accent',
        isActive ? 'font-bold text-primary' : 'font-normal'
      )}
    >
      <Icon />
      <span className="hidden lg:block">{item.name}</span>
    </Link>
  );
};