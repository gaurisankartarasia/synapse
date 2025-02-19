
// app/layout.tsx
import type { Metadata } from "next";
import { ReduxProvider } from './ReduxProvider'
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProviderWrapper from './ThemeProviderWrapper';
import { LoadingProvider } from '@/components/LoadingProvider';

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
            <LoadingProvider>
            <Navbar />
            
            {children}
            </LoadingProvider>
          </ReduxProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}