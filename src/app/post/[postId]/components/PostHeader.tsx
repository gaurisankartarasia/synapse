// // src/app/post/components/PostHeader.tsx
// import Link from "next/link";
// import { Post } from "@/types/post";
// import { UserHoverCard } from "@/components/user-profile-hover-card";
// import { VscVerifiedFilled } from "react-icons/vsc";
// import { FaBookmark, FaRegBookmark } from "react-icons/fa";
// import { formatRelativeTime } from "@/utils/date";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";

// interface PostHeaderProps {
//   post: Post;
//   handleSave: () => Promise<void>;
//   handleDelete: () => Promise<void>;
//   currentUserId?: string;
//   onReportClick: () => void;
// }

// export const PostHeader = ({
//   post,
//   handleSave,
//   handleDelete,
//   currentUserId,
//   onReportClick
// }: PostHeaderProps) => {
//   const isPostOwner = currentUserId === post.creator_uid;

//   return (
//     <div className="flex items-center gap-3">
//       <Avatar>
//         <AvatarImage src={post.profilePhotoURL} alt={post.username} className='object-cover'/>
//         <AvatarFallback>{post.username.slice(0, 2)}</AvatarFallback>
//       </Avatar>

//       <UserHoverCard username={post.username}>
//         <Link href={`/${post.username}`} className="hover:opacity-60 cursor-pointer font-semibold">
//           {post.username}
//         </Link>
//       </UserHoverCard>

//       {post.isVerified && <VscVerifiedFilled />}

//       <small className="t600">
//         {formatRelativeTime(post.createdAt)}
//       </small>

//       <button
//         onClick={handleSave}
//         className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
//       >
//         {post.isSaved ? <FaBookmark size={15} /> : <FaRegBookmark size={15} />}
//       </button>

//       {isPostOwner && (
//         <button onClick={handleDelete} className="text-red-500">
//           Delete Post
//         </button>
//       )}

//       <button
//         onClick={onReportClick}
//         className="text-red-500"
//       >
//         Report Post
//       </button>
//     </div>
//   );
// };



// src/app/post/components/PostHeader.tsx
import Link from "next/link";
import { Post } from "@/types/post";
import { UserHoverCard } from "@/components/user-profile-hover-card";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { formatRelativeTime } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogItem,
  DialogSeparator,
  DialogClose,
} from "@/components/ActionDialog";

interface PostHeaderProps {
  post: Post;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  currentUserId?: string;
  onReportClick: () => void;
}

export const PostHeader = ({
  post,
  onSave,
  onDelete,
  currentUserId,
  onReportClick,
}: PostHeaderProps) => {
  const isPostOwner = currentUserId === post.creator_uid;

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage
          src={post.profilePhotoURL}
          alt={post.username}
          className="object-cover"
        />
        <AvatarFallback>{post.username.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <UserHoverCard username={post.username}>
        <Link
          href={`/${post.username}`}
          className="hover:opacity-60 cursor-pointer font-semibold"
        >
          {post.username}
        </Link>
      </UserHoverCard>

      {post.isVerified && <VscVerifiedFilled />}

      <small className="t600">{formatRelativeTime(post.createdAt)}</small>

      <button
        onClick={onSave}
        className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
      >
        {post.isSaved ? <FaBookmark size={15} /> : <FaRegBookmark size={15} />}
      </button>
      <Dialog>
        <DialogTrigger asChild>
          <button>...</button>
        </DialogTrigger>
        <DialogContent>
          <DialogItem onClick={onSave}>
            {post.isSaved ? "Unsave post" : "Save post"}
          </DialogItem>
          <DialogSeparator />
          {isPostOwner && (
            <DialogItem onClick={onDelete}>Delete Post</DialogItem>
          )}
          <DialogSeparator />
          <DialogItem onClick={onReportClick}>Report Post</DialogItem>
          <DialogSeparator />
          <DialogClose asChild>
            <DialogItem>Cancel</DialogItem>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};
