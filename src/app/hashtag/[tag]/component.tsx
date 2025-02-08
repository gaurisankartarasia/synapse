
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CircularProgress, Button } from "@mui/material";
import { formatRelativeTime } from "@/utils/date";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Likebutton from "@/app/post/components/LikeButton";
import { PostHeader } from "@/app/post/components/PostHeader";
import { Post } from "@/types/post";

const POSTS_PER_PAGE = 5;

const HashtagPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
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

      const encodedTag = encodeURIComponent(tag as string);
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
  }, [tag]); // Add tag as a dependency since it's used in the function

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
    [loading, hasMore, lastPostId, fetchHashtagPosts] // Add fetchHashtagPosts as a dependency
  );

  useEffect(() => {
    if (tag) {
      fetchHashtagPosts();
    }
  }, [tag, fetchHashtagPosts]); // Add fetchHashtagPosts as a dependency

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
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Posts tagged with #{tag}
      </h1>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500">
          No posts found for this hashtag.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              ref={index === posts.length - 1 ? lastPostElementRef : null}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <Link href={`/post/${post.id}`} className="block">
                <PostHeader 
                  authorUsername={post.author}
                  authorPhotoURL={post.photoURL}
                  authorDisplayName={post.displayName}
                  authorVerified={post.is_verified}
                />
                <div className="text-sm text-gray-600 mb-4">
                  <span>{formatRelativeTime(post.created_at)}</span>
                </div>

                {post.imageUrls?.length > 0 && <ImageGallery images={post.imageUrls} />}

                <p className="text-gray-800 mb-4">{post.content}</p>

                {post.hashtags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((hashtag) => (
                      <Link 
                        key={hashtag}
                        href={`/hashtag/${hashtag.toLowerCase()}`}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm hover:bg-blue-200"
                      >
                        #{hashtag}
                      </Link>
                    ))}
                  </div>
                )}
              </Link>

              <div className="flex items-center text-gray-600">
                <Likebutton postId={post.id} />
                <Link 
                  href={`/post/${post.id}`} 
                  className="flex items-center space-x-2 hover:text-blue-600"
                >
                  <ChatBubbleOutlineIcon />
                  <span>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</span>
                  <NavigateNextIcon />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div ref={loadingRef} className="flex justify-center my-8">
          <CircularProgress />
        </div>
      )}

      {!loading && posts.length > 0 && !hasMore && (
        <div className="text-center text-gray-500 mt-8">
          No more posts to load
        </div>
      )}
    </div>
  );
};

export default HashtagPage;