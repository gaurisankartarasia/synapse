// components/user/UserPostsTabContent.tsx
import React from "react";
import { Post } from "@/types/post";
import CircularProgress from "@mui/material/CircularProgress";
import PostGrid from "./PostGrid";

interface UserPostsTabContentProps {
  tab: "posts" | "saved";
  posts: Post[];
  loading: boolean;
  currentUserUid?: string;
  uid: string;
  savedLoading: boolean;
  savedPosts: Post[];
}

const UserPostsTabContent: React.FC<UserPostsTabContentProps> = ({
  tab,
  posts,
  loading,
  currentUserUid,
  uid,
  savedLoading,
  savedPosts,
}) => {
  if (tab === "posts") {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <b>Uploads</b>
          <span className="text-sm t600">{posts.length} posts</span>
        </div>
        {loading ? (
          <div className="flex justify-center p-8">
            <CircularProgress />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center p-8 t500">
            No posts yet
          </div>
        ) : (
          <PostGrid posts={posts} />
        )}
      </div>
    );
  }

  if (tab === "saved" && currentUserUid === uid) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <b>Saved Posts</b>
          <span className="text-sm t600">{savedPosts.length} saved</span>
        </div>
        {savedLoading ? (
          <div className="flex justify-center p-8">
            <CircularProgress />
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="flex items-center justify-center p-8 t500">
            No saved posts
          </div>
        ) : (
          <PostGrid posts={savedPosts} />
        )}
      </div>
    );
  }

  return null; // Or a default message if needed
};

export default UserPostsTabContent;