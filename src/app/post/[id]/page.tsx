

 //src/app/post/[id]/page.tsx

 "use client";
 import { useState, useEffect } from "react";
 import { useParams } from "next/navigation";
 import { PostHeader } from "../components/PostHeader";
 import Link from "next/link";
 import { CommentSection } from "../components/CommentSection";
 import ImageGallery from "../components/ImageGallery";
 import { formatRelativeTime } from "@/utils/date";
 import { Spinner } from "@/components/ui/spinner";
 import { Post } from "@/types/post";
 import { useAuth } from '@/hooks/useAuth';
 import LikesModal from '../components/LikedByModal';
 import { ReportModal } from "@/components/ReportModal";
 import { Heart, Bookmark, MessageSquare, ChevronRight } from 'lucide-react';


 
 const PostPage = () => {
   const params = useParams();
   const id = params?.id as string;
   const [post, setPost] = useState<Post | null>(null);
   const [loading, setLoading] = useState(true);
   const { user } = useAuth();
   const [isLiked, setIsLiked] = useState(false);
   const [like_count, setlike_count] = useState(0);
   const [isLikeLoading, setIsLikeLoading] = useState(false);
   const [isSaveLoading, setIsSaveLoading] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isReportModalOpen, setIsReportModalOpen] = useState(false);

 
   useEffect(() => {
    if (!id) return;

    const fetchPostData = async () => {
      try {
        const response = await fetch(`/api/post/${id}`, {
          headers: {
            "Cache-Control": "max-age=300",
          },
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setPost(data);
        setlike_count(data.like_count || 0);
        setIsLiked(data.is_liked || false);
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
    const prevLikes = like_count;

    // Optimistic update
    setIsLiked(!prevLiked);
    setlike_count(prevLiked ? prevLikes - 1 : prevLikes + 1);

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
      setlike_count(prevLikes);
    } finally {
      setIsLikeLoading(false);
    }
  };
 
   const handleSave = async () => {
     if (!user || isSaveLoading || !id || !post) return;
 
     setIsSaveLoading(true);
     const prevSaved = post.is_saved;
 
     // Optimistic update
     setPost(prev => prev ? { ...prev, is_saved: !prev.is_saved } : null);
 
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
       setPost(prev => prev ? { ...prev, is_saved: prevSaved } : null);
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
     return <Spinner />;
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
         <PostHeader
           authorUsername={post.author}
           authordisplayName={post.displayName}
           authorprofilePhotoURL={post.profilePhotoURL}
           authorVerified={post.isVerified}
         />
         <small className="text-gray-600">
           {formatRelativeTime(post.createdAt)}
         </small>
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
 
       <div className="mt-6 pt-6 border-t flex gap-4 items-center">
         {user && (
           <>
             <button
               onClick={handleLike}
               disabled={isLikeLoading}
               className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50 transition-all duration-200"
             >
               {isLiked ? <Heart /> : "Liked"}
             </button>
 
             <button
               onClick={handleSave}
               disabled={isSaveLoading}
               className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
             >
               {post.is_saved ? <Bookmark /> : "saved"}
             </button>
           </>
         )}
 
         <button
           onClick={() => setIsModalOpen(true)}
           className="hover:bg-gray-300 focus:outline-none"
         >
           <div className="flex items-center">
             {like_count} {like_count === 1 ? 'Like' : 'Likes'}
             <ChevronRight />
           </div>
         </button>
 
         {post.allow_commenting && (
           <p>{post.comment_count} {post.comment_count === 1 ? 'Comment' : 'Comments'}</p>
         )}
       </div>
 
       <div className="mt-6">
         {post.allow_commenting ? (
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











