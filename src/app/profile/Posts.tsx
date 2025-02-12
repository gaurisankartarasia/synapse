
 // components/UserPosts.tsx

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Post } from '@/types/post';
import Link from 'next/link';
import { Spinner } from "@/components/ui/spinner";
import { Heart, MessageSquareText } from 'lucide-react';

interface UserPostsProps {
  uid: string;
}

export default function UserPosts({ uid }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/user/posts/query?uid=${encodeURIComponent(uid)}`);
        const data = await response.json();

        if (response.status === 403) {
          setIsPrivate(true);
          setError(null);
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to fetch posts');
        }

        setPosts(data.posts || []);
        setIsPrivate(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (uid && !hasFetched.current) {
      hasFetched.current = true;
      fetchPosts();
    }
  }, [uid]);

  if (!uid) return null;
  if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  
  if (isPrivate) {
    return (

        <p className="text-lg font-medium text-center">This user's posts are private</p>
      
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-12">
      <div className="flex items-center justify-between">
        <b>Uploads</b>
        <span className="text-sm text-gray-600">{posts.length} posts</span>
      </div>
      
      {posts.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          No posts yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id} className="overflow-hidden">
              <div className="relative group">
                {post.imageURLs && post.imageURLs.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.imageURLs.map((url, index) => (
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
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likeCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquareText className="w-4 h-4" />
                              <span>{post.commentCount}</span>
                            </div>
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