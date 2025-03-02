// src/app/post/components/PostContent.tsx
import { Post } from "@/types/post";
import ImageGallery from "../../lagacy_components/ImageGallery";

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  return (
    <>
      <div className="prose prose-lg max-w-none mt-6">{post.content}</div>
      
      {post.imageURLs && post.imageURLs.length > 0 && (
        <ImageGallery images={post.imageURLs} />
      )}
    </>
  );
};