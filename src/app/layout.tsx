


// "use client";

// import { Inter } from "next/font/google";
// import { usePathname } from 'next/navigation';
// import Navbar from '../components/Navbar';
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const pathname: string | null = usePathname();
//   const safePathname: string = pathname ?? ''; 

//   const noNavRoutes = ['/login']; 

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {!noNavRoutes.includes(safePathname) && <Navbar />}
//         {children}
//       </body>
//     </html>
//   );
// }





"use client";

import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import useNavigationProgress from './hooks/useNavigationProgress'; // Import the custom hook
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const safePathname = pathname ?? '';

  const noNavRoutes = ['/login'];


  useNavigationProgress(); 
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>

        {!noNavRoutes.includes(safePathname) && <Navbar />}
        {children}
      </body>
    </html>
  );
}
