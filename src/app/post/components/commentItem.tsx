
// //commentItem.tsx

// import { useState } from "react";
// import type { Comment } from "@/types/comments";
// import { ReportModal } from "@/components/ReportModal";
// import {Button} from '@mui/material'
// import { formatRelativeTime } from "@/utils/date";

// type CommentItemProps = {
//   comment: Comment;
//   currentUserId?: string;
//   postId: string;
//   onDelete: (commentId: string) => Promise<void>;
//   onLike: (commentId: string) => Promise<void>;
//   onReport: (commentId: string, reason: string) => Promise<void>;
//   onReportReply: (commentId: string, replyId: string, reason: string) => Promise<void>;
//   onAddReply: (commentId: string, content: string) => Promise<void>;
//   onDeleteReply: (commentId: string, replyId: string) => Promise<void>;
//   onLikeReply: (commentId: string, replyId: string) => Promise<void>;
//   isDeleting: boolean;
// };

// export const CommentItem = ({
//   comment,
//   currentUserId,
//   postId,
//   onDelete,
//   onLike,
//   onReport,
//   onReportReply,
//   onAddReply,
//   onDeleteReply,
//   onLikeReply,
//   isDeleting
// }: CommentItemProps) => {
//   const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//   const [replyReportData, setReplyReportData] = useState<{ commentId: string; replyId: string } | null>(null);
//   const [showReplies, setShowReplies] = useState(false);
//   const [replyContent, setReplyContent] = useState("");

//   const handleReplySubmit = async () => {
//     if (!replyContent.trim()) return;
//     await onAddReply(comment.id, replyContent);
//     setReplyContent("");
//   };

//   const handleReportSubmit = async (reason: string) => {
//     if (replyReportData) {
//       await onReportReply(replyReportData.commentId, replyReportData.replyId, reason);
//     } else {
//       await onReport(comment.id, reason);
//     }
//     setIsReportModalOpen(false);
//     setReplyReportData(null);
//   };

//   const openReportModal = (commentId: string, replyId?: string) => {
//     setReplyReportData(replyId ? { commentId, replyId } : null);
//     setIsReportModalOpen(true);
//   };
  

//   return (
//     <div className="p-3 border rounded-lg mb-4">
//       <div className="flex justify-between items-start">
//         <div className="w-full">
//           <p className="font-medium">{comment.author}</p>
//           <p className="mt-1">{comment.content}</p>
//           <small>{formatRelativeTime(comment.createdAt)}</small>
//           <div className="flex items-center gap-4 mt-2">
//             <Button 
//               onClick={() => onLike(comment.id)}
//               className="text-sm text-gray-500 hover:text-blue-500"
//             >
//               {comment.likes || 0} Likes
//             </Button>
//             <Button
//               onClick={() => setShowReplies(!showReplies)}
//               className="text-sm text-gray-500 hover:text-blue-500"
//             >
//               {showReplies ? "Hide" : "Show"} Replies ({comment.replies?.length || 0})
//             </Button>
//             {currentUserId && currentUserId !== comment.authorId && (
//               <Button
//                 onClick={() => openReportModal(comment.id)}
//                 className="text-sm text-gray-500 hover:text-red-500"
//               >
//                 Report
//               </Button>
//             )}
//           </div>

//           {/* Replies Section */}
//           {showReplies && (
//             <div className="ml-8 mt-4">
//               {comment.replies?.map((reply) => (
//                 <div key={reply.id} className="border-l pl-4 py-2">
//                   <p className="font-medium">{reply.author}</p>
//                   <p className="mt-1">{reply.content}</p>
//                   <div className="flex items-center gap-4 mt-2">
//                     <Button
//                       onClick={() => onLikeReply(comment.id, reply.id)}
//                       className="text-sm text-gray-500 hover:text-blue-500"
//                     >
//                       {reply.likes || 0} Likes
//                     </Button>
//                     {currentUserId === reply.authorId && (
//                       <Button
//                         onClick={() => onDeleteReply(comment.id, reply.id)}
//                         className="text-sm text-red-500 hover:text-red-600"
//                       >
//                         Delete
//                       </Button>
//                     )}
//                     {currentUserId && currentUserId !== reply.authorId && (
//                       <Button
//                         onClick={() => openReportModal(comment.id, reply.id)}
//                         className="text-sm text-gray-500 hover:text-red-500"
//                       >
//                         Report
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Reply Form */}
//               {currentUserId && (
//                 <div className="mt-4">
//                   <textarea
//                     value={replyContent}
//                     onChange={(e) => setReplyContent(e.target.value)}
//                     placeholder="Write a reply..."
//                     className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={2}
//                   />
//                   <Button
//                     onClick={handleReplySubmit}
//                     className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                     disabled={!replyContent.trim()}
//                   >
//                     Reply
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {currentUserId === comment.authorId && (
//           <Button
//             onClick={() => onDelete(comment.id)}
//             disabled={isDeleting}
//             className="text-sm text-red-500 hover:text-red-600"
//           >
//             Delete
//           </Button>
//         )}
//       </div>

//       <ReportModal
//         isOpen={isReportModalOpen}
//         onClose={() => {
//           setIsReportModalOpen(false);
//           setReplyReportData(null);
//         }}
//         onSubmit={handleReportSubmit}
//       />
//     </div>
//   );
// };  






// CommentItem.tsx
import { useState } from "react";
import type { Comment, Reply } from "@/types/comments";
import { ReportModal } from "@/components/ReportModal";
import { Button } from '@mui/material';
import { formatRelativeTime } from "@/utils/date";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddReply(comment.id, replyContent);
      setReplyContent("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await onLike(commentId);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    try {
      await onLikeReply(commentId, replyId);
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{comment.author}</p>
            <small className="text-gray-500">
              {/* {formatRelativeTime(comment.createdAt)} */}
            </small>
          </div>
          
          <p className="mt-2 text-gray-700">{comment.content}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <Button 
              onClick={() => handleLike(comment.id)}
              className={`text-sm ${
                comment.hasLiked ? 'text-blue-600' : 'text-gray-500'
              } hover:text-blue-600 flex items-center gap-1`}
              startIcon={comment.hasLiked ? "❤️" : "🤍"}
            >
              {comment.likeCount} {comment.likeCount === 1 ? 'Like' : 'Likes'}
            </Button>

            <Button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
              startIcon={showReplies ? "▼" : "▶"}
            >
              {showReplies ? "Hide" : "Show"} {comment.replyCount || 0} {comment.replyCount === 1 ? 'Reply' : 'Replies'}
            </Button>

            {currentUserId && currentUserId !== comment.authorId && (
              <Button
                onClick={() => setIsReportModalOpen(true)}
                className="text-sm text-gray-500 hover:text-red-500"
                startIcon="⚠️"
              >
                Report
              </Button>
            )}

            {currentUserId === comment.authorId && (
              <Button
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="text-sm text-red-500 hover:text-red-600"
                startIcon="🗑️"
              >
                Delete
              </Button>
            )}
          </div>

          {/* Replies Section */}
          {showReplies && (
            <div className="ml-6 mt-4 border-l-2 border-gray-100">
              {comment.replies?.map((reply: Reply) => (
                <div key={reply.id} className="pl-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{reply.author}</p>
                    <small className="text-gray-500">
                      {/* {formatRelativeTime(reply.createdAt)} */}
                    </small>
                  </div>
                  
                  <p className="mt-2 text-gray-700">{reply.content}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      onClick={() => handleLikeReply(comment.id, reply.id)}
                      className={`text-sm ${
                        reply.hasLiked ? 'text-blue-600' : 'text-gray-500'
                      } hover:text-blue-600 flex items-center gap-1`}
                      startIcon={reply.hasLiked ? "❤️" : "🤍"}
                    >
                      {reply.likeCount} {reply.likeCount === 1 ? 'Like' : 'Likes'}
                    </Button>

                    {currentUserId === reply.authorId && (
                      <Button
                        onClick={() => onDeleteReply(comment.id, reply.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                        startIcon="🗑️"
                      >
                        Delete
                      </Button>
                    )}

                    {currentUserId && currentUserId !== reply.authorId && (
                      <Button
                        onClick={() => {
                          setReplyReportData({ commentId: comment.id, replyId: reply.id });
                          setIsReportModalOpen(true);
                        }}
                        className="text-sm text-gray-500 hover:text-red-500"
                        startIcon="⚠️"
                      >
                        Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Reply Form */}
              {currentUserId && (
                <div className="mt-4 pl-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    rows={2}
                  />
                  <Button
                    onClick={handleReplySubmit}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    {isSubmitting ? "Sending..." : "Reply"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReplyReportData(null);
        }}
        onSubmit={async (reason: string) => {
          if (replyReportData) {
            await onReportReply(replyReportData.commentId, replyReportData.replyId, reason);
          } else {
            await onReport(comment.id, reason);
          }
          setIsReportModalOpen(false);
          setReplyReportData(null);
        }}
      />
    </div>
  );
};