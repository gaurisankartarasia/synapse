

  "use client";
  import { useEffect, useState, useRef, useCallback } from "react";
  import dayjs from "dayjs";
  import Link from "next/link";
  import Image from "next/image";
  import Likebutton from "./components/LikeButton";
  import {PostHeader} from "./components/PostHeader";
  import {formatDateF} from '@/utils/formatDate'

  type Post = {
    id: string;
    title: string;
    imageUrls: string[];
    content: string;
    author: string;
    createdAt: string;
    likes: number;
    authorId:string;
    commentCount:number
  };

  const POSTS_PER_PAGE = 5;

  const PostPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [lastPostId, setLastPostId] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);

    const fetchPosts = async (lastId: string | null = null) => {
      try {
        const url = `/api/post/display${lastId ? `?lastPostId=${lastId}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch posts");
        
        const data = await response.json();
        const formattedPosts = data.posts.map((post: Post) => ({
          ...post,
          createdAt: dayjs(post.createdAt).format("MMMM D, YYYY h:mm A"),
        }));

        setPosts(prev => lastId ? [...prev, ...formattedPosts] : formattedPosts);
        setHasMore(formattedPosts.length === POSTS_PER_PAGE);
        setLastPostId(formattedPosts[formattedPosts.length - 1]?.id || null);
      } catch (error) {
        console.error(error);
        alert("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    // Infinite scroll setup
    const lastPostElementRef = useCallback((node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(lastPostId);
        }
      });

      if (node) observer.current.observe(node);
    }, [loading, hasMore, lastPostId]);

    useEffect(() => {
      fetchPosts();
      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }, []);

    const ImageGallery = ({ images }: { images: string[] }) => (
      <div className="grid grid-cols-2 gap-2 my-2">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              // src={url}
              src={`/api/proxy?url=${encodeURIComponent(url)}`}
              fill
            
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        sizes="(max-width: 468px) 50vw, (max-width: 600px) 50vw, 33vw"

              className="object-cover rounded-lg"
              alt={`Post image ${index + 1}`}
              priority={index === 0}  // Priority loading for first image
              loading={index === 0 ? "eager" : "lazy"}
              quality={index === 0 ? 85 : 75}  // Higher quality for first image
            />
          </div>
        ))}
      </div>
    );

    return (
      <div className=" mx-auto px-4">
        {loading && 'loading...'}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              <div  className="p-4">
              <PostHeader authorUsername={post.author} />

                <Link href={`/post/${post.id}`} className="block">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <div className="text-sm text-gray-600 mb-2">
                    <span>By {post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDateF(post.createdAt)}</span>
                  </div>
                  
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <ImageGallery 
                    images={post.imageUrls} 
                    // images={`/api/proxy?url=${encodeURIComponent(post.imageUrls)}`}

                    />
                  )}
                  
                  <p className="mt-2 text-gray-800">{post.content}</p>
                </Link>

                <div className="mt-4 flex items-center">
                  <Likebutton postId={post.id} />
                  <Link href={`/post/${post.id}`} className="flex items-center">
                  <span className="material-symbols-outlined ml-8 mr-1">
comment
</span> <p>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</p> 
<span className="material-symbols-outlined">
keyboard_arrow_right
</span>
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







