"use client";



import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <nav className="border dark:bg-gray-900">
  <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
      {/* <Image src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/Assets%2FGemini_Generated_Image_8gnxqb8gnxqb8gnx.jpeg?alt=media&token=6ddc2155-9f5c-4288-afe5-b7f6f562da30"
       className="rounded-full" 
      alt="Logo" 
      width={40}
      height={40}
      priority
      /> */}
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white logo">Quixxle</span>
    </Link>
    <div className="flex items-center space-x-6 rtl:space-x-reverse">
      {/* <a href="tel:5541251234" className="text-sm  text-gray-500 dark:text-white hover:underline">(555) 412-1234</a> */}
      <Link href="/profile" className="text-sm  text-blue-600 dark:text-blue-500 hover:underline">Account</Link>
    </div>
  </div>
</nav>
<nav className="dark:bg-gray-700 nav">
  <div className="max-w-screen-xl px-4 py-3 mx-auto">
    <div className="flex items-center">
      <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
      <Link href="/" aria-current="page">
        <li>
         <p>Home</p>
        </li>
        </Link>

        <Link href="/notifications">
        <li>
         <p>Notifications</p>
        </li>
        </Link>

       <Link  href="/search">
       <li>
          <p >Search</p>
        </li>
        </Link>
        <Link href="/settings" >
        <li>
      <p>Settings</p>

        </li>
        </Link>
        
        <Link href="/profile">
        <li>
         <p>Profile</p>
        </li>
        </Link>
      </ul>
    </div>
  </div>
</nav>
</>
  );
};

export default Navbar;
