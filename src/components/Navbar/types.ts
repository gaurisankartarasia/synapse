// types.ts

import { SvgIconComponent } from '@mui/icons-material';

export interface NavItem {
  name: string;
  href: string;
  icon:  SvgIconComponent  ;
}

export interface DropdownItem {
  name: string;
  href?: string;
  icon: SvgIconComponent ;
  onClick?: () => void;
  items?: DropdownItem[];
}

