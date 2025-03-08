

import type { Metadata } from "next";
import { ReduxProvider } from './ReduxProvider'
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProviderWrapper from './ThemeProviderWrapper';
import { ProgressBar } from '@/components/ProgressBar'; // Adjust the import path as necessary
import { Toaster } from "@/components/ui/sonner"
// import { LoadingProvider } from "@/components/LoadingProvider";

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
            <Navbar />
            <main className="md:ml-16 lg:ml-64 pb-16 md:pb-0 pt-14" >
              <div className="max-w-7xl mx-auto px-0 lg:px-4">
                {children}
              </div>
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



