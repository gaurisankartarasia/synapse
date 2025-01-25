

// // CommentSection.tsx
// import { useAuth } from "@/hooks/useAuth";
// import { useComments } from "@/hooks/useComments";
// import { CommentItem } from "./commentItem"
// import { CommentForm } from './commentForm'

// type CommentSectionProps = {
//   postId: string;
// };

// export const CommentSection = ({ postId }: CommentSectionProps) => {
//   const { user } = useAuth();
//   const { comments, loading, deleteLoading, setComments, setDeleteLoading } = useComments(postId);

//   const handleAddComment = async (content: string) => {
//     if (!user) return;
    
//     try {
//       const response = await fetch("/api/post/comments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ postId, content }),
//       });

//       if (!response.ok) throw new Error("Failed to post comment");
//       await response.json();
//     } catch (error) {
//       console.error(error);
//       alert("Error adding comment");
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     if (!user || deleteLoading) return;
    
//     try {
//       setDeleteLoading(commentId);
      
//       const response = await fetch(`/api/post/comments/${commentId}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         credentials: 'include', 
//         body: JSON.stringify({ postId }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to delete comment");
//       }

//       setComments((prev) => prev.filter((comment) => comment.id !== commentId));
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//       alert(error instanceof Error ? error.message : "Error deleting comment");
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handleLike = async (commentId: string) => {
//     if (!user) return;
    
//     try {
//       // Optimistic update
//       setComments((prev) =>
//         prev.map((comment) => {
//           if (comment.id === commentId) {
//             const isLiked = comment.likedBy?.includes(user.uid);
//             return {
//               ...comment,
//               likes: isLiked ? comment.likes - 1 : comment.likes + 1,
//               likedBy: isLiked
//                 ? comment.likedBy.filter((id) => id !== user.uid)
//                 : [...(comment.likedBy || []), user.uid]
//             };
//           }
//           return comment;
//         })
//       );

//       // const token = await getIdToken();
//       await fetch(`/api/post/comments/${commentId}/like`, {
//         method: "POST",
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ postId })
//       });
//     } catch (error) {
//       // Revert optimistic update on error
//       const response = await fetch(`/api/post/comments/${postId}`);
//       const { comments: updatedComments } = await response.json();
//       setComments(updatedComments);
//     }
//   };

//   const handleReport = async (commentId: string, reason: string) => {
//     if (!user) return;
    
//     try {
//       // const token = await getIdToken();
//       const response = await fetch(`/api/post/comments/${commentId}/report`, {
//         method: "POST",
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ reason, postId })
//       });

//       if (!response.ok) throw new Error("Failed to report comment");
//       alert("Comment reported successfully");
//     } catch (error) {
//       console.error(error);
//       alert("Error reporting comment");
//     }
//   };

//   const handleReportReply = async (commentId: string, replyId: string, reason: string) => {
//     if (!user) return;
  
//     try {
//       // const token = await getIdToken();
//       const response = await fetch(`/api/post/comments/${commentId}/replies/${replyId}/report`, {
//         method: "POST",
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ postId, reason }),
//       });
  
//       if (!response.ok) throw new Error("Failed to report reply");
//       alert("Reply reported successfully");
//     } catch (error) {
//       console.error("Error reporting reply:", error);
//       alert("Error reporting reply");
//     }
//   };
  

//   const handleAddReply = async (commentId: string, content: string) => {
//     if (!user) return;
    
//     try {
//       // const token = await getIdToken();
//       const response = await fetch(`/api/post/comments/${commentId}/reply`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ postId, content }),
//       });

//       if (!response.ok) throw new Error("Failed to add reply");
//     } catch (error) {
//       console.error(error);
//       alert("Error adding reply");
//     }
//   };

//   const handleDeleteReply = async (commentId: string, replyId: string) => {
//     if (!user) return;
    
//     try {
//       // const token = await getIdToken();
//       const response = await fetch(`/api/post/comments/${commentId}/replies/${replyId}`, {
//         method: "DELETE",
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ postId }),
//       });

//       if (!response.ok) throw new Error("Failed to delete reply");
//     } catch (error) {
//       console.error(error);
//       alert("Error deleting reply");
//     }
//   };

//   const handleLikeReply = async (commentId: string, replyId: string) => {
//     if (!user) return;
    
//     try {
//       // const token = await getIdToken();
//       await fetch(`/api/post/comments/${commentId}/replies/${replyId}/like`, {
//         method: "POST",
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ postId })
//       });
//     } catch (error) {
//       console.error(error);
//       alert("Error liking reply");
//     }
//   };

//   return (
//     <div className="comments-section mt-6">
//       <h3><span>{comments.length || 'No'}</span> Comments</h3>
//       {loading ? (
//         "Loading comments..."
//       ) : (
//         <ul>
//           {comments.map((comment) => (
//             <li key={comment.id}>
//               <CommentItem
//                 comment={comment}
//                 currentUserId={user?.uid}
//                 postId={postId}
//                 onDelete={handleDeleteComment}
//                 onLike={handleLike}
//                 onReport={handleReport}
//                 onReportReply={handleReportReply}
//                 onAddReply={handleAddReply}
//                 onDeleteReply={handleDeleteReply}
//                 onLikeReply={handleLikeReply}
//                 isDeleting={deleteLoading === comment.id}
//               />
//             </li>
//           ))}
//         </ul>
//       )}
//       {user && <CommentForm onSubmit={handleAddComment} />}
//     </div>
//   );
// };








// CommentSection.tsx
import { useAuth } from "@/hooks/useAuth";
import { useComments } from "@/hooks/useComments";
import  {CommentItem} from "./commentItem";
import  {CommentForm}  from './commentForm';
import { Alert, CircularProgress } from '@mui/material';

type CommentSectionProps = {
  postId: string;
};

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const {
    comments,
    loading,
    error,
    deleteLoading,
    addComment,
    deleteComment,
    toggleCommentLike,
    addReply,
    deleteReply,
    toggleReplyLike
  } = useComments(postId, user?.uid);

  const handleReport = async (commentId: string, reason: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/post/comments/${commentId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId, reason })
      });

      if (!response.ok) throw new Error("Failed to report comment");
      alert("Comment reported successfully");
    } catch (error) {
      console.error("Error reporting comment:", error);
      alert("Error reporting comment");
    }
  };

  const handleReportReply = async (commentId: string, replyId: string, reason: string) => {
    if (!user) return;
  
    try {
      const response = await fetch(`/api/post/comments/${commentId}/reply/${replyId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId, reason })
      });
  
      if (!response.ok) throw new Error("Failed to report reply");
      alert("Reply reported successfully");
    } catch (error) {
      console.error("Error reporting reply:", error);
      alert("Error reporting reply");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="my-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="comments-section mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {comments.length > 0 ? `${comments.length} Comments` : 'No Comments Yet'}
        </h3>
      </div>

      {user && <CommentForm onSubmit={addComment} />}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={user?.uid}
            postId={postId}
            onDelete={deleteComment}
            onLike={toggleCommentLike}
            onReport={handleReport}
            onReportReply={handleReportReply}
            onAddReply={addReply}
            onDeleteReply={deleteReply}
            onLikeReply={toggleReplyLike}
            isDeleting={deleteLoading === comment.id}
          />
        ))}
      </div>
    </div>
  );
};

