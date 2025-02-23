

//src/app/post/[id]/page.tsx

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CommentSection } from "../components/CommentSection";
import ImageGallery from "../components/ImageGallery";
import { formatRelativeTime } from "@/utils/date";
import { Spinner } from "@/components/ui/spinner";
import { Post } from "@/types/post";
import { useAuth } from '@/hooks/useAuth';
import LikesModal from '../components/LikedByModal';
import { ReportModal } from "@/components/ReportModal";
import { ChevronRight } from 'lucide-react';
import { FaRegHeart, FaHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {PostSkeleton} from '@/components/Skeleton-loaders/feed-post'
import  {UserHoverCard}  from "@/components/user-profile-hover-card";



const PostPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setlikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);


  useEffect(() => {
    if (!id) return;

    const fetchPostData = async () => {
      try {
        const response = await fetch(`/api/post/${id}/query`, {
          // headers: {
          //   "Cache-Control": "max-age=300",
          // },
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setPost(data);
        setlikeCount(data.likeCount || 0);
        setIsLiked(data.isLiked || false);
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("An error occurred while fetching the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);



  const handleLike = async () => {
    if (!user || isLikeLoading || !id) return;

    setIsLikeLoading(true);
    const prevLiked = isLiked;
    const prevLikes = likeCount;

    // Optimistic update
    setIsLiked(!prevLiked);
    setlikeCount(prevLiked ? prevLikes - 1 : prevLikes + 1);

    try {
      const response = await fetch('/api/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setIsLiked(prevLiked);
      setlikeCount(prevLikes);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || isSaveLoading || !id || !post) return;

    setIsSaveLoading(true);
    const prevSaved = post.isSaved;

    // Optimistic update
    setPost(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);

    try {
      const response = await fetch('/api/post/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle save status');
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      // Revert optimistic update on error
      setPost(prev => prev ? { ...prev, isSaved: prevSaved } : null);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || post?.uid !== user.uid) return;

    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/post/${id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert("Post deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleReport = async (reason: string) => {
    if (!user || !post) return;

    try {
      const response = await fetch(`/api/post/${post.id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error reporting post:", error);
      alert("Failed to report post.");
    }
  };


  if (loading) {
    return <PostSkeleton />;
  }

  if (!post) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Post not found</h2>
          <Link href="/" className="text-blue-500 hover:underline mt-4 block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center text-blue-500 hover:underline mb-6"
      >
        ← Back to Feed
      </Link>

      <div className="flex items-center gap-3">


        <Avatar>
          <AvatarImage src={post.profilePhotoURL} alt={post.username} />
          <AvatarFallback>{post.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        
<UserHoverCard username={post.username} >

  <Link href={`/${post.username}`} className="hover:opacity-60 cursor-pointer font-semibold">{post.username}</Link>

</UserHoverCard>
        

        {post.isVerified && <RiVerifiedBadgeFill />}

        <small className="t600">
          {formatRelativeTime(post.createdAt)}
        </small>

        <button
              onClick={handleSave}
              disabled={isSaveLoading}
              className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
            >
              {post.isSaved ? <FaBookmark size={15}  /> : <FaRegBookmark size={15}  />}
            </button>

        {user?.uid === post?.uid && (
          <button onClick={handleDelete} className="text-red-500">
            Delete Post
          </button>
        )}

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="text-red-500"
        >
          Report Post
        </button>
        
      </div>

      <div className="prose prose-lg max-w-none mt-6">{post.content}</div>

      {post.imageURLs && post.imageURLs.length > 0 && (
        <ImageGallery images={post.imageURLs} />
      )}

      <div className="mt-6 flex gap-4 items-center">
        <div className="flex items-center"> 
        {user && (
            <button
              onClick={handleLike}
              disabled={isLikeLoading}
              className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50 transition-all duration-200"
            >
              {isLiked ? <FaHeart size={20} color="red" /> : <FaRegHeart size={20}  />}
            </button>

           
        )}

        <button
          onClick={() => setIsModalOpen(true)}
        >
          <span className="flex items-center">
            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            <ChevronRight size={20}  />
          </span>
        </button>
        </div>

        {post.allowCommenting && (
          <p>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</p>
        )}
      </div>

      <div className="mt-6">
        {post.allowCommenting ? (
          <CommentSection postId={post.id} />
        ) : (
          <p className="text-center">Comments are turned off for this post.</p>
        )}
      </div>

      <LikesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postId={post.id}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />
    </div>
  );
};

export default PostPage;











