
// src/app/post/components/PostActions.tsx
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MessageSquare, ChevronRight } from 'lucide-react';
import { Post } from '@/types/post';
import Link from "next/link";

interface PostActionsProps {
  post: Post;
  user: any;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
  likeDisabled: boolean;
  onLikesClick: () => void;
}

export const PostActions = ({
  post,
  user,
  likeCount,
  isLiked,
  onLike,
  likeDisabled,
  onLikesClick
}: PostActionsProps) => (
  <div className="mt-4 flex items-center gap-4">
    <div className="flex items-center">
      {user && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onLike();
          }}
          disabled={likeDisabled}
          className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
        >
          {isLiked ? <FaHeart color="red" size={20} /> : <FaRegHeart size={20} />}
        </button>
      )}
      <button
        onClick={onLikesClick}
        className="hover:bg-gray-300 focus:outline-none"
      >
        <div className="flex items-center">
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          <ChevronRight />
        </div>
      </button>
    </div>

    {post.allowCommenting && (
      <Link href={`/post/${post.postId}`} className="flex items-center gap-1">
        <MessageSquare size={20} />
        <p>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</p>
        <ChevronRight size={20} />
      </Link>
    )}
  </div>
);