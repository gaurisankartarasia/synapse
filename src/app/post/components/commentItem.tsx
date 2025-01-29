
//commentItem.tsx

import { useState } from "react";
import type { Comment } from "@/types/comments";
import { ReportModal } from "@/components/ReportModal";
import {Button} from '@mui/material'

type CommentItemProps = {
  comment: Comment;
  currentUserId?: string;
  postId: string;
  onDelete: (commentId: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onReport: (commentId: string, reason: string) => Promise<void>;
  onReportReply: (commentId: string, replyId: string, reason: string) => Promise<void>;
  onAddReply: (commentId: string, content: string) => Promise<void>;
  onDeleteReply: (commentId: string, replyId: string) => Promise<void>;
  onLikeReply: (commentId: string, replyId: string) => Promise<void>;
  isDeleting: boolean;
};

export const CommentItem = ({
  comment,
  currentUserId,
  postId,
  onDelete,
  onLike,
  onReport,
  onReportReply,
  onAddReply,
  onDeleteReply,
  onLikeReply,
  isDeleting
}: CommentItemProps) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [replyReportData, setReplyReportData] = useState<{ commentId: string; replyId: string } | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    await onAddReply(comment.id, replyContent);
    setReplyContent("");
  };

  const handleReportSubmit = async (reason: string) => {
    if (replyReportData) {
      await onReportReply(replyReportData.commentId, replyReportData.replyId, reason);
    } else {
      await onReport(comment.id, reason);
    }
    setIsReportModalOpen(false);
    setReplyReportData(null);
  };

  const openReportModal = (commentId: string, replyId?: string) => {
    setReplyReportData(replyId ? { commentId, replyId } : null);
    setIsReportModalOpen(true);
  };
  

  return (
    <div className="p-3 border rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <p className="font-medium">{comment.author}</p>
          <p className="mt-1">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <Button 
              onClick={() => onLike(comment.id)}
            >
              {comment.likes || 0} Likes
            </Button>
            <Button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-gray-500 hover:text-blue-500"
            >
              {showReplies ? "Hide" : "Show"} Replies ({comment.replies?.length || 0})
            </Button>
            {currentUserId && currentUserId !== comment.authorId && (
              <Button
                onClick={() => openReportModal(comment.id)}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Report
              </Button>
            )}
          </div>

          {/* Replies Section */}
          {showReplies && (
            <div className="ml-8 mt-4">
              {comment.replies?.map((reply) => (
                <div key={reply.id} className="border-l pl-4 py-2">
                  <p className="font-medium">{reply.author}</p>
                  <p className="mt-1">{reply.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      onClick={() => onLikeReply(comment.id, reply.id)}
                      className="text-sm text-gray-500 hover:text-blue-500"
                    >
                      {reply.likes || 0} Likes
                    </Button>
                    {currentUserId === reply.authorId && (
                      <Button
                        onClick={() => onDeleteReply(comment.id, reply.id)}
                        color='error'
                      >
                        Delete
                      </Button>
                    )}
                    {currentUserId && currentUserId !== reply.authorId && (
                      <Button
                        onClick={() => openReportModal(comment.id, reply.id)}
                        className="text-sm text-gray-500 hover:text-red-500"
                      >
                        Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Reply Form */}
              {currentUserId && (
                <div className="mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <Button
                    onClick={handleReplySubmit}
                    disabled={!replyContent.trim()}
                    
                  >
                    Reply
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {currentUserId === comment.authorId && (
          <Button
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            color='error'

          >
            Delete
          </Button>
        )}
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReplyReportData(null);
        }}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};  