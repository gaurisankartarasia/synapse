
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Post } from "@/types/post";
import { formatRelativeTime } from "@/utils/date";
import Link from "next/link";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';


export default function LikedPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await fetch("/api/user/activity/likes");
        if (!res.ok) throw new Error("Failed to fetch liked posts");

        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError("Error loading liked posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Liked Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center">You haven&apos;t liked any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => {
            const imageUrl = post.imageURLs?.length ? post.imageURLs[0] : null;

            return (
              <div key={post.postId} className="border p-4 rounded shadow-sm">
                <Link href={`/post/${post.postId}`}>
                <p className="font-semibold">{post.username}</p>
                
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    width={500}
                    height={500}
                    alt="Post Image"
                    className="object-cover rounded mt-2"
                  />
                )}

                <p className=" mt-2">{post.content}</p>
                <p className="text-sm mt-2">
                  <FavoriteIcon fontSize="small" /> {post.likeCount} | <AccessTimeOutlinedIcon  fontSize="small"/> {formatRelativeTime(post.createdAt)}
                </p></Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
