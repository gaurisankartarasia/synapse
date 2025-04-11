// src/app/post/components/PostHeader.tsx
import Link from "next/link";
import { Post } from "@/types/post";
import { UserHoverCard } from "@/components/hover-card/user-profile-hover-card";
import { Verified } from "@mui/icons-material";
import { Bookmark, BookmarkBorder} from "@mui/icons-material";
import { formatRelativeTime } from "@/utils/date";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogItem,
  DialogSeparator,
  DialogClose,
} from "@/components/ActionDialog";

import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import { Avatar, IconButton } from "@mui/material";

interface PostHeaderProps {
  post: Post;
  onSave: () => Promise<void>;
  onArchive: () => Promise<void>;
  onDelete: () => Promise<void>;
  currentUserId?: string;
  onReportClick: () => void;
}

export const PostHeader = ({
  post,
  onSave,
  onArchive,
  onDelete,
  currentUserId,
  onReportClick,
}: PostHeaderProps) => {
  const isPostOwner = currentUserId === post.creator_uid;

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3 flex-grow">
        <Avatar src={post.profilePhotoURL} alt={post.username}>
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

        {post.isVerified && <Verified />}

        <small className="t600">{formatRelativeTime(post.createdAt)}</small>

        <IconButton
          onClick={onSave}
          className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50"
        >
          {post.isSaved ? (
            <Bookmark fontSize="small" />
          ) : (
            <BookmarkBorder fontSize="small" />
          )}
        </IconButton>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <IconButton>
            <MoreHorizOutlinedIcon />
          </IconButton>
        </DialogTrigger>
        <DialogContent>
          <DialogItem onClick={onSave}>
            {post.isSaved ? "Unsave post" : "Save post"}
          </DialogItem>
          <DialogSeparator />
          {isPostOwner && (
            <DialogItem onClick={onArchive}>
              {post.isArchived ? "Unarchive post" : "Archive post"}
            </DialogItem>
          )}
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
