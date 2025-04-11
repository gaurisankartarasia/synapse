// src/ThemeProviderWrapper.tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme as useNextTheme } from 'next-themes';
import { lightThemeOptions } from '@/theme/light'
import {darkThemeOptions} from '@/theme/dark'

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
  const { resolvedTheme } = useNextTheme(); // 'resolvedTheme' accounts for 'system' preference
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by delaying theme creation until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const muiTheme = useMemo(() => {
    // Determine which theme options to use based on resolvedTheme
    const currentThemeOptions = resolvedTheme === 'dark' ? darkThemeOptions : lightThemeOptions;
    // Create the MUI theme
    return createTheme(currentThemeOptions);
  }, [resolvedTheme]); // Recreate the theme only when resolvedTheme changes

  // Render placeholder or light theme initially to avoid flash of unstyled content (FOUC)
  // or mismatch during server rendering vs client hydration.
  if (!mounted) {
      // Optional: Render a basic theme or null during server render/initial mount
      // to prevent mismatch. Using lightThemeOptions is common.
      // Or return null if you handle loading state elsewhere.
       const initialTheme = createTheme(lightThemeOptions);
       return (
          <MuiThemeProvider theme={initialTheme}>
             <CssBaseline /> {/* Normalize CSS and apply background color */}
             {/* You might want a loading indicator here instead of children */}
             {/* {children} */}
          </MuiThemeProvider>
       );
  }


  return (
    <MuiThemeProvider theme={muiTheme}>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      {/* It also applies the background color from the theme's palette. */}
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProviderWrapper;