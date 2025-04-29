
//src/app/post/page.tsx
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from '@/hooks/useAuth';
import { PostSkeleton } from '@/components/Skeleton-loaders/feed-post';
import { usePosts } from '@/hooks/post/feed/usePosts';
import { usePostActions } from '@/hooks/post/feed/usePostActions';
import { PostHeader } from '../../components/Post/Feed/PostHeader';
import { PostActions } from '../../components/Post/Feed/PostActions';
import LikesModal from '../../components/Post/COMMON/LikedByModal';
import ImageGallery from "../../components/Post/COMMON/ImageGallery";
import Link from "next/link";
import TextContent from "../../components/Post/COMMON/TextContent"; 
import { HashtagDisplay } from "../../components/Post/COMMON/Hashtag";



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



