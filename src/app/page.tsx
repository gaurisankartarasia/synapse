
"use client";

import React from "react";
// import NavbarApp from '@/components/Navbar';
import Feed from './feed/page';
// import UsersPage from "./users/page";
import './globals.css'


export default function Home() {

 
  return (
    <>
    {/* <NavbarApp/> */}
    <div className="container mx-auto flex ">
   <div className="hidden">    
{/* <UsersPage/> */}
</div>  
      <Feed/>

    </div>
    </>
  );
}
