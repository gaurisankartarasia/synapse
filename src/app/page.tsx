"use client";

import PostPage from "./post/page";
import UserSuggestions from "@/components/UserSuggestions/UserSuggestions";
// import ImageUpload from '@/components/Story/ImageUpload'
import StoriesContainer from '@/components/Story/container'
import UploadPage from "@/components/Story/uploadpage";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {

  return (
    <main className=" ">
    <section className="flex items-center gap-2"> 


       <UploadPage/>
    <StoriesContainer/>
    </section>


     {/* <ImageUpload/> */}

    <PostPage/>
      {/* <UserSuggestions /> */}
    


    </main>
  );
}