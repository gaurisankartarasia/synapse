
// //src/app/post/page.tsx
// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { formatRelativeTime } from "@/utils/date";
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import { useAuth } from '@/hooks/useAuth';
// import { CircularProgress } from "@mui/material";
// import { Post } from "@/types/post";
// import LikesModal from './components/LikedByModal';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// import BookmarkIcon from '@mui/icons-material/Bookmark';

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
      
//       // Initialize like states for new posts
//       const newLikeStates: Record<string, { isLiked: boolean; count: number; loading: boolean }> = {};
//       data.posts.forEach((post: Post) => {
//         newLikeStates[post.id] = {
//           isLiked: false,
//           count: post.likeCount || 0,
//           loading: false
//         };
//       });
//       setLikeStates(prev => ({ ...prev, ...newLikeStates }));

//       const newSaveStates: Record<string, { loading: boolean }> = {};
//       data.posts.forEach((post: Post) => {
//         newSaveStates[post.id] = {
//           loading: false
//         };
//       });
//       setSaveStates(prev => ({ ...prev, ...newSaveStates }));
      
//       setHasMore(data.posts.length === POSTS_PER_PAGE);
//       setLastPostId(data.posts[data.posts.length - 1]?.id || null);
//     } catch (error) {
//       console.error(error);
//       alert("Error fetching posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch initial like status for all posts
//   useEffect(() => {
//     if (!user || posts.length === 0) return;

//     posts.forEach(async (post) => {
//       try {
//         const response = await fetch(`/api/post/like?postId=${post.id}`);
//         if (response.ok) {
//           const data = await response.json();
//           setLikeStates(prev => ({
//             ...prev,
//             [post.id]: {
//               ...prev[post.id],
//               isLiked: data.liked
//             }
//           }));
//         }
//       } catch (error) {
//         console.error('Error fetching like status:', error);
//       }
//     });
//   }, [posts, user]);

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
//           ? { ...post, is_saved: !post.is_saved }
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
//             ? { ...post, is_saved: !post.is_saved }
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

//    const ImageGallery = ({ images }: { images: string[] }) => (
//     <div className="grid grid-cols-2 gap-2 my-2">
//       {images.map((url, index) => (
//         <div key={index} className="relative aspect-square">
//           <Image
//             // src={`/api/proxy?url=${encodeURIComponent(url)}`}
//             src={url}

//             fill
//             sizes="(max-width: 468px) 50vw, (max-width: 600px) 50vw, 33vw"
//             className="object-cover rounded-lg"
//             alt={`Post image ${index + 1}`}
//             priority={index === 0}
//             loading={index === 0 ? "eager" : "lazy"}
//             quality={index === 0 ? 85 : 75}
//           />
//         </div>
//       ))}
//     </div>
//   );

//   const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
//     if (!hashtags || hashtags.length === 0) return null;


    

//     return (
//       <div className="flex gap-2 mt-2">
//         {hashtags.map((tag, index) => (
//           <Link 
//             key={index} 
//             href={`/hashtag/${tag.toLowerCase()}`}
//             className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm hover:underline"
//           >
//             #{tag}
//           </Link>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="mx-auto px-4">
//       {loading && <CircularProgress />}
//       <div className="space-y-4">
//         {posts.map((post, index) => (
//           <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
//             <div className="p-4 border-b">
//               <div className="flex items-center gap-2">
         
//          <Image src={post.photoURL}
//          height={30}
//          width={30}
//          alt="profile"
//          className="rounded-full"/>
//          <strong>{post.author}</strong>
//          {post.is_verified && "verified"}
//                 <span className="text-gray-600 text-sm">{formatRelativeTime(post.created_at)}</span>
//               </div>

//               <Link href={`/post/${post.id}`} className="block">
//                 <p className="mt-2 text-gray-800">{post.content}</p>
//                 {post.imageUrls?.length > 0 && <ImageGallery images={post.imageUrls} />}
//               </Link>
              
//               <HashtagDisplay hashtags={post.hashtags} />
//               {user && (
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           handleSave(post.id);
//         }}
//         disabled={saveStates[post.id]?.loading}
//         className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
//       >
//         {post.is_saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
//       </button>
//     )}


//               <div className="mt-4 flex items-center gap-4">
//                 {user && (
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleLike(post.id);
//                     }}
//                     disabled={likeStates[post.id]?.loading}
//                     className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
//                   >
//                     {likeStates[post.id]?.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setSelectedPostId(post.id)}
//                   className="hover:bg-gray-300 focus:outline-none"
//                 >
//                   <div className="flex items-center">
//                     {likeStates[post.id]?.count || 0} {(likeStates[post.id]?.count || 0) === 1 ? 'Like' : 'Likes'}
//                     <NavigateNextIcon />
//                   </div>
//                 </button>
//                 {post.allowCommenting && (
//                 <Link href={`/post/${post.id}`} className="flex items-center gap-1">
//                   <ChatBubbleOutlineIcon />
                 
//           <p>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</p>
       
//                   <NavigateNextIcon />
//                 </Link>
//                  )}
//               </div>
//             </div>
//           </div>
//         ))}
//         <LikesModal
//           isOpen={selectedPostId !== null}
//           onClose={() => setSelectedPostId(null)}
//           postId={selectedPostId || ''}
//         />
//       </div>
//       {loading && <div ref={loadingRef} className="py-4">Loading more posts...</div>}
//     </div>
//   );
// };

// export default PostPage;






















//src/app/post/page.tsx
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/utils/date";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAuth } from '@/hooks/useAuth';
import { CircularProgress } from "@mui/material";
import { Post } from "@/types/post";
import LikesModal from './components/LikedByModal';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const POSTS_PER_PAGE = 5;

const PostPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [likeStates, setLikeStates] = useState<Record<string, { isLiked: boolean; count: number; loading: boolean }>>({});
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [saveStates, setSaveStates] = useState<Record<string, { loading: boolean }>>({});

  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const hasFetchedInitial = useRef(false);
  const { user, loading: authLoading, error: authError } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchPosts = async (lastId: string | null = null) => {
    try {
      const url = `/api/post/display/query${lastId ? `?lastPostId=${lastId}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts((prev) => (lastId ? [...prev, ...data.posts] : data.posts));
      
      // Initialize like states using the is_liked value from the API
      const newLikeStates: Record<string, { isLiked: boolean; count: number; loading: boolean }> = {};
      data.posts.forEach((post: Post) => {
        newLikeStates[post.id] = {
          isLiked: post.is_liked || false,
          count: post.likeCount || 0,
          loading: false
        };
      });
      setLikeStates(prev => ({ ...prev, ...newLikeStates }));

      // ... rest of the function ...
    } catch (error) {
      console.error(error);
      alert("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  

  const handleLike = async (postId: string) => {
    if (!user || likeStates[postId]?.loading) return;

    const prevState = likeStates[postId];
    
    // Optimistic update
    setLikeStates(prev => ({
      ...prev,
      [postId]: {
        isLiked: !prev[postId].isLiked,
        count: prev[postId].isLiked ? prev[postId].count - 1 : prev[postId].count + 1,
        loading: true
      }
    }));

    try {
      const response = await fetch('/api/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setLikeStates(prev => ({
        ...prev,
        [postId]: prevState
      }));
    } finally {
      setLikeStates(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          loading: false
        }
      }));
    }
  };


  const handleSave = async (postId: string) => {
    if (!user || saveStates[postId]?.loading) return;

    const currentPost = posts.find(post => post.id === postId);
    if (!currentPost) return;
    
    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, is_saved: !post.is_saved }
          : post
      )
    );
    
    setSaveStates(prev => ({
      ...prev,
      [postId]: { loading: true }
    }));

    try {
      const response = await fetch('/api/post/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle save status');
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      // Revert optimistic update on error
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, is_saved: !post.is_saved }
            : post
        )
      );
    } finally {
      setSaveStates(prev => ({
        ...prev,
        [postId]: { loading: false }
      }));
    }
  };
  

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(lastPostId);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, lastPostId]
  );

  useEffect(() => {
    if (isClient && !hasFetchedInitial.current && !authLoading) {
      hasFetchedInitial.current = true;
      fetchPosts();
    }
  }, [authLoading, isClient]);

   const ImageGallery = ({ images }: { images: string[] }) => (
    <div className="grid grid-cols-2 gap-2 my-2">
      {images.map((url, index) => (
        <div key={index} className="relative aspect-square">
          <Image
            // src={`/api/proxy?url=${encodeURIComponent(url)}`}
            src={url}

            fill
            sizes="(max-width: 468px) 50vw, (max-width: 600px) 50vw, 33vw"
            className="object-cover rounded-lg"
            alt={`Post image ${index + 1}`}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            quality={index === 0 ? 85 : 75}
          />
        </div>
      ))}
    </div>
  );

  const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
    if (!hashtags || hashtags.length === 0) return null;


    

    return (
      <div className="flex gap-2 mt-2">
        {hashtags.map((tag, index) => (
          <Link 
            key={index} 
            href={`/hashtag/${tag.toLowerCase()}`}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm hover:underline"
          >
            #{tag}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto px-4">
      {loading && <CircularProgress />}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
         
         <Image src={post.photoURL}
         height={30}
         width={30}
         alt="profile"
         className="rounded-full"/>
         <strong>{post.author}</strong>
         {post.is_verified && "verified"}
                <span className="text-gray-600 text-sm">{formatRelativeTime(post.created_at)}</span>
              </div>

              <Link href={`/post/${post.id}`} className="block">
                <p className="mt-2 text-gray-800">{post.content}</p>
                {post.imageUrls?.length > 0 && <ImageGallery images={post.imageUrls} />}
              </Link>
              
              <HashtagDisplay hashtags={post.hashtags} />
              {user && (
      <button
        onClick={(e) => {
          e.preventDefault();
          handleSave(post.id);
        }}
        disabled={saveStates[post.id]?.loading}
        className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
      >
        {post.is_saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </button>
    )}


              <div className="mt-4 flex items-center gap-4">
                {user && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(post.id);
                    }}
                    disabled={likeStates[post.id]?.loading}
                    className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
                  >
                    {likeStates[post.id]?.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </button>
                )}
                <button
                  onClick={() => setSelectedPostId(post.id)}
                  className="hover:bg-gray-300 focus:outline-none"
                >
                  <div className="flex items-center">
                    {likeStates[post.id]?.count || 0} {(likeStates[post.id]?.count || 0) === 1 ? 'Like' : 'Likes'}
                    <NavigateNextIcon />
                  </div>
                </button>
                {post.allowCommenting && (
                <Link href={`/post/${post.id}`} className="flex items-center gap-1">
                  <ChatBubbleOutlineIcon />
                 
          <p>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</p>
       
                  <NavigateNextIcon />
                </Link>
                 )}
              </div>
            </div>
          </div>
        ))}
        <LikesModal
          isOpen={selectedPostId !== null}
          onClose={() => setSelectedPostId(null)}
          postId={selectedPostId || ''}
        />
      </div>
      {loading && <div ref={loadingRef} className="py-4">Loading more posts...</div>}
    </div>
  );
};

export default PostPage;