
// src/app/post/components/PostHeader.tsx
import {Avatar} from "@mui/material"
import { Verified } from "@mui/icons-material";
import { Bookmark, BookmarkBorder} from "@mui/icons-material";
import { UserHoverCard } from "@/components/hover-card/user-profile-hover-card";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/date";
import { Post } from "@/types/post";


import { IconButton } from "@mui/material";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogItem,
  DialogSeparator,
  DialogClose,
} from "@/components/ActionDialog";

import {MoreHorizOutlined} from '@mui/icons-material';


interface PostHeaderProps {
  post: Post;
  user: any;
  onSave: () => void;
  saveDisabled: boolean;
  onDelete?: () => void;
  onArchive?: () => void;
  deleteDisabled?: boolean;
  archiveDisabled?: boolean;
}

export const PostHeader = ({
  post,
  user,
  onSave,
  saveDisabled,
  onDelete,
  onArchive,
}: PostHeaderProps) => (
  <div className="flex items-center gap-2 relative">
    <Avatar src={post.profilePhotoURL}
        alt={post.username}>
    
    {post.username.slice(0, 2)}
    </Avatar>
    <UserHoverCard username={post.username}>
      <Link
        href={`/${post.username}`}
        className="hover:opacity-60 cursor-pointer font-semibold"
      >
        {post.username}
      </Link>
    </UserHoverCard>
    {post.isVerified && <Verified fontSize="small" />}
    <span className="t600 text-sm">{formatRelativeTime(post.createdAt)}</span>

    <div className="ml-auto flex items-center space-x-2">
      {user && (
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            onSave();
          }}
          disabled={saveDisabled}
               title={post.isSaved ? "Saved" : "Save"}        >
          {post.isSaved ? (
            <Bookmark fontSize="small" />
          ) : (
            <BookmarkBorder fontSize="small" />
          )}
        </IconButton>
      )}
    </div>
    <Dialog>
      <DialogTrigger asChild>
        <IconButton  title="More">
          <MoreHorizOutlined/>
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <Link href={`/post/${post.postId}`}>
          <DialogItem>Go to post</DialogItem>
        </Link>
        <DialogSeparator />
        <DialogItem onClick={onSave}>
          {post.isSaved ? "Unsave post" : "Save post"}
        </DialogItem>
        <DialogSeparator />
        {user && post.creator_uid === user.uid && (
          <>
            <DialogItem onClick={onArchive}>
              {post.isArchived ? "Unarchive post" : "Archive post"}
            </DialogItem>
            <DialogSeparator />

            <DialogItem onClick={onDelete} className="text-red-500">
              Delete Post
            </DialogItem>

            <DialogSeparator />
          </>
        )}

        <DialogClose asChild>
          <DialogItem>Cancel</DialogItem>
        </DialogClose>
      </DialogContent>
    </Dialog>
  </div>
);






