// hooks/useUserPosts.ts
import { useState, useEffect, useRef } from "react";
import { Post } from "@/types/post";

interface UseUserPostsProps {
  uid: string;
  currentUserUid?: string;
}

interface UseUserPostsResult {
  posts: Post[];
  savedPosts: Post[];
  loading: boolean;
  savedLoading: boolean;
  error: string | null;
  isPrivate: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useUserPosts = ({
  uid,
  currentUserUid,
}: UseUserPostsProps): UseUserPostsResult => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const hasFetched = useRef(false);
  const hasFetchedSaved = useRef(false);

  // Fetch regular posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/user/posts/query?uid=${encodeURIComponent(uid)}`
        );
        const data = await response.json();

        if (response.status === 403) {
          setIsPrivate(true);
          setError(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to fetch posts"
          );
        }

        setPosts(data.posts || []);
        setIsPrivate(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (uid && !hasFetched.current) {
      hasFetched.current = true;
      fetchPosts();
    }
  }, [uid]);

  // Fetch saved posts only when needed
  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!currentUserUid || currentUserUid !== uid || hasFetchedSaved.current)
        return;

      try {
        setSavedLoading(true);
        const response = await fetch(
          `/api/user-profile/post/saved?uid=${encodeURIComponent(uid)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to fetch saved posts"
          );
        }

        setSavedPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching saved posts:", err);
      } finally {
        setSavedLoading(false);
        hasFetchedSaved.current = true;
      }
    };

    if (activeTab === "saved") {
      fetchSavedPosts();
    }
  }, [activeTab, currentUserUid, uid]);

  return {
    posts,
    savedPosts,
    loading,
    savedLoading,
    error,
    isPrivate,
    activeTab,
    setActiveTab,
  };
};