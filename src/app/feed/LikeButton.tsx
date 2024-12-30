
// // components/LikeButton.tsx
// import { useState, useEffect } from 'react';
// import { onSnapshot, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebaseClient';
// import { useAuth } from '@/hooks/useAuth';
// import { FaHeart } from "react-icons/fa";
// import { FaRegHeart } from "react-icons/fa";

// interface LikeButtonProps {
//   postId: string;
// }

// const LikeButton = ({ postId }: LikeButtonProps) => {
//   const [likes, setLikes] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user, getIdToken } = useAuth();

//   useEffect(() => {
//     if (!user) {
//       setIsLoading(false);
//       return;
//     }

//     // Subscribe to real-time post updates
//     const unsubscribe = onSnapshot(doc(db, 'posts', postId), (doc) => {
//       if (doc.exists()) {
//         setLikes(doc.data()?.likes || 0);
//       }
//     });

//     // Check if user has liked the post
//     const checkLikeStatus = async () => {
//       try {
//         const token = await getIdToken();
//         const response = await fetch(`/api/post/like?postId=${postId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         setIsLiked(data.liked);
//       } catch (error) {
//         console.error('Error checking like status:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkLikeStatus();
//     return () => unsubscribe();
//   }, [postId, user, getIdToken]);

//   const handleLike = async () => {
//     if (!user) return;
  
//     // Optimistic update
//     const prevLiked = isLiked;
//     setIsLiked(!prevLiked);
//     setLikes((prevLikes) => prevLiked ? prevLikes  : prevLikes );
  
//     try {
//       const token = await getIdToken();
//       const response = await fetch('/api/post/like', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ postId }),
//       });
  
//       const data = await response.json();
//       if (data.liked !== !prevLiked) {
//         // Revert optimistic update if server response differs
//         setIsLiked(data.liked);
//         setLikes((prevLikes) => data.liked ? prevLikes + 1 : prevLikes - 1);
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Revert optimistic update on error
//       setIsLiked(prevLiked);
//       setLikes((prevLikes) => prevLiked ? prevLikes + 1 : prevLikes - 1);
//     }
//   };
  

//   if (!user) {
//     return null;
//   }

//   return (
//     <>
//     <div className='flex items-center'>
//     <button
//       onClick={handleLike}
//       disabled={isLoading}
//       className="flex items-center p-1 text-3xl font-medium text-gray-700 active:scale-150  disabled:opacity-50"
//     >
//       {isLiked ? (
//         <FaHeart className="w-5 h-5 text-red-500 fill-current" />
//       ) : (
//         <FaRegHeart className="w-5 h-5" />
//       )}
      
//     </button>
//     <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
//     </div>
//     </>
//   );
// };

// export default LikeButton;




// components/LikeButton.tsx
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useAuth } from '@/hooks/useAuth';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialLikedState?: boolean;
}

const LikeButton = ({ postId, initialLikes = 0, initialLikedState = false }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLikedState);
  const [isLoading, setIsLoading] = useState(false);
  const { user, getIdToken } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'posts', postId), (doc) => {
      if (doc.exists()) {
        const likesData = doc.data()?.likes || { total: 0, userLikes: {} };
        setLikes(likesData.total || 0);
        setIsLiked(!!likesData.userLikes?.[user.uid]);
      }
    });

    return () => unsubscribe();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    const prevLiked = isLiked;
    const prevLikes = likes;

    // Optimistic update
    setIsLiked(!prevLiked);
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);

    try {
      const token = await getIdToken();
      const response = await fetch('/api/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }

      // Server response will trigger onSnapshot update
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setIsLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className='flex items-center'>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className="flex items-center p-1 text-3xl font-medium text-gray-700 active:scale-150 disabled:opacity-50"
      >
        {isLiked ? (
          // <FaHeart className="w-5 h-5 text-red-500 fill-current" />
          <span className="material-symbols-outlined">
thumb_up
</span>
        ) : (
          // <FaRegHeart className="w-5 h-5" />
          <span className="material-symbols-outlined">
thumb_up
</span>
        )}
      </button>
      <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    </div>
  );
};

export default LikeButton;