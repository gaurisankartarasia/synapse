

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

  return (
    <ProgressProvider
      height="4px"
      color="#29d"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export  {ProgressBar};







