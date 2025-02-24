// src/app/post/hooks/usePosts.ts
import { useState, useRef, useCallback } from 'react';
import { Post } from '@/types/post';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const hasFetchedInitial = useRef(false);

  const fetchPosts = async (lastId: string | null = null) => {
    try {
      const url = `/api/post/display/query${lastId ? `?lastPostId=${lastId}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts((prev) => (lastId ? [...prev, ...data.posts] : data.posts));
      return data.posts;
    } catch (error) {
      console.error(error);
      alert("Error fetching posts");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    setPosts,
    loading,
    hasMore,
    lastPostId,
    hasFetchedInitial,
    fetchPosts
  };
};