
// components/user/UserPosts.tsx
import React from "react";
import UserPostsTabContent from "./PostTabs";
import { useUserPosts } from "../../app/[username]/hooks/usePosts";
import { Tabs, Tab, Box, CircularProgress } from "@mui/material";

interface UserPostsProps {
  uid: string;
  currentUserUid?: string;
}

export default function UserPosts({ uid, currentUserUid }: UserPostsProps) {
  const {
    posts,
    savedPosts,
    loading,
    savedLoading,
    error,
    isPrivate,
    activeTab,
    setActiveTab,
  } = useUserPosts({ uid, currentUserUid });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  if (!uid) return null;
  if (loading && activeTab === "posts")
    return (
      <div className="flex justify-center p-8">
        <CircularProgress />
      </div>
    );

  if (isPrivate) {
    return (
      <p className="text-lg font-medium text-center">
        This user's posts are private
      </p>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center p-8">{error}</div>;
  }

  return (
    <Box sx={{ mt: 3, px: { lg: 36 } }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="user posts tabs"
        centered
      >
        <Tab label="Posts" value="posts" />
        {currentUserUid === uid && <Tab label="Saved" value="saved" />}
      </Tabs>
      {activeTab === "posts" && (
        <Box sx={{ mt: 2 }}>
          <UserPostsTabContent
            tab="posts"
            posts={posts}
            loading={loading}
            uid={uid}
            savedLoading={savedLoading}
            savedPosts={savedPosts}
          />
        </Box>
      )}
      {currentUserUid === uid && activeTab === "saved" && (
        <Box sx={{ mt: 2 }}>
          <UserPostsTabContent
            tab="saved"
            savedPosts={savedPosts}
            savedLoading={savedLoading}
            currentUserUid={currentUserUid}
            uid={uid}
            posts={posts}
            loading={loading}
          />
        </Box>
      )}
    </Box>
  );
}