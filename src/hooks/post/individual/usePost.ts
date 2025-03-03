// // src/hooks/usePost.ts
// import { useState, useEffect } from "react";
// import { Post } from "@/types/post";
// import { useAuth } from "@/hooks/useAuth";

// export const usePost = (id: string) => {
//   const [post, setPost] = useState<Post | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [isLikeLoading, setIsLikeLoading] = useState(false);
//   const [isSaveLoading, setIsSaveLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     const fetchPostData = async () => {
//       try {
//         const response = await fetch(`/api/post/${id}/query`, {
//           method: 'GET',
//           headers: {
//             "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
//             "Content-Type": "application/json",
//             credentials: 'include',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(await response.text());
//         }

//         const data = await response.json();
//         setPost(data);
//         setLikeCount(data.likeCount || 0);
//         setIsLiked(data.isLiked || false);
//       } catch (error) {
//         console.error("Error fetching post data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPostData();
//   }, [id]);

//   const handleLike = async () => {
//     if (!user || isLikeLoading || !id) return;

//     setIsLikeLoading(true);
//     const prevLiked = isLiked;
//     const prevLikes = likeCount;

//     // Optimistic update
//     setIsLiked(!prevLiked);
//     setLikeCount(prevLiked ? prevLikes - 1 : prevLikes + 1);

//     try {
//       const response = await fetch('/api/post/like', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           credentials: 'include',
//         },
//         body: JSON.stringify({ postId: id }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to toggle like');
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Revert optimistic update on error
//       setIsLiked(prevLiked);
//       setLikeCount(prevLikes);
//     } finally {
//       setIsLikeLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!user || isSaveLoading || !id || !post) return;

//     setIsSaveLoading(true);
//     const prevSaved = post.isSaved;

//     // Optimistic update
//     setPost(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);

//     try {
//       const response = await fetch('/api/post/save', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           credentials: 'include',
//         },
//         body: JSON.stringify({ postId: id }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to toggle save status');
//       }
//     } catch (error) {
//       console.error('Error toggling save status:', error);
//       // Revert optimistic update on error
//       setPost(prev => prev ? { ...prev, isSaved: prevSaved } : null);
//     } finally {
//       setIsSaveLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!user || post?.uid !== user.uid) return;

//     const confirmed = window.confirm("Are you sure you want to delete this post?");
//     if (!confirmed) return;

//     try {
//       const response = await fetch(`/api/post/${id}/delete`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }

//       alert("Post deleted successfully!");
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Error deleting post:", error);
//       alert("Failed to delete post.");
//     }
//   };

//   const handleReport = async (reason: string) => {
//     if (!user || !post) return;

//     try {
//       const response = await fetch(`/api/post/${post.id}/report`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reason }),
//       });

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }

//       alert("Report submitted successfully!");
//     } catch (error) {
//       console.error("Error reporting post:", error);
//       alert("Failed to report post.");
//     }
//   };

//   return {
//     post,
//     loading,
//     isLiked,
//     likeCount,
//     handleLike,
//     handleSave,
//     handleDelete,
//     handleReport,
//     isModalOpen,
//     setIsModalOpen
//   };
// };






// // src/hooks/usePost.ts
// import { useState, useEffect } from "react";
// import { Post } from "@/types/post";
// import { useAuth } from "@/hooks/useAuth";

// export const usePost = (id: string) => {
//   const [post, setPost] = useState<Post | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [isLikeLoading, setIsLikeLoading] = useState(false);
//   const [isSaveLoading, setIsSaveLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     const fetchPostData = async () => {
//       try {
//         // Changed from POST to GET request
//         const response = await fetch(`/api/post/${id}/query`, {
//           method: 'GET',
//           headers: {
//             "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
//             "Content-Type": "application/json",
//           },
//           credentials: 'include',
//         });

//         if (!response.ok) {
//           throw new Error(await response.json());
//         }

//         const data = await response.json();
//         setPost(data);
//         setLikeCount(data.likeCount || 0);
//         setIsLiked(data.isLiked || false);
//       } catch (error) {
//         console.error("Error fetching post data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPostData();
//   }, [id]);

//   const handleLike = async () => {
//     if (!user || isLikeLoading || !id) return;

//     setIsLikeLoading(true);
//     const prevLiked = isLiked;
//     const prevLikes = likeCount;

//     // Optimistic update
//     setIsLiked(!prevLiked);
//     setLikeCount(prevLiked ? prevLikes - 1 : prevLikes + 1);

//     try {
//       const response = await fetch('/api/post/like', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ postId: id }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to toggle like');
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Revert optimistic update on error
//       setIsLiked(prevLiked);
//       setLikeCount(prevLikes);
//     } finally {
//       setIsLikeLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!user || isSaveLoading || !id || !post) return;

//     setIsSaveLoading(true);
//     const prevSaved = post.isSaved;

//     // Optimistic update
//     setPost(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);

//     try {
//       const response = await fetch('/api/post/save', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ postId: id }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to toggle save status');
//       }
//     } catch (error) {
//       console.error('Error toggling save status:', error);
//       // Revert optimistic update on error
//       setPost(prev => prev ? { ...prev, isSaved: prevSaved } : null);
//     } finally {
//       setIsSaveLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!user || post?.uid !== user.uid) return;

//     const confirmed = window.confirm("Are you sure you want to delete this post?");
//     if (!confirmed) return;

//     try {
//       const response = await fetch(`/api/post/${id}/delete`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }

//       alert("Post deleted successfully!");
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Error deleting post:", error);
//       alert("Failed to delete post.");
//     }
//   };

//   const handleReport = async (reason: string) => {
//     if (!user || !post) return;

//     try {
//       const response = await fetch(`/api/post/${post.id}/report`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reason }),
//       });

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }

//       alert("Report submitted successfully!");
//     } catch (error) {
//       console.error("Error reporting post:", error);
//       alert("Failed to report post.");
//     }
//   };

//   return {
//     post,
//     loading,
//     isLiked,
//     likeCount,
//     handleLike,
//     handleSave,
//     handleDelete,
//     handleReport,
//     isModalOpen,
//     setIsModalOpen
//   };
// };





import { useState, useEffect } from "react";
import { Post } from "@/types/post";
import { useAuth } from "@/hooks/useAuth";

export const usePost = (postId: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/post/${postId}/query`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        setPost(data);
        setLikeCount(data.likeCount || 0);
        setIsLiked(data.isLiked || false);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch post");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleLike = async () => {
    if (!user || isLikeLoading || !postId) return;

    setIsLikeLoading(true);
    const prevLiked = isLiked;
    const prevLikes = likeCount;

    // Optimistic update
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevLikes - 1 : prevLikes + 1);

    try {
      const response = await fetch('/api/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setIsLiked(prevLiked);
      setLikeCount(prevLikes);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || isSaveLoading || !postId || !post) return;

    setIsSaveLoading(true);
    const prevSaved = post.isSaved;

    // Optimistic update
    setPost(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);

    try {
      const response = await fetch('/api/post/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle save status');
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
    if (!user || post?.creator_uid !== user.uid) return;

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/post/${postId}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to delete post');
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
      const response = await fetch(`/api/post/${post.postId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to report post');
      }

      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error reporting post:", error);
      alert("Failed to report post.");
    }
  };

  return {
    post,
    loading,
    error,
    isLiked,
    likeCount,
    handleLike,
    handleSave,
    handleDelete,
    handleReport,
    isModalOpen,
    setIsModalOpen
  };
};