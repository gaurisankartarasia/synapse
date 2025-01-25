
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Likebutton from "./components/LikeButton";
import { PostHeader } from "./components/PostHeader";
import { formatRelativeTime } from "@/utils/date";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAuth } from '@/hooks/useAuth';
import { CircularProgress, LinearProgress } from "@mui/material";

type Post = {
  id: string;
  uid: string;
  imageUrls: string[];
  photoURL:string;
  displayName:string;
  content: string;
  author: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  likes: number;
  authorId: string;
  commentCount: number;
  hashtags?: string[];
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
    duration?: number;
  }[];
};

const POSTS_PER_PAGE = 5;

const PostPage = () => {
  const [isClient, setIsClient] = useState(false); // Track client-side mount
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const hasFetchedInitial = useRef(false);

  const { user, loading: authLoading, error: authError } = useAuth();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  // const getIdToken = async () => {
  //   return user ? `bearer_token_for_${user.id}` : '';
  // };

  const fetchPosts = async (lastId: string | null = null) => {
    try {
      const url = `/api/post/display/query${lastId ? `?lastPostId=${lastId}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts((prev) => (lastId ? [...prev, ...data.posts] : data.posts));
      setHasMore(data.posts.length === POSTS_PER_PAGE);
      setLastPostId(data.posts[data.posts.length - 1]?.id || null);
    } catch (error) {
      console.error(error);
      alert("Error fetching posts");
    } finally {
      setLoading(false);
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
  }, [authLoading, isClient]); // Add isClient to dependencies

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


  // Prevent server-side auth-dependent rendering
  if (!isClient) {
    return <div className="mx-auto px-4"><CircularProgress /></div>;
  }

  // Client-side auth handling
  if (authLoading) {
    return <LinearProgress/>;
  }

  if (authError) {
    return <div>Error: {authError}</div>;
  }

  return (
    <div className="mx-auto px-4">
      {loading && <CircularProgress />}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
            <div className="p-4 border-b">
             <div className="flex items-center gap-2">
             <PostHeader authorUsername={post.author}
              authorPhotoURL={post.photoURL}
              authorDisplayName={post.displayName}
              />
                  <span className="text-gray-600 text-sm">{formatRelativeTime(post.createdAt)}</span>
             </div>

              <Link href={`/post/${post.id}`} className="block">
             
                <p className="mt-2 text-gray-800">{post.content}</p>


                {post.imageUrls?.length > 0 && <ImageGallery images={post.imageUrls} />}
                

              </Link>
              <HashtagDisplay hashtags={post.hashtags} />

              <div className="mt-4 flex items-center gap-4">
                <Likebutton postId={post.id} />
                <Link href={`/post/${post.id}`} className="flex items-center gap-1">
                  <ChatBubbleOutlineIcon />
                  <p>{post.commentCount} {post.commentCount === 1 ? "Comment" : "Comments"}</p>
                  <NavigateNextIcon />
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
      {loading && <div ref={loadingRef} className="py-4">Loading more posts...</div>}
    </div>
  );
};

export default PostPage;




