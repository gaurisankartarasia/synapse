
// components/Likebutton.tsx
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useAuth } from '@/hooks/useAuth'; 
import LikesModal from '../components/LikedByModal'
import {Heart,ChevronRight } from 'lucide-react';

interface LikebuttonProps {
  postId: string;
  initialLikes?: number;
  initialLikedState?: boolean;
}

const Likebutton = ({ 
  postId, 
  initialLikes = 0, 
  initialLikedState = false,
}: LikebuttonProps) => {
  const { user } = useAuth(); // Use the useAuth hook
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLikedState);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'posts', postId), (doc) => {
      if (doc.exists()) {
        const likesData = doc.data()?.likes || { total: 0, userLikes: {} };
        setLikes(likesData.total || 0);
        setIsLiked(!!likesData.userLikes?.[user.id]); // Use user.id instead of user.uid
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
      const response = await fetch('/api/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
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

  // Split the like button and like count into separate components
  const LikeButton = () => (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
    >
      {isLiked ? (
        <Heart/>
      ) : (
        <Heart/>
      )}
    </button>
  );

  const LikeCount = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="hover:bg-gray-300 focus:outline-none"
    >
      <div className='flex items-center'>
        {likes} {likes === 1 ? 'Like' : 'Likes'}
        <ChevronRight/>
      </div>
    </button>
  );

  return (
    <>
      <div className='flex items-center'>
        {user && <LikeButton />} {/* Only show like button if user is authenticated */}
        <LikeCount /> {/* Always show the like count */}
        <LikesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postId={postId}
        />
      </div>
    </>
  );
};

export default Likebutton;








