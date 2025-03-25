// // src/hooks/post/feed/usePostActions.ts
// import { useState } from 'react';
// import { Post } from '@/types/post';

// interface LikeState {
//   isLiked: boolean;
//   count: number;
//   loading: boolean;
// }

// interface SaveState {
//   loading: boolean;
// }

// export const usePostActions = (setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
//   const [likeStates, setLikeStates] = useState<Record<string, LikeState>>({});
//   const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

//   // Initialize like states for new posts
//   const initializeLikeStates = (posts: Post[]) => {
//     const newLikeStates: Record<string, LikeState> = {};
//     posts.forEach((post: Post) => {
//       newLikeStates[post.postId] = {
//         isLiked: post.isLiked || false,
//         count: post.likeCount || 0,
//         loading: false
//       };
//     });
//     setLikeStates(prev => ({ ...prev, ...newLikeStates }));
//   };

//   const handleLike = async (postId: string, user: any) => {
//     if (!user || likeStates[postId]?.loading) return;

//     // Get current state or initialize if doesn't exist
//     const currentState = likeStates[postId] || {
//       isLiked: false,
//       count: 0,
//       loading: false
//     };

//     // Optimistic update
//     setLikeStates(prev => ({
//       ...prev,
//       [postId]: {
//         isLiked: !currentState.isLiked,
//         count: currentState.isLiked ? currentState.count - 1 : currentState.count + 1,
//         loading: true
//       }
//     }));

//     try {
//       const response = await fetch('/api/post/like', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           credentials: 'include',
//         },
//         body: JSON.stringify({ postId }),
//       });

//       if (!response.ok) throw new Error('Failed to toggle like');
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Revert on error
//       setLikeStates(prev => ({
//         ...prev,
//         [postId]: currentState
//       }));
//     } finally {
//       setLikeStates(prev => ({
//         ...prev,
//         [postId]: {
//           ...prev[postId],
//           loading: false
//         }
//       }));
//     }
//   };

  

//   const handleSave = async (postId: string, user: any) => {
//     if (!user || saveStates[postId]?.loading) return;

//     setPosts((prevPosts: Post[]) =>
//       prevPosts.map((post: Post) =>
//         post.postId === postId
//           ? { ...post, isSaved: !post.isSaved }
//           : post
//       )
//     );

//     setSaveStates(prev => ({
//       ...prev,
//       [postId]: { loading: true }
//     }));

//     try {
//       const response = await fetch('/api/post/save', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           credentials: 'include',
//         },
//         body: JSON.stringify({ postId }),
//       });

//       if (!response.ok) throw new Error('Failed to toggle save status');
//     } catch (error) {
//       console.error('Error toggling save status:', error);
//       setPosts((prevPosts: Post[]) =>
//         prevPosts.map((post: Post) =>
//           post.postId === postId
//             ? { ...post, isSaved: !post.isSaved }
//             : post
//         )
//       );
//     } finally {
//       setSaveStates(prev => ({
//         ...prev,
//         [postId]: { loading: false }
//       }));
//     }
//   };
  
 
 

//   return {
//     likeStates,
//     setLikeStates,
//     saveStates,
//     handleLike,
//     handleSave,
//     initializeLikeStates,
//   };
// };


// src/hooks/post/feed/usePostActions.ts
import { useState } from 'react';
import { Post } from '@/types/post';

interface LikeState {
  isLiked: boolean;
  count: number;
  loading: boolean;
}

interface SaveState {
  loading: boolean;
}

interface ArchiveState {
  loading: boolean;
}

export const usePostActions = (setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
  const [likeStates, setLikeStates] = useState<Record<string, LikeState>>({});
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});
  const [archiveStates, setArchiveStates] = useState<Record<string, ArchiveState>>({});

  // Initialize like states for new posts
  const initializeLikeStates = (posts: Post[]) => {
    const newLikeStates: Record<string, LikeState> = {};
    posts.forEach((post: Post) => {
      newLikeStates[post.postId] = {
        isLiked: post.isLiked || false,
        count: post.likeCount || 0,
        loading: false
      };
    });
    setLikeStates(prev => ({ ...prev, ...newLikeStates }));
  };

  const handleLike = async (postId: string, user: any) => {
    if (!user || likeStates[postId]?.loading) return;

    // Get current state or initialize if doesn't exist
    const currentState = likeStates[postId] || { isLiked: false, count: 0, loading: false };

    // Optimistic update
    setLikeStates(prev => ({
      ...prev,
      [postId]: {
        isLiked: !currentState.isLiked,
        count: currentState.isLiked ? currentState.count - 1 : currentState.count + 1,
        loading: true
      }
    }));

    try {
      const response = await fetch('/api/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikeStates(prev => ({ ...prev, [postId]: currentState }));
    } finally {
      setLikeStates(prev => ({
        ...prev,
        [postId]: { ...prev[postId], loading: false }
      }));
    }
  };

  const handleSave = async (postId: string, user: any) => {
    if (!user || saveStates[postId]?.loading) return;

    // Optimistic update
    setPosts((prevPosts: Post[]) => 
      prevPosts.map((post: Post) => 
        post.postId === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );

    // Track save loading state
    setSaveStates(prev => ({ ...prev, [postId]: { loading: true } }));

    try {
      const response = await fetch('/api/post/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle save status');
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      // Revert optimistic update on error
      setPosts((prevPosts: Post[]) => 
        prevPosts.map((post: Post) => 
          post.postId === postId ? { ...post, isSaved: !post.isSaved } : post
        )
      );
    } finally {
      setSaveStates(prev => ({ ...prev, [postId]: { loading: false } }));
    }
  };

  const handleArchive = async (postId: string, user: any) => {
    if (!user || archiveStates[postId]?.loading) return;

    // Optimistic update
    setPosts((prevPosts: Post[]) => 
      prevPosts.map((post: Post) => 
        post.postId === postId ? { ...post, isArchived: !post.isArchived } : post
      )
    );

    // Track archive loading state
    setArchiveStates(prev => ({ ...prev, [postId]: { loading: true } }));

    try {
      const response = await fetch('/api/post/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle archive status');
      }
    } catch (error) {
      console.error('Error toggling archive status:', error);
      // Revert optimistic update on error
      setPosts((prevPosts: Post[]) => 
        prevPosts.map((post: Post) => 
          post.postId === postId ? { ...post, isArchived: !post.isArchived } : post
        )
      );
    } finally {
      setArchiveStates(prev => ({ ...prev, [postId]: { loading: false } }));
    }
  };

  const handleDelete = async (postId: string, user: any, post: Post) => {
    if (!user || post.creator_uid !== user.uid) return;

    const confirmation = window.confirm("Are you sure you want to delete this post?");
    if (!confirmation) return;

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

      // Remove the post from the list
      setPosts((prevPosts: Post[]) => 
        prevPosts.filter((post: Post) => post.postId !== postId)
      );

      // Optional: redirect to home if on a single post page
      // window.location.href = "/";
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return {
    likeStates,
    setLikeStates,
    saveStates,
    archiveStates,
    handleLike,
    handleSave,
    handleArchive,
    handleDelete,
    initializeLikeStates
  };
};