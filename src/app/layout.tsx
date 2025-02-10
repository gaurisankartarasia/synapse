
// app/layout.tsx
import type { Metadata } from "next";
import {ReduxProvider} from './ReduxProvider'
import AuthProvider from './(auth)/AuthProvider'
import "./globals.css";
import  Navbar  from "@/components/Navbar";
// import { LoadingProvider } from '@/components/LoadingProvider';



export const metadata: Metadata = {
  title: "Synapse",
  description: "Synapse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pageLoadKey = typeof window !== 'undefined' ? Date.now().toString() : '0';

  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <ReduxProvider>
          {/* <AuthProvider> */}
            {/* <LoadingProvider key={pageLoadKey}> */}
              <Navbar />
              {children}
            {/* </LoadingProvider> */}
          {/* </AuthProvider> */}
        </ReduxProvider>
      </body>
    </html>
  );
}