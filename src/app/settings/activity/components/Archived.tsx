
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Post } from '@/types/post';


import { Favorite, ChatBubbleOutline, Image as ImageIcon } from '@mui/icons-material';

import { CircularProgress } from '@mui/material'; 

export default function ArchivedPostsGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth()

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/v1/user/activity/archived`);
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

  if (loading) return <div className="flex justify-center"><CircularProgress/></div>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (posts.length === 0) return <p className="text-center">No archived posts yet.</p>;

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
                {post.media_type === "image" && (
                    <div className="absolute top-2 right-2 text-white">
                        <ImageIcon  />
                    </div>
                )}
              
                <div className="absolute inset-0 flex items-center bg-black bg-opacity-30 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-lg font-semibold  p-2 rounded flex items-center gap-3">
                    <div className="flex items-center space-x-1">
                      <Favorite  />
                      <span>{post.likeCount}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <ChatBubbleOutline fontSize='small' />
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