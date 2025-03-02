
// src/app/post/components/PostActions.tsx
import { Post } from "@/types/post";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { ChevronRight } from 'lucide-react';
import LikesModal from '../../lagacy_components/LikedByModal';
import { ReportModal } from "@/components/ReportModal";
import { useAuth } from '@/hooks/useAuth';

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
      <div className="mt-6 flex gap-4 items-center">
        <div className="flex items-center"> 
          {user && (
            <button
              onClick={onLike}
              className="flex items-center p-1 text-3xl font-medium active:scale-150 disabled:opacity-50 transition-all duration-200"
            >
              {isLiked ? <FaHeart size={20} color="red" /> : <FaRegHeart size={20} />}
            </button>
          )}

          <button onClick={onOpenLikesModal}>
            <span className="flex items-center">
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              <ChevronRight size={20} />
            </span>
          </button>
        </div>

        {post.allowCommenting && (
          <p>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</p>
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