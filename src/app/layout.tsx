// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
// import { Roboto } from "next/font/google";
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "../muiConfig";

// import type { Metadata } from "next";
// import { ReduxProvider } from "./ReduxProvider";
// import "./globals.css";
// import ThemeProviderWrapper from "./ThemeProviderWrapper";
// import { ProgressBar } from "@/components/ProgressBar";
// // import { LoadingProvider } from "@/components/LoadingProvider";
// import SideNavigation from "../components/Navbar/Navbar";

// export const metadata: Metadata = {
//   title: "Synapse",
//   description: "Synapse",
// };

// const roboto = Roboto({
//   weight: ["300", "400", "500", "700"],
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-roboto",
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning className={roboto.variable}>
//       <body className="antialiased">
//         <AppRouterCacheProvider>
//           <ThemeProvider theme={theme}>
//             <ThemeProviderWrapper>
//               <ReduxProvider>
//                 {/* <LoadingProvider> */}
//                 <ProgressBar>
                  
//                   <SideNavigation />
//                   <main className="md:ml-16 lg:ml-80 p-3 md:pb-0 ">
//                     {children}
//                   </main>
//                 </ProgressBar>
//                 {/* </LoadingProvider> */}
//               </ReduxProvider>
//             </ThemeProviderWrapper>
//           </ThemeProvider>
//         </AppRouterCacheProvider>
//       </body>
//     </html>
//   );
// }






// src/app/layout.tsx
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
// Remove the direct MUI ThemeProvider import here
// import { ThemeProvider } from "@mui/material/styles";
// Remove the direct theme import here
// import theme from "../muiConfig";

import type { Metadata } from "next";
import { ReduxProvider } from "./ReduxProvider";
import "./globals.css";

// Import the next-themes Provider
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// Import your wrapper
import ThemeProviderWrapper from "./ThemeProviderWrapper"; // Adjust path if needed

import { ProgressBar } from "@/components/ProgressBar";
import SideNavigation from "../components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Synapse",
  description: "Synapse",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning if you see hydration warnings related to theme
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      <body className="antialiased">
        {/* AppRouterCacheProvider is specific to MUI & Next.js App Router */}
        <AppRouterCacheProvider>
          {/* 1. NextThemesProvider: Manages light/dark/system state */}
          <NextThemesProvider
            attribute="class" // Use class (e.g., <html class="dark">) or data-attribute
            defaultTheme="system" // Default to user's system preference
            enableSystem
            // storageKey='theme' // Optional: Customize local storage key
          >
            {/* 2. ThemeProviderWrapper: Creates & provides the correct MUI theme */}
            <ThemeProviderWrapper>
              {/* ReduxProvider and other global providers */}
              <ReduxProvider>
                  <ProgressBar>
                    <SideNavigation />
                    <main className="md:ml-16 lg:ml-80 p-3 md:pb-0 ">
                      {children}
                    </main>
                  </ProgressBar>
              </ReduxProvider>
            </ThemeProviderWrapper>
          </NextThemesProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}