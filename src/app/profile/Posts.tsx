
// components/UserPosts.tsx
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Post } from '@/types/post';
import Link from 'next/link';
import {  Skeleton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface UserPostsProps {
  uid: string;
}

export default function UserPosts({ uid }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const hasFetched = useRef(false); // Prevent duplicate calls

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/user/posts?uid=${encodeURIComponent(uid)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts');
        }

        setPosts(data.posts || []);
        if (data.notice) {
          setNotice(data.notice);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (uid && !hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      fetchPosts();
    }
  }, [uid]);

  if (!uid) return null;
  if (loading) return <Skeleton/>;
  if (error) return <div className=" p-4">{error}</div>;

  return (
    <div className="space-y-4 mt-12">
      <b>Uploads</b>
      {notice && (
        <p className="mb-4" >
          {notice}
        </p>
      )}
      {posts.length === 0 ? (
        <div className="text-center p-8">No posts yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
  <Link href={`/post/${post.id}`} key={post.id} className="overflow-hidden">
    <div className="relative group">
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-square overflow-hidden">
              <Image 
                src={url} 
                alt={`Post image ${index + 1}`} 
                fill 
                className="object-cover rounded transition-opacity duration-300 group-hover:opacity-50" 
                loading={index < 4 ? 'eager' : 'lazy'} 
                priority={index < 2} 
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-lg font-semibold bg-black bg-opacity-50 p-2 rounded">
                  <p><FavoriteIcon/> {post.likeCount}</p>
                  <p><ChatBubbleOutlineIcon/> {post.commentCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </Link>
))}

        </div>
      )}
    </div>
  );
}
