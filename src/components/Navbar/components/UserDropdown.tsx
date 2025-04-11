
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Menu, MenuItem, Divider, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ThemeMenu } from './ThemeMenu';

interface UserDropdownProps {
  dropdownItems: {
    name: string;
    href?: string;
    onClick?: () => void;
    icon: React.ElementType;
  }[];
  theme: string | undefined;
  setTheme: (theme: string) => void;
  isMobile?: boolean;
}

export default function UserDropdown({
  dropdownItems,
  theme,
  setTheme,
  isMobile = false,
}: UserDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isMobile ? (
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Button
          color="inherit"
          startIcon={<MenuIcon />}
          onClick={handleClick}
          sx={{ textTransform: 'none', width:'100%',

           
        }}
        >
          <span>More</span>
        </Button>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {dropdownItems.map((item) => (
          <MenuItem
            key={item.name}
            onClick={() => {
              handleClose();
              item.onClick?.();
            }}
            component={item.href ? Link : 'div'}
            href={item.href}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <item.icon fontSize="small" />
            {item.name}
          </MenuItem>
        ))}
        <Divider />
        <ThemeMenu theme={theme} setTheme={setTheme} onClose={handleClose} />
      </Menu>
    </>
  );
}
