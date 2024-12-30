// app/post/[postId]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {PostHeader} from "../components/PostHeader";
import Link from "next/link";
import { CommentSection } from '../../feed/CommentSection';
import LikeButton from "@/app/feed/LikeButton";
import SkeletonPost from "@/components/Skeletons/PostPage";
import { Card } from '@nextui-org/react';
import ImageGallery from '../components/ImageGallery';
import { formatDate } from '@/utils/formatDate';


interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: { seconds: number; nanoseconds: number };
  imageUrls: string[];
  uid:string
}

const PostPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPostData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`/api/post/${id}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setPost(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("An error occurred while fetching the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  if (loading) {
    return <SkeletonPost />;
  }

  if (!post) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Post not found</h2>
          <Link href="/" className="text-blue-500 hover:underline mt-4 block">
            Return to Home
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center text-blue-500 hover:underline mb-6"
      >
        ← Back to Feed
      </Link>

      <Card className="p-6">
      <PostHeader authorUsername={post.author} />
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>    

        <p>{post.id}</p>
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <Link href={`/${post.author}`} className="font-medium hover:underline">
            {post.author}
          </Link>
          <span>•</span>
          <time dateTime={new Date(post.createdAt.seconds * 1000).toISOString()}>
            {formatDate(post.createdAt)}
          </time>
               </div>

        {post.imageUrls && post.imageUrls.length > 0 && (
          <ImageGallery images={post.imageUrls} />
        )}

        <div className="prose prose-lg max-w-none mt-6">
          {post.content}
        </div>

        <div className="mt-6 pt-6 border-t">
          <LikeButton postId={post.id} />
        </div>

        <div className="mt-6">
          <CommentSection postId={post.id} />
        </div>
      </Card>
    </div>
  );
};

export default PostPage;