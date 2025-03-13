'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Post } from '@/types/post';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';

export default function SavedPostsGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth()

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/user-profile/post/saved?uid=${encodeURIComponent(user.uid)}`);
        if (!res.ok) throw new Error('Failed to fetch posts');

        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (loading) return <p className="text-center">Loading posts...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (posts.length === 0) return <p className="text-center">No saved posts found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {posts.map(post => (
        <div key={post.postId} className="shadow-md rounded-lg overflow-hidden">
          <Link href={`/post/${post.postId}`} className="overflow-hidden">
          <div className="relative group">
            {post.imageURLs && post.imageURLs.length > 0 && (
              <div className="relative aspect-square overflow-hidden">
                <Image 
                  src={post.imageURLs[0]} 
                  alt={`Post image`} 
                  fill 
                  className="object-cover rounded transition-opacity duration-300 group-hover:opacity-50" 
                  loading="eager" 
                  priority 
                />
                <div className="absolute inset-0 flex items-center bg-black bg-opacity-30 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-lg font-semibold  p-2 rounded flex items-center gap-3">
                    <div className="flex items-center space-x-1">
                      <FavoriteIcon fontSize='small' />
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CommentOutlinedIcon fontSize='small'/>
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Link>
        </div>
      ))}
    </div>
  );
}
