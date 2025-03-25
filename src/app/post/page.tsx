

// "use client";
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useAuth } from '@/hooks/useAuth';
// import { PostSkeleton } from '@/components/Skeleton-loaders/feed-post';
// import { usePosts } from '@/hooks/post/feed/usePosts';
// import { usePostActions } from '@/hooks/post/feed/usePostActions';
// import { PostHeader } from './lagacy_components/PostHeader';
// import { PostActions } from './lagacy_components/PostActions';
// import LikesModal from './lagacy_components/LikedByModal';
// import ImageGallery from "./lagacy_components/ImageGallery";
// import Link from "next/link";


// // Helper function to parse and render text with @mentions as links
// const Text = ({ content }: { content: string }) => {
//   if (!content) return null;
  
//   // Regular expression to match @username
//   const mentionRegex = /@([a-zA-Z0-9_\.]+)/g;
  
//   // Create array to store all elements
//   const elements: React.ReactNode[] = [];
  
//   // Keep track of the last index we processed
//   let lastIndex = 0;
  
//   // Find all matches
//   let match;
//   while ((match = mentionRegex.exec(content)) !== null) {
//     // Add text before the match
//     if (match.index > lastIndex) {
//       elements.push(
//         <span key={`text-${lastIndex}`}>
//           {content.substring(lastIndex, match.index)}
//         </span>
//       );
//     }
    
//     // Add the mention link
//     const username = match[1]; // The captured username without @
//     elements.push(
//       <Link 
//         href={`/${username}`} 
//         key={`mention-${match.index}`} 
//         className="text-blue-500 hover:underline font-medium"
//       >
//         @{username}
//       </Link>
//     );
    
//     // Update lastIndex to end of current match
//     lastIndex = match.index + match[0].length;
//   }
  
//   // Add any remaining text after the last match
//   if (lastIndex < content.length) {
//     elements.push(
//       <span key={`text-${lastIndex}`}>
//         {content.substring(lastIndex)}
//       </span>
//     );
//   }
  
//   return <>{elements}</>;
// };

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
//     [loading, hasMore, lastPostId, fetchPosts, initializeLikeStates]
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
//   }, [authLoading, isClient, fetchPosts, hasFetchedInitial, initializeLikeStates]);

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
//       <div >
//         {posts.length > 0 ? (
//           posts.map((post, index) => (
//             <div key={post.postId} ref={index === posts.length - 1 ? lastPostElementRef : null}>
//               <div className="p-4 border-b">
//                 <PostHeader
//                   post={post}
//                   user={user}
//                   onSave={() => handleSave(post.postId, user)}
//                   saveDisabled={saveStates[post.postId]?.loading}
//                 />

//                 <div className="mt-2 ">
//                   <Text content={post.content} />
//                 </div>
                
//                 {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}

//                 <HashtagDisplay hashtags={post.hashtags} />

//                 <PostActions
//                   post={post}
//                   user={user}
//                   likeCount={likeStates[post.postId]?.count || 0}
//                   isLiked={likeStates[post.postId]?.isLiked || false}
//                   onLike={() => handleLike(post.postId, user)}
//                   likeDisabled={likeStates[post.postId]?.loading}
//                   onLikesClick={() => setSelectedPostId(post.postId)}
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







// PostPage.tsx (or whatever your main file is named)
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from '@/hooks/useAuth';
import { PostSkeleton } from '@/components/Skeleton-loaders/feed-post';
import { usePosts } from '@/hooks/post/feed/usePosts';
import { usePostActions } from '@/hooks/post/feed/usePostActions';
import { PostHeader } from './lagacy_components/PostHeader';
import { PostActions } from './lagacy_components/PostActions';
import LikesModal from './lagacy_components/LikedByModal';
import ImageGallery from "./lagacy_components/ImageGallery";
import Link from "next/link";
import TextContent from "./lagacy_components/TextContent"; 
import { HashtagDisplay } from "./lagacy_components/Hashtag";



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
    saveStates,
    archiveStates,
    handleLike,
    handleSave,
    handleArchive,
    handleDelete,
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
    [loading, hasMore, lastPostId, fetchPosts, initializeLikeStates]
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
  }, [authLoading, isClient, fetchPosts, hasFetchedInitial, initializeLikeStates]);


  return (
    <div className="">
      {loading && <PostSkeleton />}
      <div >
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post.postId} ref={index === posts.length - 1 ? lastPostElementRef : null}>
              <div className="p-4 border-b">
                <PostHeader
                  post={post}
                  user={user}
                  onSave={() => handleSave(post.postId, user)}
                  saveDisabled={saveStates[post.postId]?.loading}
                  onDelete={() => handleDelete(post.postId, user, post)}
                  onArchive={() => handleArchive(post.postId, user)}
                  deleteDisabled={false}
                  archiveDisabled={archiveStates[post.postId]?.loading}
                />

                <div className="m-4 ">
                  <TextContent content={post.content} />
                </div>
                
                {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}

                <HashtagDisplay hashtags={post.hashtags} />

                <PostActions
                  post={post}
                  user={user}
                  likeCount={likeStates[post.postId]?.count || 0}
                  isLiked={likeStates[post.postId]?.isLiked || false}
                  onLike={() => handleLike(post.postId, user)}
                  likeDisabled={likeStates[post.postId]?.loading}
                  onLikesClick={() => setSelectedPostId(post.postId)}
                  
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