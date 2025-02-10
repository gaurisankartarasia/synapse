
// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// // import Image from 'next/image';
// import { usePathname, useRouter } from 'next/navigation';
// import Menu from '@mui/icons-material/MenuOpen';
// import { X } from 'lucide-react';

// import LogoutButton from '@/app/(auth)/logoutButton'

// type NavLink = {
//   name: string;
//   href: string;
// };

// const NAV_LINKS: NavLink[] = [
//   { name: 'Create', href: '/post/create' },
//   { name: 'Search', href: '/search/' },
//   { name: 'Profile', href: '/profile/' },
// ];

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();
//   // const router = useRouter();

//   // Close mobile menu on path change
//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   return (
//     <nav className="bg-white border-b sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//          <div className='flex items-center gap-2'>
        
//           <Link href="/" className="text-xl font-bold text-gray-800">
//             Synapse
//           </Link>
//          </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex space-x-8">
//             {NAV_LINKS.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`${
//                   pathname === link.href
//                     ? 'text-blue-600 border-b-2 border-blue-600'
//                     : 'text-gray-600 hover:text-blue-600'
//                 } px-1 transition-colors duration-200`}
//               >
//                 {link.name}
//               </Link>
//             ))}
//             <LogoutButton/>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? (
//               <CloseIcon className="h-6 w-6" />
//             ) : (
//               <Menu className="h-6 w-6" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden fixed inset-0 bg-white z-50 mt-16">
//             <div className="px-4 pt-2 pb-3 space-y-1">
//               {NAV_LINKS.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`${
//                     pathname === link.href
//                       ? 'bg-blue-50 text-blue-600'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   } block px-4 py-2 rounded-md transition-colors duration-200`}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               <LogoutButton/>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }






'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { usePathname } from 'next/navigation'; //  use useRouter is deprecated for this.
import { X, Menu } from 'lucide-react';

import LogoutButton from '@/app/(auth)/logoutButton';


type NavLink = {
  name: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { name: 'Create', href: '/post/create' },
  { name: 'Search', href: '/search' },
  { name: 'Notifications', href: '/notifications' },
  { name: 'Profile', href: '/profile' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check if the current path is /signin or /signup
  const shouldHideNavbar = pathname === '/signin' || pathname === '/signup';

  // If we should hide the navbar, return null (don't render anything)
  if (shouldHideNavbar) {
    return null;
  }

  // Otherwise, render the navbar as usual
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
         <div className='flex items-center gap-2'>
          <Link href="/" className="text-xl font-bold text-gray-800">
            Synapse
          </Link>
         </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                } px-1 transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
            <LogoutButton/>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 mt-16">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  } block px-4 py-2 rounded-md transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              ))}
              <LogoutButton/>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}