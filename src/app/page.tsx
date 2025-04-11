"use client";

import PostPage from "./post/page";
import UserSuggestions from "@/components/UserSuggestions/UserSuggestions";
import StoriesContainer from "@/components/Story/container";
import UploadPage from "@/components/Story/uploadpage";
import { Profile } from "@/components/current-user-profile-card";
import Footer from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";

export default function Home() {
  return (
    
    <div className="flex flex-col lg:flex-row gap-4 lg:px-16 lg:gap-8">
      {/* Main Feed Container */}
      <div className="flex-1 max-w-3xl lg:max-w-none">
        {/* Stories Section */}
        <section className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <UploadPage />
          <StoriesContainer />
        </section>

        {/* Posts Feed */}
        <section className="max-w-3xl">
          {" "}
          <PostPage />
        </section>
      </div>

      {/* Right Sidebar - User Suggestions */}
      <div className=" flex lg:flex flex-col lg:w-96 lg:sticky lg:top-16 lg:h-[calc(100vh-1rem)] lg:overflow-y-auto">
        <Profile />
        <UserSuggestions />
        <Footer />
      </div>
    </div>
  );
}
