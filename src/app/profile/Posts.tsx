

// components/UserPosts.tsx (update notice handling)
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Post } from '@/types/post';
import { Card, CardHeader, Alert, } from '@mui/material';
import  Link from 'next/link';

interface UserPostsProps {
  uid: string;
}

export default function UserPosts({ uid }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/user/profile/posts?uid=${encodeURIComponent(uid)}`);
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

    if (uid) {
      fetchPosts();
    }
  }, [uid]);

  if (!uid) return null;
  if (loading) return 'loading...';
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-4 mt-12" >
        <b>Uploads</b>
      {/* {notice && (
        <Alert className="mb-4"description={notice}>
          
        </Alert>
      )} */}
      
      {posts.length === 0 ? (
        <div className="text-center p-8">No posts yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
           <Link href={`/post/${post.id}`} key={post.id} className="overflow-hidden">
            <Card>
              <CardHeader>
                <div className="text-lg">{post.title}</div>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <div>
                <p className="text-sm mb-4">{post.content}</p>
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Post image ${index + 1}`}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading={index < 4 ? "eager" : "lazy"}
                          priority={index < 2}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
           </Link>
          ))}
        </div>
      )}
    </div>
  );
}
