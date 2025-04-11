

// src/app/post/[postId]/page.tsx
"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';
import { PostHeader } from "../../../components/Post/Individual/PostHeader";
import { PostContent } from "../../../components/Post/Individual/PostContent";
import { PostActions } from "../../../components/Post/Individual/PostActions";
import { CommentSection } from "../../../components/Post/COMMON/CommentSection";
import  {usePost}  from "@/hooks/post/individual/usePost";
import { HashtagDisplay } from "../../../components/Post/COMMON/Hashtag";
import TextContent from "../../../components/Post/COMMON/TextContent"; 
import { Button, CircularProgress } from "@mui/material";


const PostPage = () => {
  const params = useParams();
  const postId = params?.postId as string;
  const { user } = useAuth();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const {
    post,
    loading,
    isLiked,
    likeCount,
    handleLike,
    handleArchive,
    handleSave,
    handleDelete,
    handleReport,
    isModalOpen,
    setIsModalOpen
  } = usePost(postId);

  if (loading) {
    return <div className="flex justify-center "><CircularProgress /></div> ;
  }

  if (!post) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Post not found</h2>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
      >
        <Button >
        ← Back to Feed</Button>
      </Link>

      <PostHeader 
        post={post} 
        onSave={handleSave} 
        onArchive={handleArchive}
        onDelete={handleDelete} 
        currentUserId={user?.uid} 
        onReportClick={() => setIsReportModalOpen(true)} 
      />
 <div className="m-5 ">
                  <TextContent content={post.content} />
                </div>
      <PostContent post={post} />
      
      <HashtagDisplay hashtags={post.hashtags} />

      <PostActions 
        post={post} 
        isLiked={isLiked} 
        likeCount={likeCount} 
        onLike={handleLike} 
        onOpenLikesModal={() => setIsModalOpen(true)}
        isLikesModalOpen={isModalOpen}
        onCloseLikesModal={() => setIsModalOpen(false)}
        onReport={handleReport}
        isReportModalOpen={isReportModalOpen}
        onCloseReportModal={() => setIsReportModalOpen(false)}
      />

      <div className="mt-6">
        {post.allowCommenting ? (
          <CommentSection postId={post.postId} />
        ) : (
          <p className="text-center">Comments are turned off for this post.</p>
        )}
      </div>
    </div>
  );
};

export default PostPage;