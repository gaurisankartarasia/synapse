
// // components/LikeButton.tsx
// import { useState, useEffect } from 'react';
// import { onSnapshot, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebaseClient';
// import { useAuth } from '@/hooks/useAuth';


// interface LikeButtonProps {
//   postId: string;
//   initialLikes?: number;
//   initialLikedState?: boolean;
// }

// const LikeButton = ({ postId, initialLikes = 0, initialLikedState = false }: LikeButtonProps) => {
//   const [likes, setLikes] = useState(initialLikes);
//   const [isLiked, setIsLiked] = useState(initialLikedState);
//   const [isLoading, setIsLoading] = useState(false);
//   const { user, getIdToken } = useAuth();

//   useEffect(() => {
//     if (!user) return;

//     const unsubscribe = onSnapshot(doc(db, 'posts', postId), (doc) => {
//       if (doc.exists()) {
//         const likesData = doc.data()?.likes || { total: 0, userLikes: {} };
//         setLikes(likesData.total || 0);
//         setIsLiked(!!likesData.userLikes?.[user.uid]);
//       }
//     });

//     return () => unsubscribe();
//   }, [postId, user]);

//   const handleLike = async () => {
//     if (!user || isLoading) return;

//     setIsLoading(true);
//     const prevLiked = isLiked;
//     const prevLikes = likes;

//     // Optimistic update
//     setIsLiked(!prevLiked);
//     setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);

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
      
//       if (!response.ok) {
//         throw new Error(data.error);
//       }

//       // Server response will trigger onSnapshot update
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Revert optimistic update on error
//       setIsLiked(prevLiked);
//       setLikes(prevLikes);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className='flex items-center'>
//       <button
//         onClick={handleLike}
//         disabled={isLoading}
//         className="flex items-center p-1 text-3xl font-medium text-gray-700 active:scale-150 disabled:opacity-50"
//       >
//         {isLiked ? (
//           // <FaHeart className="w-5 h-5 text-red-500 fill-current" />
//           <span className="material-symbols-outlined">
// thumb_up
// </span>
//         ) : (
//           // <FaRegHeart className="w-5 h-5" />
//           <span className="material-symbols-outlined">
// thumb_up
// </span>
//         )}
//       </button>
//       <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
//     </div>
//   );
// };

// export default LikeButton;









// components/LikeButton.tsx
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useAuth } from '@/hooks/useAuth';
import LikesModal from '../post/components/LikedByModal';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialLikedState?: boolean;
}

const LikeButton = ({ postId, initialLikes = 0, initialLikedState = false }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLikedState);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      {/* <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span> */}
      <button
          onClick={() => setIsModalOpen(true)}
          className="hover:bg-gray-300 focus:outline-none"
        >
          <div className='flex items-center'>{likes} {likes === 1 ? 'Like' : 'Likes'}<span className="material-symbols-outlined">
keyboard_arrow_right
</span></div>
        </button>
      <LikesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postId={postId}
      />
    </div>
    
  );
};

export default LikeButton;