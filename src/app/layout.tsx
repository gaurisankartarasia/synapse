
// // app/layout.tsx
// import type { Metadata } from "next";
// import {ReduxProvider} from './ReduxProvider'
// import AuthProvider from './(auth)/AuthProvider'
// import "./globals.css";
// import  Navbar  from "@/components/Navbar";
// // import { LoadingProvider } from '@/components/LoadingProvider';
// import { ThemeProvider } from 'next-themes'



// export const metadata: Metadata = {
//   title: "Synapse",
//   description: "Synapse",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // const pageLoadKey = typeof window !== 'undefined' ? Date.now().toString() : '0';

//   return (
//     <html lang="en">
//       <body
//         className={` antialiased`}
//       >
//                  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//    <ReduxProvider>
//           {/* <AuthProvider> */}
//             {/* <LoadingProvider key={pageLoadKey}> */}
                         

//               <Navbar /> 
//               {children}

//             {/* </LoadingProvider> */}
//           {/* </AuthProvider> */}
//         </ReduxProvider>              </ThemeProvider>

//       </body>
//     </html>
//   );
// }





// app/layout.tsx
import type { Metadata } from "next";
import { ReduxProvider } from './ReduxProvider'
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProviderWrapper from './ThemeProviderWrapper';

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
            <Navbar />
            {children}
          </ReduxProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}