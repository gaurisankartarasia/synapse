// types.ts
import { LucideIcon } from 'lucide-react';
import { SvgIconComponent } from '@mui/icons-material';
import { IconType } from 'react-icons';

export interface NavItem {
  name: string;
  href: string;
  icon: SvgIconComponent | IconType;
  FilledIcon: SvgIconComponent | IconType;
}

export interface DropdownItem {
  name: string;
  href?: string;
  icon: LucideIcon | SvgIconComponent;
  onClick?: () => void;
  items?: DropdownItem[];
}