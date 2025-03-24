

// src/app/post/components/PostHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { UserHoverCard } from "@/components/user-profile-hover-card";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/date";
import { Post } from '@/types/post';

interface PostHeaderProps {
  post: Post;
  user: any;
  onSave: () => void;
  saveDisabled: boolean;
}

export const PostHeader = ({ post, user, onSave, saveDisabled }: PostHeaderProps) => (
  <div className="flex items-center gap-2">
    <Avatar>
      <AvatarImage src={post.profilePhotoURL} alt={post.username}className='object-cover' />
      <AvatarFallback>{post.username.slice(0, 2)}</AvatarFallback>
    </Avatar>
    <UserHoverCard username={post.username}>
      <Link href={`/${post.username}`} className="hover:opacity-60 cursor-pointer font-semibold">
        {post.username}
      </Link>
    </UserHoverCard>
    {post.isVerified && <VscVerifiedFilled />}
    <span className="t600 text-sm">{formatRelativeTime(post.createdAt)}</span>

    <div className="float-end">
      {user && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onSave();
          }}
          disabled={saveDisabled}
          className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
        >
          {post.isSaved ? <FaBookmark size={15} /> : <FaRegBookmark size={15} />}
        </button>
      )}


    </div>
    <Link href={`/post/${post.postId}`} className="text-blue-500 hover:underline" >Go to the post</Link>

  </div>
);





