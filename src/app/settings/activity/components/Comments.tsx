import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
interface Comment {
  id: string;
  postId: string;
  uid: string;
  content: string;
  createdAt: number; // Timestamp in milliseconds
  likes: number;

  user: {
    username: string;
    profilePhotoURL: string;
    displayName: string;
    isVerified: boolean;
    isPrivate: boolean;
  };
}

const UserComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchUserComments = useCallback(async (paginate = false) => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (paginate && lastTimestamp) {
        params.append("lastTimestamp", lastTimestamp.toString());
      }

      const response = await fetch(
        `/api/user/activity/comments?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();

      setComments((prev) =>
        paginate ? [...prev, ...data.comments] : data.comments
      );
      setLastTimestamp(data.lastTimestamp);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching user comments:", error);
    } finally {
      setLoading(false);
    }
  }, [user, lastTimestamp])

  useEffect(() => {
    fetchUserComments();
  }, [user, fetchUserComments]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {comments.length === 0 && !loading ? (
        <p className="text-center">No comments yet.</p>
      ) : null}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="p-4 border-b rounded hover:bg-accent">
            <Link href={`/post/${comment.postId}`} >
              <div className="flex items-center space-x-3">
                <Image
                  width={30}
                  height={30}
                  src={comment.user?.profilePhotoURL}
                  alt={comment.user?.username || "user"}
                  className="rounded-full"
                />

                <p>{comment.user?.username || "anonymous"}</p>
              </div>
              <p className="mt-2">{comment.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()} • Likes:{" "}
                {comment.likes}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-center">
        {" "}
        {hasMore && (
          <button
            onClick={() => fetchUserComments(true)}
            disabled={loading}
          >
            <span className="flex justify-center">
              {loading ? <CircularProgress /> : "Load more..."}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserComments;



