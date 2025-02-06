// import type { Metadata } from "next";
// import {ReduxProvider} from './ReduxProvider'
// import AuthProvider from './(auth)/AuthProvider'
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Navbar } from "@/components/Navbar";
// import { LoadingProvider, useLoading } from '@/components/LoadingProvider';


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Synapse",
//   description: "Synapse",
// };

// export default function RootLayout({
  
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {



//   return (
//     <>
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ReduxProvider>
//           <AuthProvider>
//             <LoadingProvider>
//             <Navbar/>
//         {children}
//         </LoadingProvider>
//         </AuthProvider>
//         </ReduxProvider>
//       </body>
//     </html>
//     </>
//   );
// }








// app/layout.tsx
import type { Metadata } from "next";
import {ReduxProvider} from './ReduxProvider'
import AuthProvider from './(auth)/AuthProvider'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Navbar  from "@/components/Navbar";
// import { LoadingProvider } from '@/components/LoadingProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            {/* <LoadingProvider key={pageLoadKey}> */}
              <Navbar />
              {children}
            {/* </LoadingProvider> */}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}