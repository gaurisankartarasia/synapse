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
import { useTheme } from "next-themes"; 

const ProgressBar = ({ children }: { children: React.ReactNode }) => {
  const { theme, systemTheme } = useTheme(); 
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true); 
    BProgress.configure({
      minimum: 0.99,
      maximum: 1,
      showSpinner: false, 
      speed: 200, 
      trickle: false, 
    });
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const progressColor = currentTheme === "dark" ? "#fff" : "#000"; 

  return (
    <ProgressProvider
      height="4px"
      color={mounted ? progressColor : "transparent"} 
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export  {ProgressBar};
