
"use client";

import React from "react";
import PostPage from '../post/page';
import PostUploadComponent from '@/components/upload/post/post';
// import UploadModal from './create/post/Modal'
  



export default function Feed() {

 
  return (
    <>
   
    <main className=" container mx-auto"> 
      {/* <UploadModal/>     */}
     <PostUploadComponent/>
    <PostPage/>
    </main>
    </>
  );
}
