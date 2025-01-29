

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


import { useState, useEffect } from "react";
import { onSnapshot, collection, doc, DocumentData, QuerySnapshot, DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import type { Comment, Reply } from "@/types/comments";

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = onSnapshot(
      collection(db, "posts", postId, "comments"), // Fetch comments from the comments subcollection
      {
        next: async (querySnapshot: QuerySnapshot<DocumentData>) => {
          const fetchedComments: Comment[] = [];
          
          for (const commentDoc of querySnapshot.docs) {
            const commentData = commentDoc.data();
            const commentId = commentDoc.id;

            // Fetch replies for the current comment
            const repliesSnapshot = await new Promise<QuerySnapshot<DocumentData>>((resolve, reject) => {
              const unsubscribeReplies = onSnapshot(
                collection(db, "posts", postId, "comments", commentId, "replies"),
                {
                  next: resolve,
                  error: reject,
                }
              );
              return () => unsubscribeReplies();
            });

            const replies: Reply[] = [];
            for (const replyDoc of repliesSnapshot.docs) {
              const replyData = replyDoc.data();
              const replyId = replyDoc.id;

              // Fetch likes for the reply
              const likesSnapshot = await new Promise<QuerySnapshot<DocumentData>>((resolve, reject) => {
                const unsubscribeLikes = onSnapshot(
                  collection(db, "posts", postId, "comments", commentId, "replies", replyId, "likes"),
                  {
                    next: resolve,
                    error: reject,
                  }
                );
                return () => unsubscribeLikes();
              });

              const likedBy: string[] = [];
              likesSnapshot.docs.forEach((likeDoc: DocumentSnapshot<DocumentData>) => {
                likedBy.push(likeDoc.id); // User IDs of those who liked the reply
              });

              replies.push({
                id: replyId,
                authorId: replyData.authorId,
                author: replyData.author,
                content: replyData.content,
                createdAt: replyData.createdAt,
                likes: replyData.likes,
                likedBy,
              });
            }

            fetchedComments.push({
              id: commentId,
              authorId: commentData.authorId,
              author: commentData.author,
              content: commentData.content,
              createdAt: commentData.createdAt,
              likes: commentData.likes,
              likedBy: commentData.likedBy,
              replies,
            });
          }

          setComments(fetchedComments);
          setLoading(false);
        },
        error: (error) => {
          console.error("Error fetching comments:", error);
          setLoading(false);
        },
      }
    );

    return () => unsubscribe();
  }, [postId]);

  return { comments, loading, deleteLoading, setComments, setDeleteLoading };
};
