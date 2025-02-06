// CommentSection.tsx
import {useEffect, useState} from 'react';
import { useAuth } from "@/hooks/useAuth";
import { CommentItem } from "./commentItem"
import { CommentForm } from './commentForm';
import { Comment } from '@/types/comments';
import { Skeleton } from '@mui/material';

type CommentSectionProps = {
  postId: string;
};

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/post/comments?postId=${postId}`);
        if (!response.ok) throw new Error("Failed to fetch comments");

        const data = await response.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);
  

  const handleAddComment = async (content: string) => {
    if (!user) return;
    

    
    try {
      // const token = await user();
      const response = await fetch("/api/post/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content }),
      });

      if (!response.ok) throw new Error("Failed to post comment");
      await response.json();
    } catch (error) {
      console.error(error);
      alert("Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || deleteLoading) return;
    
    try {
      setDeleteLoading(commentId);
      // const token = await getIdToken();
      
      const response = await fetch(`/api/post/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error instanceof Error ? error.message : "Error deleting comment");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    
    try {
      // Optimistic update
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            const isLiked = comment.likedBy?.includes(user.uid);
            return {
              ...comment,
              likes: isLiked ? comment.likes - 1 : comment.likes + 1,
              likedBy: isLiked
                ? comment.likedBy.filter((id) => id !== user.uid)
                : [...(comment.likedBy || []), user.uid]
            };
          }
          return comment;
        })
      );

      // const token = await getIdToken();
      await fetch(`/api/post/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId })
      });
    } catch (error) {
      // Revert optimistic update on error
      const response = await fetch(`/api/post/comments/${postId}`);
      const { comments: updatedComments } = await response.json();
      setComments(updatedComments);
    }
  };

  
  const handleReport = async (commentId: string, reason: string, replyId?: string) => {
    if (!user) return;
  
    try {
      const response = await fetch(`/api/post/comments/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, commentId, replyId: replyId || null, reason }), // Ensure replyId is nullable
      });
  
      if (!response.ok) throw new Error("Failed to report");
  
      alert(replyId ? "Reply reported successfully" : "Comment reported successfully");
    } catch (error) {
      console.error("Error reporting:", error);
      alert("Error reporting");
    }
  };
  
  
  

  const handleAddReply = async (commentId: string, content: string) => {
    if (!user) return;
    
    try {
      // const token = await getIdToken();
      const response = await fetch(`/api/post/comments/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content }),
      });

      if (!response.ok) throw new Error("Failed to add reply");
    } catch (error) {
      console.error(error);
      alert("Error adding reply");
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!user) return;
    
    try {
      // const token = await getIdToken();
      const response = await fetch(`/api/post/comments/${commentId}/replies/${replyId}`, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to delete reply");
    } catch (error) {
      console.error(error);
      alert("Error deleting reply");
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    if (!user) return;
    
    try {
      // const token = await getIdToken();
      await fetch(`/api/post/comments/${commentId}/replies/${replyId}/like`, {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId })
      });
    } catch (error) {
      console.error(error);
      alert("Error liking reply");
    }
  };

  return (
    <div className="comments-section mt-6">
      {loading ? (
        <Skeleton/>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem
                comment={comment}
                currentUserId={user?.uid}
                postId={postId}
                onDelete={handleDeleteComment}
                onLike={handleLike}
                onReport={handleReport}
                // onReportReply={handleReportReply}
                onAddReply={handleAddReply}
                onDeleteReply={handleDeleteReply}
                onLikeReply={handleLikeReply}
                isDeleting={deleteLoading === comment.id}
              />
            </li>
          ))}
        </ul>
      )}
      {user && <CommentForm onSubmit={handleAddComment} />}
    </div>
  );
};





