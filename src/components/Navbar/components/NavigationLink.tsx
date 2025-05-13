
// src/components/Navbar/components/NavigationLink.tsx
'use client';

import Link from 'next/link';
// Assuming NavItem type is defined elsewhere, e.g., src/types.ts
// import { NavItem } from '../types';
import { Box, Typography, Button, useTheme } from '@mui/material';
import React from 'react'; // Import React for types like SvgIconComponent
import { NavItem } from '../types';


interface NavigationLinkProps {
  item: NavItem;
  isActive: boolean;
  isMobile?: boolean;
}

export const NavigationLink = ({ item, isActive, isMobile = false }: NavigationLinkProps) => {
  const Icon = item.icon;
  const theme = useTheme(); // Get the theme object

  if (isMobile) {
    // --- Mobile Version ---
    // Use modern Link - wraps Box directly, no legacyBehavior/passHref
    return (
      <Link href={item.href}  target={item.newTab ? '_blank' : '_self'} >
        <Box
          // No component="a" or href - Link renders the <a> tag
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            p: 1,
            // Use primary color for icon and text when active
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
            fontWeight: isActive ? 'bold' : 'normal',
            // Use a subtle primary background or action.selected for active state
            bgcolor: isActive ? theme.palette.action.selected : 'transparent',
            borderRadius: 1, // Use theme.shape.borderRadius if preferred
            textDecoration: 'none', // Style the link appearance
            boxShadow: "none",
            width: '100%', // Ensure Box takes available width if needed
            '&:hover': { // Add hover style for mobile
              bgcolor: isActive ? theme.palette.action.selected : theme.palette.action.hover,
            }
          }}
        >
          <Icon style={{ width: 24, height: 24 }} />
          <Typography variant="caption" sx={{ color: 'inherit' }}> {/* Ensure typography inherits color */}
            {item.name}
          </Typography>
        </Box>
      </Link>
    );
  }

  // --- Desktop Version ---
  // Use modern Link - wraps Button directly, no legacyBehavior/passHref
  return (
    <Link href={item.href} target={item.newTab ? '_blank' : '_self'} >
      <Button
        // No component="a" or href - Link renders the <a> tag
        startIcon={<Icon style={{ width: 24, height: 24 }} />}
        sx={{
          justifyContent: {
            xs: 'center',
            lg: 'flex-start',
          },
          py: { xs: 2, lg: 1.5 },
          px: 2,
          // --- MODIFICATION HERE ---
          // Apply rounding only to the right corners
          // Format: top-left top-right bottom-right bottom-left
          borderRadius: '0 50px 50px 0', // Changed from: borderRadius: 20,
          // --- END MODIFICATION ---
          bgcolor: isActive ? theme.palette.action.selected : 'transparent',
          color: isActive
          ? theme.palette.primary.main
          : theme.palette.mode === 'dark'
            ? '#a2a9b0'
            : '#575b5f',
          width: '100%',
          '&:hover': {
            boxShadow: 'none',
            bgcolor: isActive ? theme.palette.action.selected : theme.palette.action.hover,
          }
        }}
      >
        <Typography
          variant="body1"
          sx={{
            display: { xs: 'none', lg: 'block' }, // Hide text on small screens, show on large
            fontSize: '1rem', // Font size for the text
            color: 'inherit', // Explicitly inherit color from Button
            textAlign: 'left', // Ensure text aligns left inside the button
            flexGrow: 1, 
            fontWeight: isActive ? 'bold': 'normal', 
          }}
        >
          {item.name}
        </Typography>
      </Button>
    </Link>
  );
};

