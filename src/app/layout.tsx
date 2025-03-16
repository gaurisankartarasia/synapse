

import type { Metadata } from "next";
import { ReduxProvider } from './ReduxProvider'
import "./globals.css";
import ThemeProviderWrapper from './ThemeProviderWrapper';
import { ProgressBar } from '@/components/ProgressBar';
import { Toaster } from "@/components/ui/sonner"
// import { LoadingProvider } from "@/components/LoadingProvider";
import SideNavigation from '../components/Navbar/Navbar'

export const metadata: Metadata = {
  title: "Synapse",
  description: "Synapse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
       <ThemeProviderWrapper>

          <ReduxProvider>
            {/* <LoadingProvider> */}
            <ProgressBar >
            <SideNavigation />
            <main className="md:ml-16 lg:ml-64 pb-16 md:pb-0 pt-14" >
                {children}
            </main>
            </ProgressBar> 
                    <Toaster />
                    {/* </LoadingProvider> */}
          </ReduxProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}



