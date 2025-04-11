
// components/MobileHeader.tsx
'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import Image from 'next/image';

interface MobileHeaderProps {
  UserDropdown: React.ReactNode;
}

export function MobileHeader({ UserDropdown }: MobileHeaderProps) {
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        display: { xs: 'flex', md: 'none' },
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1201,
        backdropFilter: 'blur(8px)',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: 64,
          px: 2,
        }}
      >
        <Link href="/" passHref>
          <Box
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
           <Image src="/synapse_logo.svg" alt="logo" height={32} width={32} />
          </Box>
        </Link>
        {/* User dropdown */}
        {UserDropdown}
      </Toolbar>
    </AppBar>
  );
}
