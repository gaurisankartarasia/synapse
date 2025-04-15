// types.ts

import { SvgIconComponent } from '@mui/icons-material';
import React from 'react';

export interface NavItem {
  name: string;
  href: string;
  icon:  React.ElementType  ;
}

export interface DropdownItem {
  name: string;
  href?: string;
  icon: SvgIconComponent ;
  onClick?: () => void;
  items?: DropdownItem[];
}

