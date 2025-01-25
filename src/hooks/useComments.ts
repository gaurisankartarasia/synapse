

// // hooks/useComments.ts
// import { useState, useEffect } from "react";
// import { onSnapshot, doc } from "firebase/firestore";
// import { db } from "@/lib/firebaseClient";
// import type { Comment } from "@/types/comments";

// export const useComments = (postId: string) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

//   useEffect(() => {
//     if (!postId) return;

//     const unsubscribe = onSnapshot(
//       doc(db, "posts", postId),
//       (doc) => {
//         if (doc.exists()) {
//           const postData = doc.data();
//           setComments(postData.comments?.map((comment: Comment) => ({
//             ...comment,
//             replies: comment.replies || []
//           })) || []);
//         }
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching comments:", error);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [postId]);

//   return { comments, loading, deleteLoading, setComments, setDeleteLoading };
// };





// hooks/useComments.ts
import { useState, useEffect } from "react";
import { 
  onSnapshot, 
  collection, 
  query, 
  orderBy,
  doc,
  getDoc,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import type { Comment, Reply } from "@/types/comments";

export const useComments = (postId: string, userId: string | undefined) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    try {
      // Create a query for comments subcollection
      const commentsRef = collection(db, "posts", postId, "comments");
      const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(commentsQuery, async (snapshot) => {
        try {
          const commentsPromises = snapshot.docs.map(async (commentDoc) => {
            const commentData = commentDoc.data();

            // Get likes status for the comment
            const hasLiked = userId ? (
              await getDoc(doc(commentDoc.ref, "likes", userId))
            ).exists() : false;

            // Get replies
            const repliesRef = collection(commentDoc.ref, "replies");
            const repliesQuery = query(repliesRef, orderBy("createdAt", "asc"));
            const repliesSnapshot = await getDocs(repliesQuery);

            // Process replies
            const replies = await Promise.all(
              repliesSnapshot.docs.map(async (replyDoc) => {
                const replyData = replyDoc.data();
                const replyHasLiked = userId ? (
                  await getDoc(doc(replyDoc.ref, "likes", userId))
                ).exists() : false;

                return {
                  id: replyDoc.id,
                  ...replyData,
                  hasLiked: replyHasLiked,
                  createdAt: replyData.createdAt?.toDate(),
                  lastEditedAt: replyData.lastEditedAt?.toDate() || null
                } as Reply;
              })
            );

            return {
              id: commentDoc.id,
              ...commentData,
              hasLiked,
              replies,
              createdAt: commentData.createdAt?.toDate(),
              lastEditedAt: commentData.lastEditedAt?.toDate() || null
            } as Comment;
          });

          const processedComments = await Promise.all(commentsPromises);
          setComments(processedComments);
          setLoading(false);
        } catch (error) {
          console.error("Error processing comments:", error);
          setError("Failed to process comments");
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up comments listener:", error);
      setError("Failed to load comments");
      setLoading(false);
    }
  }, [postId, userId]);

  // Function to add a new comment
  const addComment = async (content: string): Promise<void> => {
    if (!userId) throw new Error("User not authenticated");
    
    try {
      const response = await fetch("/api/post/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });

      if (!response.ok) throw new Error("Failed to add comment");
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  // Function to toggle comment like
  const toggleCommentLike = async (commentId: string): Promise<void> => {
    if (!userId) throw new Error("User not authenticated");

    try {
      const response = await fetch(`/api/post/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to toggle like");
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  // Function to delete a comment
  const deleteComment = async (commentId: string): Promise<void> => {
    if (!userId) throw new Error("User not authenticated");
    setDeleteLoading(commentId);

    try {
      const response = await fetch(`/api/post/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to delete comment");
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    } finally {
      setDeleteLoading(null);
    }
  };

  // Function to add a reply
  const addReply = async (commentId: string, content: string): Promise<void> => {
    if (!userId) throw new Error("User not authenticated");

    try {
      const response = await fetch(`/api/post/comments/${commentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });

      if (!response.ok) throw new Error("Failed to add reply");
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  };

  // Function to delete a reply
  const deleteReply = async (commentId: string, replyId: string): Promise<void> => {
    if (!userId) throw new Error("User not authenticated");

    try {
      const response = await fetch(`/api/post/comments/${commentId}/replies/${replyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to delete reply");
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    }
  };

  // Function to toggle reply like
  const toggleReplyLike = async (commentId: string, replyId: string): Promise<void> => {
    if (!userId) throw new Error("User not authenticated");

    try {
      const response = await fetch(`/api/post/comments/${commentId}/replies/${replyId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to toggle reply like");
    } catch (error) {
      console.error("Error toggling reply like:", error);
      throw error;
    }
  };

  return {
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
  };
};