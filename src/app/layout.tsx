
"use client";
import React, {useEffect} from 'react'
import useNavigationProgress from '../hooks/useNavigationProgress'; 
import "./globals.css";
import { Providers } from "./providers";
import NavbarApp from '@/components/Navbar';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  useNavigationProgress();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <title>Synapse</title>
      </head>
      <body className={`flat text-foreground bg-background min-h-screen`}>        <Providers>
          <main>
            
<NavbarApp/>
            {children}
            
          </main>
        </Providers>
      </body>
    </html>
  );
}

