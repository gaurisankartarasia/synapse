// src/app/post/hooks/usePostActions.ts
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

export const usePostActions = (setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
  const [likeStates, setLikeStates] = useState<Record<string, LikeState>>({});
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

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
    const currentState = likeStates[postId] || {
      isLiked: false,
      count: 0,
      loading: false
    };

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
      setLikeStates(prev => ({
        ...prev,
        [postId]: currentState
      }));
    } finally {
      setLikeStates(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          loading: false
        }
      }));
    }
  };

  const handleSave = async (postId: string, user: any) => {
    if (!user || saveStates[postId]?.loading) return;

    setPosts((prevPosts: Post[]) =>
      prevPosts.map((post: Post) =>
        post.postId === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );

    setSaveStates(prev => ({
      ...prev,
      [postId]: { loading: true }
    }));

    try {
      const response = await fetch('/api/post/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error('Failed to toggle save status');
    } catch (error) {
      console.error('Error toggling save status:', error);
      setPosts((prevPosts: Post[]) =>
        prevPosts.map((post: Post) =>
          post.postId === postId
            ? { ...post, isSaved: !post.isSaved }
            : post
        )
      );
    } finally {
      setSaveStates(prev => ({
        ...prev,
        [postId]: { loading: false }
      }));
    }
  };

  return {
    likeStates,
    setLikeStates,
    saveStates,
    handleLike,
    handleSave,
    initializeLikeStates
  };
};





