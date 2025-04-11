// config.ts



import { NavItem, DropdownItem } from './types';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export const navLinks: NavItem[] = [
  
  { name: 'Home', href: '/', icon: HomeOutlinedIcon },
  { name: 'Create', href: '/post/create', icon: CreateOutlinedIcon},
  { name: 'Search', href: '/search', icon: SearchOutlinedIcon },
  { name: 'Messages', href: '/inbox', icon: ForumOutlinedIcon},
  { name: 'Notifications', href: '/notifications', icon: NotificationsOutlinedIcon},
  { name: 'AI', href: '/ai/message', icon: AssistantOutlinedIcon},
  { name: 'Jobs', href: '/jobs', icon: WorkOutlineOutlinedIcon},
  { name: 'Store', href: '/store', icon: StorefrontOutlinedIcon},

];

export const createDropdownItems = (profile: any, setTheme: (theme: string) => void): DropdownItem[] => [
  {
    name: 'Profile',
    href: `/${profile.username}`,
    icon: PersonOutlinedIcon
  },
  {
    name: 'Your activity',
    href: '/settings/activity/liked',
    icon: TimelineOutlinedIcon
  },
  {
    name: 'Saved',
    href: '/settings/activity/saved',
    icon: BookmarkAddedOutlinedIcon
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: SettingsOutlinedIcon
  },
 
  {
    name: 'Logout',
    href: '/signout',
    icon: LogoutOutlinedIcon
  }
];