
// "use client";
// import { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { formatRelativeTime } from "@/utils/date";
// import { Spinner } from "@/components/ui/spinner";
// import { Button } from "@/components/ui/button";
// import { MessageSquare, ChevronRight } from 'lucide-react';
// import Likebutton from "@/app/post/lagacy_components/LikeButton";
// import { Post } from "@/types/post";

// const POSTS_PER_PAGE = 5;

// const HashtagPage = () => {
//   const { tag } = useParams();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastPostId, setLastPostId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const observer = useRef<IntersectionObserver | null>(null);
//   const loadingRef = useRef<HTMLDivElement>(null);

//   const fetchHashtagPosts = useCallback(async (lastId: string | null = null) => {
//     if (!tag) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const encodedTag = encodeURIComponent(tag as string);
//       const url = `/api/hashtag/${encodedTag}${lastId ? `?lastPostId=${lastId}` : ""}`;
      
//       const response = await fetch(url);
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch hashtag posts");
//       }

//       const data = await response.json();
      
//       setPosts((prev) => (lastId ? [...prev, ...data.posts] : data.posts));
//       setHasMore(data.hasMore);
      
//       if (data.posts.length > 0) {
//         setLastPostId(data.posts[data.posts.length - 1].id);
//       }
//     } catch (error) {
//       console.error("Error fetching hashtag posts:", error);
//       setError(error instanceof Error ? error.message : "An unknown error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }, [tag]); // Add tag as a dependency since it's used in the function

//   const lastPostElementRef = useCallback(
//     (node: HTMLDivElement) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           fetchHashtagPosts(lastPostId);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, lastPostId, fetchHashtagPosts] // Add fetchHashtagPosts as a dependency
//   );

//   useEffect(() => {
//     if (tag) {
//       fetchHashtagPosts();
//     }
//   }, [tag, fetchHashtagPosts]); // Add fetchHashtagPosts as a dependency

//   // Rest of the component remains the same...
  
//   // Including ImageGallery component and return statement for completeness
//   const ImageGallery = ({ images }: { images: string[] }) => (
//     <div className="grid grid-cols-2 gap-2 my-2">
//       {images.map((url, index) => (
//         <div key={index} className="relative aspect-square">
//           <Image
//             src={`/api/proxy?url=${encodeURIComponent(url)}`}
//             fill
//             sizes="(max-width: 468px) 50vw, (max-width: 600px) 50vw, 33vw"
//             className="object-cover rounded-md"
//             alt={`Post image ${index + 1}`}
//             priority={index === 0}
//             loading={index === 0 ? "eager" : "lazy"}
//             quality={index === 0 ? 85 : 75}
//           />
//         </div>
//       ))}
//     </div>
//   );

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <h1 className="text-3xl font-bold mb-4">Error</h1>
//         <p className="text-red-500">{error}</p>
//         <Button onClick={() => fetchHashtagPosts()}>
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   if (loading && posts.length === 0) {
//     return (
//       <div className="flex justify-center items-center">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">
//         Posts tagged with #{tag}
//       </h1>

//       {posts.length === 0 ? (
//         <div className="text-center t500">
//           No posts found for this hashtag.
//         </div>
//       ) : (
//         <div className="space-y-6">

//           {/* {posts.map((post, index) => (
//             <div 
//               key={post.postId} 
//               ref={index === posts.length - 1 ? lastPostElementRef : null}
//               className="bg-white shadow-md rounded-md p-6"
//             > */}

// {posts.map((post, index) => (
//   <div 
//     key={`${post.postId}-${index}`} 
//     ref={index === posts.length - 1 ? lastPostElementRef : null}
//     className="bg-white shadow-md rounded-md p-6"
//   >


//               <Link href={`/post/${post.postId}`} className="block">
//                    <Image src={post.profilePhotoURL}
//                         height={30}
//                         width={30}
//                         alt="profile"
//                         className="rounded-md"/>
//                         <strong>{post.username}</strong>
//                         {post.isVerified && "verified"}
//                 <div className="text-sm t600 mb-4">
//                   <span>{formatRelativeTime(post.createdAt)}</span>
//                 </div>

//                 {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}

//                 <p className="t800 mb-4">{post.content}</p>

//                 {post.hashtags && (
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {post.hashtags.map((hashtag) => (
//                       <Link 
//                         key={hashtag}
//                         href={`/hashtag/${hashtag.toLowerCase()}`}
//                         className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm hover:bg-blue-200"
//                       >
//                         #{hashtag}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </Link>

//               <div className="flex items-center t600">
//                 <Likebutton postId={post.postId} />
//                 <Link 
//                   href={`/post/${post.postId}`} 
//                   className="flex items-center space-x-2 hover:text-blue-600"
//                 >
//                   <MessageSquare />
//                   <span>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</span>
//                   <ChevronRight />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {loading && (
//         <div ref={loadingRef} className="flex justify-center my-8">
//           <Spinner />
//         </div>
//       )}

//       {!loading && posts.length > 0 && !hasMore && (
//         <div className="text-center t500 mt-8">
//           No more posts to load
//         </div>
//       )}
//     </div>
//   );
// };

// export default HashtagPage;











"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/utils/date";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight } from 'lucide-react';
import { TestPost } from "@/types/post";

const POSTS_PER_PAGE = 5;

interface HashtagPageProps {
  tag: string;
}

const HashtagPage: React.FC<HashtagPageProps> = ({ tag }) => {
  const [posts, setPosts] = useState<TestPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const fetchHashtagPosts = useCallback(async (lastId: string | null = null) => {
    if (!tag) return;

    try {
      setLoading(true);
      setError(null);

      const encodedTag = encodeURIComponent(tag);
      const url = `/api/hashtag/${encodedTag}${lastId ? `?lastPostId=${lastId}` : ""}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch hashtag posts");
      }

      const data = await response.json();
      
      setPosts((prev) => (lastId ? [...prev, ...data.posts] : data.posts));
      setHasMore(data.hasMore);
      
      if (data.posts.length > 0) {
        setLastPostId(data.posts[data.posts.length - 1].id);
      }
    } catch (error) {
      console.error("Error fetching hashtag posts:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [tag]);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchHashtagPosts(lastPostId);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, lastPostId, fetchHashtagPosts]
  );

  useEffect(() => {
    if (tag) {
      fetchHashtagPosts();
    }
  }, [tag, fetchHashtagPosts]);

  // Rest of the component remains the same...
  
  // Including ImageGallery component and return statement for completeness
  const ImageGallery = ({ images }: { images: string[] }) => (
    <div className="grid grid-cols-2 gap-2 my-2">
      {images.map((url, index) => (
        <div key={index} className="relative aspect-square">
          <Image
            src={`/api/proxy?url=${encodeURIComponent(url)}`}
            fill
            sizes="(max-width: 468px) 50vw, (max-width: 600px) 50vw, 33vw"
            className="object-cover rounded-md"
            alt={`Post image ${index + 1}`}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            quality={index === 0 ? 85 : 75}
          />
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <Button onClick={() => fetchHashtagPosts()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Posts tagged with #{tag}
      </h1>

      {posts.length === 0 ? (
        <div className="text-center t500">
          No posts found for this hashtag.
        </div>
      ) : (
        <div className="space-y-6">

{posts.map((post, index) => (
  <div 
    key={`${post.postId}-${index}`} 
    ref={index === posts.length - 1 ? lastPostElementRef : null}
    className="bg-white shadow-md rounded-md p-6"
  >


              <div  >
                   <Image src={post.user.profilePhotoURL}
                        height={30}
                        width={30}
                        alt="profile"
                        className="rounded-full object-cover"/>
                        <strong>{post.user.username}</strong>
                        {post.user.isVerified && "verified"}
                <div className="text-sm t600 mb-4">
                  <span>{formatRelativeTime(post.createdAt)}</span>
                </div>

                {post.imageURLs?.length > 0 && <ImageGallery images={post.imageURLs} />}

                <p className="t800 mb-4">{post.content}</p>

                {post.hashtags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((hashtag) => (
                      <Link 
                        key={hashtag}
                        href={`/hashtag/${hashtag.toLowerCase()}`}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm hover:bg-blue-200"
                      >
                        #{hashtag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center ">
             
                <Link 
                  href={`/post/${post.postId}`} 
                  className="flex items-center space-x-2 hover:text-blue-600"
                >
                  <MessageSquare />
                  <span>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</span>
                  <ChevronRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div ref={loadingRef} className="flex justify-center my-8">
          <Spinner />
        </div>
      )}

      {!loading && posts.length > 0 && !hasMore && (
        <div className="text-center t500 mt-8">
         You reached the end
        </div>
      )}
    </div>
  );
};

export default HashtagPage;













