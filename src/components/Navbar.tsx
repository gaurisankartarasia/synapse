// //components/Navbar.tsx
// import Link from "next/link"
// import LogoutButton from "@/app/(auth)/logoutButton";

// export default function Navbar(){
//     return(


// <nav className="bg-white border-gray-200 dark:bg-gray-900">
// <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//   <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
//       <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt=" Logo" />
//       <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Synapse</span>
//   </Link>
//   <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
//       <span className="sr-only">Open main menu</span>
//       <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
//           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
//       </svg>
//   </button>
//   <div className="hidden w-full md:block md:w-auto" id="navbar-default">
//     <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//     <li>
//         <Link href="/post/create" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Create</Link>
//       </li>
//       <li>
//         <Link href="/search" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Search</Link>
//       </li>
//       <li>
//         <Link href="/profile" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Profile</Link>
//       </li>
//       <li>
//         <LogoutButton/>
//       </li>
//     </ul>
//   </div>
// </div>
// </nav>

//     )
// }





'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CloseIcon from '@mui/icons-material/Close';
import LogoutButton from '@/app/(auth)/logoutButton'

type NavLink = {
  name: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { name: 'Create', href: '/post/create' },
  { name: 'Search', href: '/search' },
  { name: 'Profile', href: '/profile' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white border-b">
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
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuOpenIcon className="h-6 w-6" />
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