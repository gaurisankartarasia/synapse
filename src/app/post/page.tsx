
// //src/app/post/page.tsx
// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { formatRelativeTime } from "@/utils/date";
// import { useAuth } from '@/hooks/useAuth';
// import { Spinner } from "@/components/ui/spinner";
// import { Post } from "@/types/post";
// import LikesModal from './components/LikedByModal';
// import { Bookmark, MessageSquare, ChevronRight } from 'lucide-react';
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { RiVerifiedBadgeFill } from "react-icons/ri";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import ImageGallery from "./components/ImageGallery";
// import { FaBookmark, FaRegBookmark } from "react-icons/fa";
// import { UserHoverCard } from "@/components/user-profile-hover-card";
// import { PostSkeleton } from '@/components/Skeleton-loaders/feed-post'


// const POSTS_PER_PAGE = 5;

// const PostPage = () => {
//   const [isClient, setIsClient] = useState(false);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastPostId, setLastPostId] = useState<string | null>(null);
//   const [likeStates, setLikeStates] = useState<Record<string, { isLiked: boolean; count: number; loading: boolean }>>({});
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const [saveStates, setSaveStates] = useState<Record<string, { loading: boolean }>>({});

//   const observer = useRef<IntersectionObserver | null>(null);
//   const loadingRef = useRef<HTMLDivElement>(null);
//   const hasFetchedInitial = useRef(false);
//   const { user, loading: authLoading, error: authError } = useAuth();

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const fetchPosts = async (lastId: string | null = null) => {
//     try {
//       const url = `/api/post/display/query${lastId ? `?lastPostId=${lastId}` : ""}`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch posts");

//       const data = await response.json();
//       setPosts((prev) => (lastId ? [...prev, ...data.posts] : data.posts));

//       // Initialize like states using the isLiked value from the API
//       const newLikeStates: Record<string, { isLiked: boolean; count: number; loading: boolean }> = {};
//       data.posts.forEach((post: Post) => {
//         newLikeStates[post.id] = {
//           isLiked: post.isLiked || false,
//           count: post.likeCount || 0,
//           loading: false
//         };
//       });
//       setLikeStates(prev => ({ ...prev, ...newLikeStates }));

//     } catch (error) {
//       console.error(error);
//       alert("Error fetching posts");
//     } finally {
//       setLoading(false);
//     }
//   };



//   const handleLike = async (postId: string) => {
//     if (!user || likeStates[postId]?.loading) return;

//     const prevState = likeStates[postId];

//     // Optimistic update
//     setLikeStates(prev => ({
//       ...prev,
//       [postId]: {
//         isLiked: !prev[postId].isLiked,
//         count: prev[postId].isLiked ? prev[postId].count - 1 : prev[postId].count + 1,
//         loading: true
//       }
//     }));

//     try {
//       const response = await fetch('/api/post/like', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           credentials: 'include',
//         },
//         body: JSON.stringify({ postId }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to toggle like');
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Revert optimistic update on error
//       setLikeStates(prev => ({
//         ...prev,
//         [postId]: prevState
//       }));
//     } finally {
//       setLikeStates(prev => ({
//         ...prev,
//         [postId]: {
//           ...prev[postId],
//           loading: false
//         }
//       }));
//     }
//   };


//   const handleSave = async (postId: string) => {
//     if (!user || saveStates[postId]?.loading) return;

//     const currentPost = posts.find(post => post.id === postId);
//     if (!currentPost) return;

//     // Optimistic update
//     setPosts(prevPosts =>
//       prevPosts.map(post =>
//         post.id === postId
//           ? { ...post, isSaved: !post.isSaved }
//           : post
//       )
//     );

//     setSaveStates(prev => ({
//       ...prev,
//       [postId]: { loading: true }
//     }));

//     try {
//       const response = await fetch('/api/post/save', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           credentials: 'include',
//         },
//         body: JSON.stringify({ postId }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to toggle save status');
//       }
//     } catch (error) {
//       console.error('Error toggling save status:', error);
//       // Revert optimistic update on error
//       setPosts(prevPosts =>
//         prevPosts.map(post =>
//           post.id === postId
//             ? { ...post, isSaved: !post.isSaved }
//             : post
//         )
//       );
//     } finally {
//       setSaveStates(prev => ({
//         ...prev,
//         [postId]: { loading: false }
//       }));
//     }
//   };


//   const lastPostElementRef = useCallback(
//     (node: HTMLDivElement) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           fetchPosts(lastPostId);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, lastPostId]
//   );

//   useEffect(() => {
//     if (isClient && !hasFetchedInitial.current && !authLoading) {
//       hasFetchedInitial.current = true;
//       fetchPosts();
//     }
//   }, [authLoading, isClient]);

//   const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
//     if (!hashtags || hashtags.length === 0) return null;




//     return (
//       <div className="flex gap-2 mt-2">
//         {hashtags.map((tag, index) => (
//           <Link
//             key={index}
//             href={`/hashtag/${tag.toLowerCase()}`}
//             className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm hover:underline"
//           >
//             #{tag}
//           </Link>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="">
//       {loading && <PostSkeleton />}
//       <div className="">


//         {posts.length > 0 ? (
//           posts.map((post, index) => (
//             <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
//               <div className="p-4 border-b">
//                 <div className="flex items-center gap-2">



//                   <Avatar>
//                     <AvatarImage src={post.profilePhotoURL} alt={post.username} />
//                     <AvatarFallback>{post.username.slice(0, 2)}</AvatarFallback>
//                   </Avatar>
//                   <UserHoverCard username={post.username} >
//                   <Link href={`/${post.username}`} className="hover:opacity-60 cursor-pointer font-semibold">{post.username}</Link>


//                   </UserHoverCard>
//                   {post.isVerified && <RiVerifiedBadgeFill />}
//                   <span className="t600 text-sm">{formatRelativeTime(post.createdAt)}</span>
//                   <div className="float-end">

//                     {user && (
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleSave(post.id);
//                         }}
//                         disabled={saveStates[post.id]?.loading}
//                         className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
//                       >
//                         {post.isSaved ? <FaBookmark size={15} /> : <FaRegBookmark size={15} />}
//                       </button>
//                     )}
//                   </div>
//                 </div>


//                 {/* <Link href={`/post/${post.id}`} className="block"> */}
//                 <p className="mt-2 t800">{post.content}</p>
//                 {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}
//                 {/* </Link> */}

//                 <HashtagDisplay hashtags={post.hashtags} />



//                 <div className="mt-4 flex items-center gap-4">

//                   <div className="flex items-center">
                    
//                     {user && (
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleLike(post.id);
//                         }}
//                         disabled={likeStates[post.id]?.loading}
//                         className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
//                       >
//                         {likeStates[post.id]?.isLiked ? <FaHeart color="red" size={20} /> : < FaRegHeart size={20} />}

//                       </button>
//                     )}
                    
//                     <button
//                       onClick={() => setSelectedPostId(post.id)}
//                       className="hover:bg-gray-300 focus:outline-none"
//                     >
//                       <div className="flex items-center">
//                         {likeStates[post.id]?.count || 0} {(likeStates[post.id]?.count || 0) === 1 ? 'Like' : 'Likes'}
//                         <ChevronRight />
//                       </div>
//                     </button>


//                   </div>

//                   {post.allowCommenting && (
//                     <Link href={`/post/${post.id}`} className="flex items-center gap-1">
//                       <MessageSquare size={20} />

//                       <p>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</p>

//                       <ChevronRight size={20} />
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : !loading && (
//           <div className="flex flex-col items-center justify-center py-12">
//             <p className="t600 text-lg">No posts available</p>
//             <p className="t500 mt-2">Be the first to create a post!</p>
//             <Link className="text-blue-500 hover:underline" href={'/post/create'}>Create</Link>
//           </div>
//         )}
//         <LikesModal
//           isOpen={selectedPostId !== null}
//           onClose={() => setSelectedPostId(null)}
//           postId={selectedPostId || ''}
//         />
//       </div>
//       {/* {loading && <div ref={loadingRef} className="py-4">Loading more posts...</div>} */}
//     </div>
//   );
// };

// export default PostPage;











// // src/app/post/page.tsx
// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { useAuth } from '@/hooks/useAuth';
// import { PostSkeleton } from '@/components/Skeleton-loaders/feed-post';
// import { usePosts } from '@/hooks/usePosts';
// import { usePostActions } from '@/hooks/usePostActions';
// import { PostHeader } from './components/PostHeader';
// import { PostActions } from './components/PostActions';
// import LikesModal from './components/LikedByModal';
// import ImageGallery from "./components/ImageGallery";
// import Link from "next/link";

// const PostPage = () => {
//   const [isClient, setIsClient] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const observer = useRef<IntersectionObserver | null>(null);
//   const { user, loading: authLoading } = useAuth();
  
//   const {
//     posts,
//     setPosts,
//     loading,
//     hasMore,
//     lastPostId,
//     hasFetchedInitial,
//     fetchPosts
//   } = usePosts();

//   const {
//     likeStates,
//     setLikeStates,
//     saveStates,
//     handleLike,
//     handleSave
//   } = usePostActions(setPosts);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const lastPostElementRef = useCallback(
//     (node: HTMLDivElement) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           fetchPosts(lastPostId);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, lastPostId]
//   );

//   useEffect(() => {
//     if (isClient && !hasFetchedInitial.current && !authLoading) {
//       hasFetchedInitial.current = true;
//       fetchPosts();
//     }
//   }, [authLoading, isClient]);

//   const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
//     if (!hashtags || hashtags.length === 0) return null;

//     return (
//       <div className="flex gap-2 mt-2">
//         {hashtags.map((tag, index) => (
//           <Link
//             key={index}
//             href={`/hashtag/${tag.toLowerCase()}`}
//             className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm hover:underline"
//           >
//             #{tag}
//           </Link>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="">
//       {loading && <PostSkeleton />}
//       <div className="">
//         {posts.length > 0 ? (
//           posts.map((post, index) => (
//             <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
//               <div className="p-4 border-b">
//                 <PostHeader
//                   post={post}
//                   user={user}
//                   onSave={() => handleSave(post.id, user)}
//                   saveDisabled={saveStates[post.id]?.loading}
//                 />

//                 <p className="mt-2 t800">{post.content}</p>
//                 {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}

//                 <HashtagDisplay hashtags={post.hashtags} />

//                 <PostActions
//                   post={post}
//                   user={user}
//                   likeCount={likeStates[post.id]?.count || 0}
//                   isLiked={likeStates[post.id]?.isLiked || false}
//                   onLike={() => handleLike(post.id, user)}
//                   likeDisabled={likeStates[post.id]?.loading}
//                   onLikesClick={() => setSelectedPostId(post.id)}
//                 />
//               </div>
//             </div>
//           ))
//         ) : !loading && (
//           <div className="flex flex-col items-center justify-center py-12">
//             <p className="t600 text-lg">No posts available</p>
//             <p className="t500 mt-2">Be the first to create a post!</p>
//             <Link className="text-blue-500 hover:underline" href={'/post/create'}>Create</Link>
//           </div>
//         )}
//         <LikesModal
//           isOpen={selectedPostId !== null}
//           onClose={() => setSelectedPostId(null)}
//           postId={selectedPostId || ''}
//         />
//       </div>
//     </div>
//   );
// };

// export default PostPage;










// // src/app/post/page.tsx
// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { useAuth } from '@/hooks/useAuth';
// import { PostSkeleton } from '@/components/Skeleton-loaders/feed-post';
// import { usePosts } from '@/hooks/usePosts';
// import { usePostActions } from '@/hooks/usePostActions';
// import { PostHeader } from './components/PostHeader';
// import { PostActions } from './components/PostActions';
// import LikesModal from './components/LikedByModal';
// import ImageGallery from "./components/ImageGallery";
// import Link from "next/link";

// const PostPage = () => {
//   const [isClient, setIsClient] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const observer = useRef<IntersectionObserver | null>(null);
//   const { user, loading: authLoading } = useAuth();
  
//   const {
//     posts,
//     setPosts,
//     loading,
//     hasMore,
//     lastPostId,
//     hasFetchedInitial,
//     fetchPosts
//   } = usePosts();

//   const {
//     likeStates,
//     setLikeStates,
//     saveStates,
//     handleLike,
//     handleSave,
//     initializeLikeStates
//   } = usePostActions(setPosts);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const lastPostElementRef = useCallback(
//     (node: HTMLDivElement) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           const loadMore = async () => {
//             const newPosts = await fetchPosts(lastPostId);
//             initializeLikeStates(newPosts);
//           };
//           loadMore();
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, lastPostId]
//   );

//   useEffect(() => {
//     const init = async () => {
//       if (isClient && !hasFetchedInitial.current && !authLoading) {
//         hasFetchedInitial.current = true;
//         const fetchedPosts = await fetchPosts();
//         initializeLikeStates(fetchedPosts);
//       }
//     };
//     init();
//   }, [authLoading, isClient]);

//   const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
//     if (!hashtags || hashtags.length === 0) return null;

//     return (
//       <div className="flex gap-2 mt-2">
//         {hashtags.map((tag, index) => (
//           <Link
//             key={index}
//             href={`/hashtag/${tag.toLowerCase()}`}
//             className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm hover:underline"
//           >
//             #{tag}
//           </Link>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="">
//       {loading && <PostSkeleton />}
//       <div className="">
//         {posts.length > 0 ? (
//           posts.map((post, index) => (
//             <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
//               <div className="p-4 border-b">
//                 <PostHeader
//                   post={post}
//                   user={user}
//                   onSave={() => handleSave(post.id, user)}
//                   saveDisabled={saveStates[post.id]?.loading}
//                 />

//                 <p className="mt-2 t800">{post.content}</p>
//                 {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}

//                 <HashtagDisplay hashtags={post.hashtags} />

//                 <PostActions
//                   post={post}
//                   user={user}
//                   likeCount={likeStates[post.id]?.count || 0}
//                   isLiked={likeStates[post.id]?.isLiked || false}
//                   onLike={() => handleLike(post.id, user)}
//                   likeDisabled={likeStates[post.id]?.loading}
//                   onLikesClick={() => setSelectedPostId(post.id)}
//                 />
//               </div>
//             </div>
//           ))
//         ) : !loading && (
//           <div className="flex flex-col items-center justify-center py-12">
//             <p className="t600 text-lg">No posts available</p>
//             <p className="t500 mt-2">Be the first to create a post!</p>
//             <Link className="text-blue-500 hover:underline" href={'/post/create'}>Create</Link>
//           </div>
//         )}
//         <LikesModal
//           isOpen={selectedPostId !== null}
//           onClose={() => setSelectedPostId(null)}
//           postId={selectedPostId || ''}
//         />
//       </div>
//     </div>
//   );
// };

// export default PostPage;



"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from '@/hooks/useAuth';
import { PostSkeleton } from '@/components/Skeleton-loaders/feed-post';
import { usePosts } from '@/hooks/usePosts';
import { usePostActions } from '@/hooks/usePostActions';
import { PostHeader } from './components/PostHeader';
import { PostActions } from './components/PostActions';
import LikesModal from './components/LikedByModal';
import ImageGallery from "./components/ImageGallery";
import Link from "next/link";

// Helper function to parse and render text with @mentions as links
const Text = ({ content }: { content: string }) => {
  if (!content) return null;
  
  // Regular expression to match @username
  const mentionRegex = /@([a-zA-Z0-9_\.]+)/g;
  
  // Create array to store all elements
  const elements: React.ReactNode[] = [];
  
  // Keep track of the last index we processed
  let lastIndex = 0;
  
  // Find all matches
  let match;
  while ((match = mentionRegex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {content.substring(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add the mention link
    const username = match[1]; // The captured username without @
    elements.push(
      <Link 
        href={`/${username}`} 
        key={`mention-${match.index}`} 
        className="text-blue-500 hover:underline font-medium"
      >
        @{username}
      </Link>
    );
    
    // Update lastIndex to end of current match
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last match
  if (lastIndex < content.length) {
    elements.push(
      <span key={`text-${lastIndex}`}>
        {content.substring(lastIndex)}
      </span>
    );
  }
  
  return <>{elements}</>;
};

const PostPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const { user, loading: authLoading } = useAuth();
  
  const {
    posts,
    setPosts,
    loading,
    hasMore,
    lastPostId,
    hasFetchedInitial,
    fetchPosts
  } = usePosts();

  const {
    likeStates,
    setLikeStates,
    saveStates,
    handleLike,
    handleSave,
    initializeLikeStates
  } = usePostActions(setPosts);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const loadMore = async () => {
            const newPosts = await fetchPosts(lastPostId);
            initializeLikeStates(newPosts);
          };
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, lastPostId]
  );

  useEffect(() => {
    const init = async () => {
      if (isClient && !hasFetchedInitial.current && !authLoading) {
        hasFetchedInitial.current = true;
        const fetchedPosts = await fetchPosts();
        initializeLikeStates(fetchedPosts);
      }
    };
    init();
  }, [authLoading, isClient]);

  const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
    if (!hashtags || hashtags.length === 0) return null;

    return (
      <div className="flex gap-2 mt-2">
        {hashtags.map((tag, index) => (
          <Link
            key={index}
            href={`/hashtag/${tag.toLowerCase()}`}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm hover:underline"
          >
            #{tag}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      {loading && <PostSkeleton />}
      <div className="">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
              <div className="p-4 border-b">
                <PostHeader
                  post={post}
                  user={user}
                  onSave={() => handleSave(post.id, user)}
                  saveDisabled={saveStates[post.id]?.loading}
                />

                <div className="mt-2 ">
                  <Text content={post.content} />
                </div>
                
                {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}

                <HashtagDisplay hashtags={post.hashtags} />

                <PostActions
                  post={post}
                  user={user}
                  likeCount={likeStates[post.id]?.count || 0}
                  isLiked={likeStates[post.id]?.isLiked || false}
                  onLike={() => handleLike(post.id, user)}
                  likeDisabled={likeStates[post.id]?.loading}
                  onLikesClick={() => setSelectedPostId(post.id)}
                />
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="t600 text-lg">No posts available</p>
            <p className="t500 mt-2">Be the first to create a post!</p>
            <Link className="text-blue-500 hover:underline" href={'/post/create'}>Create</Link>
          </div>
        )}
        <LikesModal
          isOpen={selectedPostId !== null}
          onClose={() => setSelectedPostId(null)}
          postId={selectedPostId || ''}
        />
      </div>
    </div>
  );
};

export default PostPage;