

// CommentSection.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { CommentItem } from "../post/components/commentItem";
import { CommentForm } from "../post/components/commentForm";
import { useComments } from "@/hooks/useComments";

type CommentSectionProps = {
  postId: string;
};

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user, getIdToken } = useAuth();
  const { comments, loading, deleteLoading, setComments, setDeleteLoading } = useComments(postId);

  const handleAddComment = async (content: string) => {
    try {
      const token = await getIdToken();
      const response = await fetch("/api/post/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const addedComment = await response.json();
      setComments((prev) => [...prev, addedComment]);
    } catch (error) {
      console.error(error);
      alert("Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || deleteLoading) return;
    
    try {
      setDeleteLoading(commentId);
      const token = await getIdToken();
      
      const response = await fetch(`/api/post/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
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
      const token = await getIdToken();
      const response = await fetch(`/api/post/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Failed to like comment");

      // Update local state optimistically
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
    } catch (error) {
      console.error("Error liking comment:", error);
      alert("Failed to like comment");
    }
  };

  const handleReport = async (commentId: string, reason: string) => {
    if (!user) return;
    
    try {
      const token = await getIdToken();
      const response = await fetch(`/api/post/comments/${commentId}/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason, postId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to report comment");
      }

      alert("Comment reported successfully");
    } catch (error) {
      console.error("Error reporting comment:", error);
      alert(error instanceof Error ? error.message : "Failed to report comment");
    }
  };

  return (
    <div className="comments-section mt-6">
      <h3> <span>{comments.length || 'No'}</span> Comments</h3>
      {loading ? (
        "Loading comments..."
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