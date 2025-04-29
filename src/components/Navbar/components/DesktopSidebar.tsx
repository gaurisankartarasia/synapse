
// components/DesktopSidebar.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Divider, Drawer, Stack } from '@mui/material';
import { NavigationLink } from './NavigationLink'; // Assuming correct path
import { useTheme } from '@mui/material';
import { NavItem } from '../types';


interface DesktopSidebarProps {
  navLinks: NavItem[]; // Use the defined NavItem type
  pathname: string;
  profileNavItem: NavItem; // Use the defined NavItem type
  UserDropdown: React.ReactNode;
}

export function DesktopSidebar({
  navLinks,
  pathname,
  profileNavItem,
  UserDropdown,
}: DesktopSidebarProps) {
  const theme = useTheme();

  // Helper function to determine active state
  const checkIsActive = (itemHref: string): boolean => {
    // Handle the root path ('/') separately: only active if it's an exact match.
    if (itemHref === '/') {
      return pathname === '/';
    }
    // For other paths, check for exact match OR if the pathname starts with the href + '/'
    // This prevents '/in' matching '/inbox' if '/in' was a link.
    return pathname === itemHref || pathname.startsWith(itemHref + '/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: { lg: 320, md: 80 },
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: { lg: 270, md: 80 },
          boxSizing: 'border-box',
          border: 'none',
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Link href="/" passHref className='my-4'>
          <Box
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', lg: 'flex-start' },
            }}
          >
            {theme.palette.mode === 'dark' ? (
              <Image src="/assets/synapse_dark.png" alt="logo" height={100} width={100} />
            ) : (
              <Image src="/assets/synapse_light.png" alt="logo" height={100} width={100} />
            )}
          </Box>
        </Link>

        {/* Nav Items */}
        <Stack spacing={1} flex={1}>
          {navLinks.map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              // Use the helper function for the active check
              isActive={checkIsActive(item.href)}
            />
          ))}
          {/* Apply the same logic to the profileNavItem if it should also match sub-paths */}
          <NavigationLink
            key={profileNavItem.href}
            item={profileNavItem}
             // Use the helper function for the active check
            isActive={checkIsActive(profileNavItem.href)}
          />
        </Stack>

        {/* Footer / Dropdown */}
        <Divider sx={{ mt: 2 }} />
        <Box sx={{ mt: 'auto', pt: 2 }}>{UserDropdown}</Box>
      </Box>
    </Drawer>
  );
}


