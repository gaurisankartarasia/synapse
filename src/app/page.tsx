"use client";

import PostPage from "./post/page";
import UserSuggestions from "@/components/UserSuggestions/UserSuggestions";


export default function Home() {

  return (
    <main className="flex ">
     
      <PostPage/><UserSuggestions />
    </main>
  );
}