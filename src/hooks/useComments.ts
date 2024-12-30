//hooks/useComments.ts
import { useState, useEffect } from "react";
import type { Comment } from "@/types/comments";

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/post/comments?postId=${postId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error(error);
      // alert("Error fetching comments");
    } finally {
      setLoading(false);
    }
  };

  return {
    comments,
    loading,
    deleteLoading,
    setComments,
    setDeleteLoading
  };
};






