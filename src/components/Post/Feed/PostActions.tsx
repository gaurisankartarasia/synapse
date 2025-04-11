// src/app/post/components/PostActions.tsx
import { Post } from "@/types/post";
import Link from "next/link";
import { IconButton } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChevronRight,
  ChatBubbleOutline,
} from "@mui/icons-material";

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
  onLikesClick,
}: PostActionsProps) => (
  <div className="mt-4 flex items-center">
    <div className="flex items-center">
      {user && (
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            onLike();
          }}
          disabled={likeDisabled}
        >
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      )}
      {likeCount}
      <IconButton onClick={onLikesClick} className=" ocus:outline-none">
        <ChevronRight />
      </IconButton>
    </div>

    {post.allowCommenting && (
      <Link href={`/post/${post.postId}`} className="flex items-center gap-1">
        <ChatBubbleOutline fontSize="small" />
        <p>{post.commentCount} </p>
        <ChevronRight />
      </Link>
    )}
  </div>
);
