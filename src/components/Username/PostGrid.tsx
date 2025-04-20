// components/post/PostGrid.tsx
import React from "react";
import { Post } from "@/types/post";
import Link from "next/link";
import Image from "next/image";

import { Favorite, ChatBubbleOutline, Image as ImageIcon } from "@mui/icons-material";


interface PostGridProps {
  posts: Post[];
}

const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <div key={post.postId}>
          <Link href={`/post/${post.postId}`} className="overflow-hidden">
            <div className="relative group">
              {post.imageURLs && post.imageURLs.length > 0 && (
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={post.imageURLs[0]}
                    alt={`Post image`}
                    fill
                    className="object-cover rounded transition-opacity duration-300 group-hover:opacity-50"
                    loading="eager"
                    priority
                  />
                  {post.media_type === "image" && (
                    <div className="absolute top-2 right-2 text-white">
                      <ImageIcon />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center bg-black/50 bg-opacity-50  justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex  gap-3 text-white text-lg font-semibold p-2 rounded">
                      <div className="flex items-center space-x-1">
                        <Favorite className="w-4 h-4" />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChatBubbleOutline className="w-4 h-4" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;