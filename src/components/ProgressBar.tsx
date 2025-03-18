// 'use client';
 
// import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
 
// const ProgressBar = ({ children }: { children: React.ReactNode }) => {

//   return (
//     <ProgressProvider 
//       height="4px"
//       color="#29d"
//       options={{ showSpinner: false }}
//       shallowRouting
//     >
//       {children}
//     </ProgressProvider>
//   );
// };
 
// export  {ProgressBar};

"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { BProgress } from "@bprogress/core";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes"; // Detect dark/light mode

const ProgressBar = ({ children }: { children: React.ReactNode }) => {
  const { theme, systemTheme } = useTheme(); // Get the current theme
  const [mounted, setMounted] = useState(false); // Track if component is mounted

  useEffect(() => {
    setMounted(true); // Set mounted to true after client-side rendering
    BProgress.configure({
      minimum: 0.99, // Jump to 60% immediately
      maximum: 1,
      showSpinner: false, // Hide spinner
      speed: 300, // Fast transition
      trickle: false, // No slow trickling
    });
  }, []);

  // Get the correct theme after mounting (avoids hydration error)
  const currentTheme = theme === "system" ? systemTheme : theme;
  const progressColor = currentTheme === "dark" ? "#fff" : "#000"; // White for dark mode, black for light mode

  return (
    <ProgressProvider
      height="4px"
      color={mounted ? progressColor : "transparent"} // Avoid SSR mismatch
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export  {ProgressBar};
