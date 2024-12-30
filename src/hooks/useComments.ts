// //hooks/useComments.ts
// import { useState, useEffect } from "react";
// import type { Comment } from "@/types/comments";

// export const useComments = (postId: string) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   const fetchComments = async () => {
//     try {
//       const response = await fetch(`/api/post/comments?postId=${postId}`);
//       if (!response.ok) throw new Error("Failed to fetch comments");

//       const data = await response.json();
//       setComments(data.comments);
//     } catch (error) {
//       console.error(error);
//       // alert("Error fetching comments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     comments,
//     loading,
//     deleteLoading,
//     setComments,
//     setDeleteLoading
//   };
// };






// // hooks/useComments.ts
// import { useState, useEffect } from "react";
// import type { Comment } from "@/types/comments";
// import { onSnapshot, doc } from "firebase/firestore";
// import { db } from "@/lib/firebaseClient";

// export const useComments = (postId: string) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

//   useEffect(() => {
//     if (!postId) return;

//     // Subscribe to real-time updates
//     const unsubscribe = onSnapshot(
//       doc(db, "posts", postId),
//       (doc) => {
//         if (doc.exists()) {
//           const postData = doc.data();
//           setComments(postData.comments || []);
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

//   return {
//     comments,
//     loading,
//     deleteLoading,
//     setComments,
//     setDeleteLoading
//   };
// };







// hooks/useComments.ts
import { useState, useEffect } from "react";
import type { Comment } from "@/types/comments";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

// hooks/useComments.ts
export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = onSnapshot(
      doc(db, "posts", postId),
      (doc) => {
        if (doc.exists()) {
          const postData = doc.data();
          setComments(postData.comments || []);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching comments:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [postId]);

  return { comments, loading, deleteLoading, setComments, setDeleteLoading };
};