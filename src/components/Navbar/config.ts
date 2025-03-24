// config.ts


import { User, Settings, House, Search, MessageCircle, Bell, Bot,BriefcaseBusiness,ShoppingBag, Activity, Bookmark, Code2, LogOut, PenLine } from 'lucide-react';

import { NavItem, DropdownItem } from './types';


export const navLinks: NavItem[] = [
  
  { name: 'Home', href: '/', icon: House },
  { name: 'Create', href: '/post/create', icon: PenLine},
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Messages', href: '/inbox', icon: MessageCircle},
  { name: 'Notifications', href: '/notifications', icon: Bell},
  { name: 'AI', href: '/ai/message', icon: Bot},
  { name: 'Jobs', href: '/jobs', icon: BriefcaseBusiness},
  { name: 'Store', href: '/store', icon: ShoppingBag},

];

export const createDropdownItems = (profile: any, setTheme: (theme: string) => void): DropdownItem[] => [
  {
    name: 'Profile',
    href: `/${profile.username}`,
    icon: User
  },
  {
    name: 'Your activity',
    href: '/settings/activity/liked',
    icon: Activity
  },
  {
    name: 'Saved',
    href: '/settings/activity/saved',
    icon: Bookmark
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  // {
  //   name: 'Developers',
  //   href: '/developers',
  //   icon: Code2
  // },
  {
    name: 'Logout',
    href: '/signout',
    icon: LogOut
  }
];