




// Updated CommentItem.tsx
import { useState } from "react";
import { Button, Divider } from "@nextui-org/react";
import { Heart, Flag } from "lucide-react";
import type { Comment } from "@/types/comments";
import { ReportModal } from "@/components/ReportModal";

type CommentItemProps = {
  comment: Comment;
  currentUserId?: string;
  postId: string;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => Promise<void>;
  onReport: (commentId: string, reason: string) => Promise<void>;
  isDeleting: boolean;
};

export const CommentItem = ({
  comment,
  currentUserId,
  postId,
  onDelete,
  onLike,
  onReport,
  isDeleting
}: CommentItemProps) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const isLiked = currentUserId && comment.likedBy?.includes(currentUserId);

  const handleReport = async (reason: string) => {
    await onReport(comment.id, reason);
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-start">
        <div>
          <p><strong>{comment.author}</strong>: {comment.content}</p>
          <small className="opacity-50 text-xs">{comment.createdAt}</small>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="solid"
              startContent={<Heart className={isLiked ? "fill-current" : ""} />}
              onPress={() => onLike(comment.id)}
            >
              {comment.likes || 0}
            </Button>
            {currentUserId && currentUserId !== comment.authorId && (
              <Button
                size="sm"
                variant="light"
                color="danger"
                startContent={<Flag />}
                onPress={() => setIsReportModalOpen(true)}
              >
                Report
              </Button>
            )}
          </div>
        </div>
        {currentUserId === comment.authorId && (
          <Button
            size="sm"
            color="danger"
            variant="light"
            isLoading={isDeleting}
            onPress={() => onDelete(comment.id)}
          >
            Delete
          </Button>
        )}
      </div>
      <Divider className="mt-2"/>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />
    </div>
  );
};



