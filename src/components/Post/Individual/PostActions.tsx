
// src/app/post/components/PostActions.tsx
import { Post } from "@/types/post";
import LikesModal from '../COMMON/LikedByModal';
import { ReportModal } from "@/components/ReportModal";
import { useAuth } from '@/hooks/useAuth';
import { IconButton } from "@mui/material";
import {Favorite, FavoriteBorder, ChevronRight, ChatBubbleOutline} from '@mui/icons-material';

interface PostActionsProps {
  post: Post;
  isLiked: boolean;
  likeCount: number;
  onLike: () => Promise<void>;
  isLikesModalOpen: boolean;
  onOpenLikesModal: () => void;
  onCloseLikesModal: () => void;
  onReport: (reason: string) => Promise<void>;
  isReportModalOpen: boolean;
  onCloseReportModal: () => void;
}

export const PostActions = ({
  post,
  isLiked,
  likeCount,
  onLike,
  isLikesModalOpen,
  onOpenLikesModal,
  onCloseLikesModal,
  onReport,
  isReportModalOpen,
  onCloseReportModal
}: PostActionsProps) => {
  const { user } = useAuth();

  return (
    <>
      <div className="mt-6 flex gap-1 items-center">
        <div className="flex items-center"> 
          {user && (
            <IconButton
              onClick={onLike}
              className="flex items-center"
            >
              {isLiked ? <Favorite  color="error" /> : <FavoriteBorder  />}
            </IconButton>
          )}
   {likeCount} 
   {/* {likeCount === 1 ? 'Like' : 'Likes'} */}
          <IconButton onClick={onOpenLikesModal} className="flex items-center">
           
              <ChevronRight />
          </IconButton>
        </div>

        {post.allowCommenting && (
          <p className="flex gap-1 items-center" ><ChatBubbleOutline fontSize="small" />{post.commentCount}
           {/* {post.commentCount === 1 ? 'Comment' : 'Comments'} */}
           </p>
        )}
      </div>

      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={onCloseLikesModal}
        postId={post.postId}
      />
      
      <ReportModal
        type="post"
        isOpen={isReportModalOpen}
        onClose={onCloseReportModal}
        onSubmit={onReport}
      />
    </>
  );
};