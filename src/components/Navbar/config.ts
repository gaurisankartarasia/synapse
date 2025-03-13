// config.ts
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IoSearch } from "react-icons/io5";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { User, Settings } from 'lucide-react';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { NavItem, DropdownItem } from './types';


export const navLinks: NavItem[] = [
  
  { name: 'Home', href: '/', icon: HomeOutlinedIcon, FilledIcon: HomeIcon },
  { name: 'Create', href: '/post/create', icon: AddCircleOutlineIcon, FilledIcon: AddCircleIcon },
  { name: 'Search', href: '/search', icon: SearchIcon, FilledIcon: IoSearch },
  { name: 'Messages', href: '/inbox', icon: ChatBubbleOutlineIcon, FilledIcon: ChatBubbleIcon },
  { name: 'Notifications', href: '/notifications', icon: NotificationsNoneIcon, FilledIcon: NotificationsIcon },
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
    icon: Settings
  },
  {
    name: 'Developers',
    href: '/developers',
    icon: PersonOutlinedIcon
  },
  {
    name: 'Logout',
    href: '/signout',
    icon: LogoutOutlinedIcon
  }
];