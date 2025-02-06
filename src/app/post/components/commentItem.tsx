
// //commentItem.tsx

// import { useState } from "react";
// import type { Comment } from "@/types/comments";
// import Image from "next/image";
// import { ReportModal } from "@/components/ReportModal";
// import {Button} from '@mui/material'
// import { formatRelativeTime } from "@/utils/date";
// import VerifiedIcon from '@mui/icons-material/Verified';

// type CommentItemProps = {
//   comment: Comment;
//   currentUserId?: string;
//   postId: string;
//   onDelete: (commentId: string) => Promise<void>;
//   onLike: (commentId: string) => Promise<void>;
//   onReport: (commentId: string, reason: string, replyId?: string) => Promise<void>; // Add replyId as optional here
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
//     if (replyReportData?.replyId) {
//       // Reporting a reply
//       await onReport(replyReportData.commentId, reason, replyReportData.replyId);
//     } else {
//       // Reporting a comment
//       await onReport(comment.id, reason);
//     }
  
//     setIsReportModalOpen(false);
//     setReplyReportData(null);
//   };
  
  
  
  
  
//   const openReportModal = (commentId: string, replyId?: string) => {
//     if (replyId) {
//       setReplyReportData({ commentId, replyId }); // Correctly setting replyId
//     } else {
//       setReplyReportData(null); // Ensuring it's null when reporting a comment
//     }
//     setIsReportModalOpen(true);
//   };
  
  

//   return (
//     <div className="p-3 border rounded-lg mb-4">
//       <div className="flex justify-between items-start">
//         <div className="w-full">
       

        

// <div className="flex items-center gap-1">
// <Image
//     src={comment.user.photoURL}
//     alt={comment.user.username }
//     height={30}
//     width={30}
//     />
//     <strong>{comment.user.username}</strong>
//     <span>{comment.user.is_verified && (<VerifiedIcon fontSize="small"/>)}</span>
// </div>

//           <p className="mt-1">{comment.content}</p>
//           <p>{formatRelativeTime(comment.createdAt)}</p>
//           <div className="flex items-center gap-4 mt-2">
//             <Button 
//               onClick={() => onLike(comment.id)}
//             >
//               {comment.likes || 0} Likes
//             </Button>
//             <Button
//               onClick={() => setShowReplies(!showReplies)}
//               className="text-sm text-gray-500 hover:text-blue-500"
//             >
//               {showReplies ? "Hide" : "Show"} Replies ({comment.replies?.length || 0})
//             </Button> 
           
//             {currentUserId && currentUserId !== comment.user.uid && (
//               <Button
//                 onClick={() => openReportModal(comment.id)}
//                 className="text-sm text-gray-500 hover:text-red-500"
//               >
//                 Report
//               </Button>
//             )}

            
//           </div>

//           {showReplies && (
//             <div className="ml-8 mt-4">
//               {comment.replies?.map((reply) => (
//                 <div key={reply.id} className="border-l pl-4 py-2">
            

// <div className="flex items-center gap-1">
// <Image
//     src={reply.user.photoURL}
//     alt={reply.user.username}
//     height={30}
//     width={30}
//     />
//     <strong>{reply.user.username}</strong>
//     <span>{reply.user.is_verified && (<VerifiedIcon fontSize="small"/>)}</span>
// </div>

//                   <p className="mt-1">{reply.content}</p>
//                   <p>{formatRelativeTime(reply.createdAt)}</p>
//                   <div className="flex items-center gap-4 mt-2">
//                     <Button
//                       onClick={() => onLikeReply(comment.id, reply.id)}
//                       className="text-sm text-gray-500 hover:text-blue-500"
//                     >
//                       {reply.likes || 0} Likes
//                     </Button>
//                     {currentUserId === reply.user.uid && (
//                       <Button
//                         onClick={() => onDeleteReply(comment.id, reply.id)}
//                         color='error'
//                       >
//                         Delete
//                       </Button>
//                     )}

                    
                    
//                     {currentUserId && currentUserId !== reply.user.uid && (
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
//                     disabled={!replyContent.trim()}
                    
//                   >
//                     Reply
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {currentUserId === comment.uid && (
//           <Button
//             onClick={() => onDelete(comment.id)}
//             disabled={isDeleting}
//             color='error'

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





import { useState } from "react";
import type { Comment } from "@/types/comments";
import Image from "next/image";
import { ReportModal } from "@/components/ReportModal";
import { Button } from '@mui/material';
import { formatRelativeTime } from "@/utils/date";
import VerifiedIcon from '@mui/icons-material/Verified';

type CommentItemProps = {
  comment: Comment;
  currentUserId?: string;
  postId: string;
  onDelete: (commentId: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onReport: (commentId: string, reason: string, replyId?: string) => Promise<void>;
  onAddReply: (commentId: string, content: string) => Promise<void>;
  onDeleteReply: (commentId: string, replyId: string) => Promise<void>;
  onLikeReply: (commentId: string, replyId: string) => Promise<void>;
  isDeleting: boolean;
};

const UserAvatar = ({ src, username }: { src: string | null | undefined, username: string }) => {
  // Using a neutral gray avatar as inline base64 to avoid network requests
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjI0IDAgNCAxLjc2IDQgNHMtMS43NiA0LTQgNC00LTEuNzYtNC00IDEuNzYtNCA0LTR6bTAgMTQuMjVjLTIuOTUgMC01LjU2LTEuNDQtNy4yLTMuNjUuMDMtMi4zOCA0LjgtMy42OCA3LjItMy42OHM3LjE3IDEuMyA3LjIgMy42OGMtMS42NCAyLjIxLTQuMjUgMy42NS03LjIgMy42NXoiLz48L3N2Zz4=';

  return (
    <div className="relative w-8 h-8">
      <Image
        src={src || defaultAvatar}
        alt={username || "User"}
        width={30}
        height={30}
        className="rounded-full"
        // Unset onError to prevent loops
      />
    </div>
  );
};

export const CommentItem = ({
  comment,
  currentUserId,
  postId,
  onDelete,
  onLike,
  onReport,
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
    if (replyReportData?.replyId) {
      await onReport(replyReportData.commentId, reason, replyReportData.replyId);
    } else {
      await onReport(comment.id, reason);
    }
    setIsReportModalOpen(false);
    setReplyReportData(null);
  };

  const openReportModal = (commentId: string, replyId?: string) => {
    if (replyId) {
      setReplyReportData({ commentId, replyId });
    } else {
      setReplyReportData(null);
    }
    setIsReportModalOpen(true);
  };

  return (
    <div className="p-3 border rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex items-center gap-1">
            <UserAvatar 
              src={comment.user.photoURL} 
              username={comment.user.username}
            />
            <strong>{comment.user.username || "User"}</strong>
            <span>{comment.user.is_verified && (<VerifiedIcon fontSize="small"/>)}</span>
          </div>

          <p className="mt-1">{comment.content}</p>
          <p>{formatRelativeTime(comment.createdAt)}</p>
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
           
            {currentUserId && currentUserId !== comment.user.uid && (
              <Button
                onClick={() => openReportModal(comment.id)}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Report
              </Button>
            )}
          </div>

          {showReplies && (
            <div className="ml-8 mt-4">
              {comment.replies?.map((reply) => (
                <div key={reply.id} className="border-l pl-4 py-2">
                  <div className="flex items-center gap-1">
                    <UserAvatar 
                      src={reply.user.photoURL} 
                      username={reply.user.username}
                    />
                    <strong>{reply.user.username || "User"}</strong>
                    <span>{reply.user.is_verified && (<VerifiedIcon fontSize="small"/>)}</span>
                  </div>

                  <p className="mt-1">{reply.content}</p>
                  <p>{formatRelativeTime(reply.createdAt)}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      onClick={() => onLikeReply(comment.id, reply.id)}
                      className="text-sm text-gray-500 hover:text-blue-500"
                    >
                      {reply.likes || 0} Likes
                    </Button>
                    {currentUserId === reply.user.uid && (
                      <Button
                        onClick={() => onDeleteReply(comment.id, reply.id)}
                        color='error'
                      >
                        Delete
                      </Button>
                    )}
                    
                    {currentUserId && currentUserId !== reply.user.uid && (
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

        {currentUserId === comment.uid && (
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