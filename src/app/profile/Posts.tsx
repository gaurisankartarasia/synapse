

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Post } from '@/types/post';
import Link from 'next/link';
import { Spinner } from "@/components/ui/spinner";
import { Heart, MessageSquareText } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface UserPostsProps {
  uid: string;
  currentUserUid?: string;
}

export default function UserPosts({ uid, currentUserUid }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const hasFetched = useRef(false);
  const hasFetchedSaved = useRef(false);

  // Fetch regular posts
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

  // Fetch saved posts only when needed
  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!currentUserUid || currentUserUid !== uid || hasFetchedSaved.current) return;

      try {
        setSavedLoading(true);
        const response = await fetch(`/api/user-profile/post/saved?uid=${encodeURIComponent(uid)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to fetch saved posts');
        }

        setSavedPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching saved posts:', err);
      } finally {
        setSavedLoading(false);
        hasFetchedSaved.current = true;
      }
    };

    if (activeTab === 'saved') {
      fetchSavedPosts();
    }
  }, [activeTab, currentUserUid, uid]);

  if (!uid) return null;
  if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  
  if (isPrivate) {
    return <p className="text-lg font-medium text-center">This user's posts are private</p>;
  }

  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-600">{error}</div>;
  }

  const PostGrid = ({ posts }: { posts: Post[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Link href={`/post/${post.postId}`} key={post.postId} className="overflow-hidden">
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
            )}
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 mt-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          {currentUserUid === uid && (
            <TabsTrigger value="saved">Saved</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="posts">
          <div className="flex items-center justify-between mb-4">
            <b>Uploads</b>
            <span className="text-sm t600">{posts.length} posts</span>
          </div>
          
          {posts.length === 0 ? (
            <div className="flex items-center justify-center p-8 t500">No posts yet</div>
          ) : (
            <PostGrid posts={posts} />
          )}
        </TabsContent>

        {currentUserUid === uid && (
          <TabsContent value="saved">
            <div className="flex items-center justify-between mb-4">
              <b>Saved Posts</b>
              <span className="text-sm t600">{savedPosts.length} saved</span>
            </div>

            {savedLoading ? (
              <div className="flex justify-center p-8"><Spinner /></div>
            ) : savedPosts.length === 0 ? (
              <div className="flex items-center justify-center p-8 t500">No saved posts</div>
            ) : (
              <PostGrid posts={savedPosts} />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}








// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { Post } from '@/types/post';
// import Link from 'next/link';
// import { Spinner } from "@/components/ui/spinner";
// import { Heart, MessageSquareText } from 'lucide-react';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";

// interface UserPostsProps {
//   uid: string;
//   currentUserUid?: string;
// }

// export default function UserPosts({ uid, currentUserUid }: UserPostsProps) {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [savedPosts, setSavedPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [savedLoading, setSavedLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isPrivate, setIsPrivate] = useState(false);
//   const [activeTab, setActiveTab] = useState('posts');
//   const hasFetched = useRef(false);
//   const hasFetchedSaved = useRef(false);

//   // Fetch regular posts
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch(`/api/user/posts/query?uid=${encodeURIComponent(uid)}`);
//         const data = await response.json();

//         if (response.status === 403) {
//           setIsPrivate(true);
//           setError(null);
//           return;
//         }

//         if (!response.ok) {
//           throw new Error(data.error || data.message || 'Failed to fetch posts');
//         }

//         setPosts(data.posts || []);
//         setIsPrivate(false);
//         setError(null);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load posts');
//         console.error('Error fetching posts:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (uid && !hasFetched.current) {
//       hasFetched.current = true;
//       fetchPosts();
//     }
//   }, [uid]);

//   // Fetch saved posts only when needed
//   useEffect(() => {
//     const fetchSavedPosts = async () => {
//       if (!currentUserUid || currentUserUid !== uid || hasFetchedSaved.current) return;

//       try {
//         setSavedLoading(true);
//         const response = await fetch(`/api/user-profile/post/saved?uid=${encodeURIComponent(uid)}`);
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || data.message || 'Failed to fetch saved posts');
//         }

//         setSavedPosts(data.posts || []);
//       } catch (err) {
//         console.error('Error fetching saved posts:', err);
//       } finally {
//         setSavedLoading(false);
//         hasFetchedSaved.current = true;
//       }
//     };

//     if (activeTab === 'saved') {
//       fetchSavedPosts();
//     }
//   }, [activeTab, currentUserUid, uid]);

//   if (!uid) return null;
//   if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  
//   if (isPrivate) {
//     return <p className="text-lg font-medium text-center">This user's posts are private</p>;
//   }

//   if (error) {
//     return <div className="flex items-center justify-center p-8 text-red-600">{error}</div>;
//   }

//   const PostGrid = ({ posts }: { posts: Post[] }) => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"  >
//       {posts.map((post) => (
        
// <div key={post.postId} >


//         <Link href={`/post/${post.postId}`} className="overflow-hidden">
//           <div className="relative group">
//             {post.imageURLs && post.imageURLs.length > 0 && (
//               <div className="relative aspect-square overflow-hidden">
//                 <Image 
//                   src={post.imageURLs[0]} 
//                   alt={`Post image`} 
//                   fill 
//                   className="object-cover rounded transition-opacity duration-300 group-hover:opacity-50" 
//                   loading="eager" 
//                   priority 
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="text-white text-lg font-semibold bg-black bg-opacity-50 p-2 rounded">
//                     <div className="flex items-center space-x-1">
//                       <Heart className="w-4 h-4" />
//                       <span>{post.likeCount}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <MessageSquareText className="w-4 h-4" />
//                       <span>{post.commentCount}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Link>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="space-y-4 mt-12">
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="posts">Posts</TabsTrigger>
//           {currentUserUid === uid && (
//             <TabsTrigger value="saved">Saved</TabsTrigger>
//           )}
//         </TabsList>
        
//         <TabsContent value="posts">
//           <div className="flex items-center justify-between mb-4">
//             <b>Uploads</b>
//             <span className="text-sm t600">{posts.length} posts</span>
//           </div>
          
//           {posts.length === 0 ? (
//             <div className="flex items-center justify-center p-8 t500">No posts yet</div>
//           ) : (
//             <PostGrid posts={posts} />
//           )}
//         </TabsContent>

//         {currentUserUid === uid && (
//           <TabsContent value="saved">
//             <div className="flex items-center justify-between mb-4">
//               <b>Saved Posts</b>
//               <span className="text-sm t600">{savedPosts.length} saved</span>
//             </div>

//             {savedLoading ? (
//               <div className="flex justify-center p-8"><Spinner /></div>
//             ) : savedPosts.length === 0 ? (
//               <div className="flex items-center justify-center p-8 t500">No saved posts</div>
//             ) : (
//               <PostGrid posts={savedPosts} />
//             )}
//           </TabsContent>
//         )}
//       </Tabs>
//     </div>
//   );
// }




