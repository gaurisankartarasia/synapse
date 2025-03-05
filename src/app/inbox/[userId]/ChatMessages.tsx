// //ChatMessages.tsx
// 'use client';
// import { useEffect } from 'react';
// import { useChatMessages } from '@/hooks/useChatMessages';
// import { Message } from '@/types/chat';
// import { Spinner } from "@/components/ui/spinner";

// interface ChatMessagesProps {
//   userId: string;
//   onReply: (message: Message) => void;
//   onEdit: (message: Message) => void;
//   replyingTo: Message | null;
//   editingMessage: Message | null;
//   currentUserId: string;
// }

// export default function ChatMessages({
//   userId,
//   onReply,
//   onEdit,
//   currentUserId,
// }: ChatMessagesProps) {
//   const { messages, loading, error, loadMoreMessages, hasMore } = useChatMessages(userId,currentUserId);

//   useEffect(() => {
//     const firstUnreadMsg = messages.find(msg =>
//       msg.senderId !== currentUserId && !msg.readBy?.includes(currentUserId)
//     );

//     if (firstUnreadMsg?.roomId) {
//       markAsRead(firstUnreadMsg.roomId);
//     }
//   }, [messages, currentUserId]);

//   const markAsRead = async (roomId: string) => {
//     try {
//       await fetch('/api/chat/markAsRead', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ roomId })
//       });
//     } catch (error) {
//       console.error('Failed to mark messages as read', error);
//     }
//   };

//   const getReadStatus = (msg: Message) => {
//     if (!msg.sent) return null;
//     if (msg.readBy?.length > 0) {
//       return <span className="text-blue-500">✓✓</span>;
//     }
//     return <span className="">✓</span>;
//   };

//   const deleteMessage = async (messageId: string, roomId: string | undefined, deleteType: 'me' | 'everyone') => {
//     if (!roomId) {
//       console.error('roomId is undefined');
//       return;
//     }

//     try {
//       const response = await fetch('/api/chat/delete', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messageId,
//           roomId,
//           deleteType
//         }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || 'Failed to delete message');
//       }
//     } catch (error) {
//       console.error('Failed to delete message', error);
//     }
//   };

//   if (loading) return <Spinner size={20}/>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="pb-32 w-full">
//       {messages.length > 0 && hasMore && (
//         <button onClick={loadMoreMessages}>Load older messages</button>
//       )}
//       {messages.length === 0 ? (
//         <p>No messages</p>
//       ) : (
//         messages.map((msg) => {
//           if (!msg.id || !msg.roomId || msg.deletedFor?.includes(currentUserId)) {
//             return null;
//           }
//           const isCurrentUser = msg.senderId === currentUserId;

//           return (
//             <div key={msg.id}
//             className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} p-4`}

//             >
//               {msg.replyTo && !msg.deletedForEveryone && (
//                 <div className="ml-4 pl-2 border-l-2 border-gray-300 mb-2">
//                   <p className="text-sm ">
//                     Replying to: {msg.replyTo.content}
//                   </p>
//                 </div>
//               )}
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <p className={msg.deletedForEveryone ? "italic " : ""}>
//                     {msg.deletedForEveryone ? "This message was deleted" : msg.content}
//                   </p>
//                   <div className="flex items-center gap-1 text-sm t500">
//                     {msg.edited && !msg.deletedForEveryone && (
//                       <span className="text-xs">edited</span>
//                     )}
//                     {msg.senderId === currentUserId && getReadStatus(msg)}
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   {!msg.deletedForEveryone && (
//                     <>
//                       <button
//                         onClick={() => onReply(msg)}
//                       >
//                         Reply
//                       </button>
//                       {msg.senderId === currentUserId && (
//                         <>
//                           <button
//                             onClick={() => onEdit(msg)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => deleteMessage(msg.id, msg.roomId, 'everyone')}
//                             color="error"
//                           >
//                             Delete for everyone
//                           </button>
//                         </>
//                       )}
//                     </>
//                   )}
//                   <button
//                     onClick={() => deleteMessage(msg.id, msg.roomId, 'me')}
//                     color="error"
//                   >
//                     {msg.deletedForEveryone ? "Delete" : "Delete for me"}
//                   </button>
//                 </div>
//                 <small>{msg.time}</small>
//               </div>
//             </div>
//           );
//         })
//       )}

//     </div>
//   );
// }




// 'use client';
// import { useEffect } from 'react';
// import { useChatMessages } from '@/hooks/useChatMessages';
// import { Message } from '@/types/chat';
// import { Spinner } from "@/components/ui/spinner";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// interface ChatMessagesProps {
//   userId: string;
//   onReply: (message: Message) => void;
//   onEdit: (message: Message) => void;
//   replyingTo: Message | null;
//   editingMessage: Message | null;
//   currentUserId: string;
// }

// export default function ChatMessages({
//   userId,
//   onReply,
//   onEdit,
//   currentUserId,
// }: ChatMessagesProps) {
//   const { messages, loading, error, loadMoreMessages, hasMore } = useChatMessages(userId, currentUserId);

//   useEffect(() => {
//     const firstUnreadMsg = messages.find(msg =>
//       msg.senderId !== currentUserId && !msg.readBy?.includes(currentUserId)
//     );

//     if (firstUnreadMsg?.roomId) {
//       markAsRead(firstUnreadMsg.roomId);
//     }
//   }, [messages, currentUserId]);

//   const markAsRead = async (roomId: string) => {
//     try {
//       await fetch('/api/chat/markAsRead', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ roomId })
//       });
//     } catch (error) {
//       console.error('Failed to mark messages as read', error);
//     }
//   };

//   const getReadStatus = (msg: Message) => {
//     if (!msg.sent) return null;
//     if (msg.readBy?.length > 0) {
//       return <span className="text-blue-500">✓✓</span>;
//     }
//     return <span className="">✓</span>;
//   };

//   const deleteMessage = async (messageId: string, roomId: string | undefined, deleteType: 'me' | 'everyone') => {
//     if (!roomId) {
//       console.error('roomId is undefined');
//       return;
//     }

//     try {
//       const response = await fetch('/api/chat/delete', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messageId,
//           roomId,
//           deleteType
//         }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || 'Failed to delete message');
//       }
//     } catch (error) {
//       console.error('Failed to delete message', error);
//     }
//   };

//   if (loading) return <Spinner size={20}/>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="pb-32 w-full">
//       {messages.length > 0 && hasMore && (
//         <button onClick={loadMoreMessages}>Load older messages</button>
//       )}
//       {messages.length === 0 ? (
//         <p>No messages</p>
//       ) : (
//         messages.map((msg) => {
//           if (!msg.id || !msg.roomId || msg.deletedFor?.includes(currentUserId)) {
//             return null;
//           }
//           const isCurrentUser = msg.senderId === currentUserId;

//           return (
//             <div
//               key={msg.id}
//               className={`group flex ${isCurrentUser ? 'justify-end' : 'justify-start'} p-4`}
//             >

//               {msg.replyTo && !msg.deletedForEveryone && (
//                 <div className="ml-4 pl-2 border-l-2 border-gray-300 mb-2 ">
//                   <p className="text-sm">
//                     Replying to: {msg.replyTo.content}
//                   </p>
//                 </div>
//               )}
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <p className={msg.deletedForEveryone ? "italic" : ""}>
//                     {msg.deletedForEveryone ? "This message was deleted" : msg.content}
//                   </p>
//                   <div className="flex items-center gap-1 text-sm ">
//                     {msg.edited && !msg.deletedForEveryone && (
//                       <span className="text-xs">edited</span>
//                     )}
//                     {msg.senderId === currentUserId && getReadStatus(msg)}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <small>{msg.time}</small>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full"
//                       >
//                         ...
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
//                       {!msg.deletedForEveryone && (
//                         <>
//                           <DropdownMenuItem onSelect={() => onReply(msg)}>
//                             Reply
//                           </DropdownMenuItem>
//                           {msg.senderId === currentUserId && (
//                             <>
//                               <DropdownMenuItem onSelect={() => onEdit(msg)}>
//                                 Edit
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onSelect={() => deleteMessage(msg.id, msg.roomId, 'everyone')}
//                               >
//                                 Delete for everyone
//                               </DropdownMenuItem>
//                             </>
//                           )}
//                         </>
//                       )}
//                       <DropdownMenuItem
//                         onSelect={() => deleteMessage(msg.id, msg.roomId, 'me')}
//                       >
//                         {msg.deletedForEveryone ? "Delete" : "Delete for me"}
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }





"use client";
import { useEffect } from "react";
import { useChatMessages } from "@/hooks/useChatMessages";
import { Message } from "@/types/chat";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/utils/date";
import {Check, CheckCheck} from 'lucide-react'

interface ChatMessagesProps {
  userId: string;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
  replyingTo: Message | null;
  editingMessage: Message | null;
  currentUserId: string;
}

export default function ChatMessages({
  userId,
  onReply,
  onEdit,
  currentUserId,
}: ChatMessagesProps) {
  const { messages, loading, error, loadMoreMessages, hasMore } =
    useChatMessages(userId, currentUserId);

  useEffect(() => {
    const firstUnreadMsg = messages.find(
      (msg) =>
        msg.senderId !== currentUserId && !msg.readBy?.includes(currentUserId)
      
    );

    if (firstUnreadMsg?.roomId) {
      markAsRead(firstUnreadMsg.roomId);
    }
    
  }, [messages, currentUserId]);

  const markAsRead = async (roomId: string) => {
    try {
      await fetch("/api/chat/markAsRead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  };

  const getReadStatus = (msg: Message) => {
    if (!msg.sent) return null;
    if (msg.readBy?.length > 0) {
      return < CheckCheck/>;
    }
    return < Check/>;
  };

  const deleteMessage = async (
    messageId: string,
    roomId: string | undefined,
    deleteType: "me" | "everyone"
  ) => {
    if (!roomId) {
      console.error("roomId is undefined");
      return;
    }

    try {
      const response = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          roomId,
          deleteType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete message");
      }
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  if (loading) return <Spinner size={20} />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pb-32 w-full">
      {messages.length > 0 && hasMore && (
        <button onClick={loadMoreMessages}>Load older messages</button>
      )}
      {messages.length === 0 ? (
        <p className="text-center">No messages</p>
      ) : (
        messages.map((msg) => {
          if (
            !msg.id ||
            !msg.roomId ||
            msg.deletedFor?.includes(currentUserId)
          ) {
            console.log("Message data:", msg);

            return null;
          }
          const isCurrentUser = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`group flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              } p-4`}
            >
              {msg.replyTo && !msg.deletedForEveryone && (
                <div className="ml-4 pl-2 border-l-2 border-gray-300 mb-2 flex flex-col">
                  <span>Replying to:</span>
                  <p className="text-sm"> {msg.replyTo.content}</p>
                </div>
              )}
              <div
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-2 rounded-2xl w-fit  ${
                    isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  
                  <p className={msg.deletedForEveryone ? "italic" : ""}>
                    {msg.deletedForEveryone
                      ? "This message was deleted"
                      : msg.content}
                  </p>
                  

                  <div className="flex items-center gap-1 text-sm mt-1">
                    {msg.edited && !msg.deletedForEveryone && (
                      <span className="text-xs">edited</span>
                    )}
                    <small>{formatRelativeTime(msg.timestamp)}</small>
                    {msg.senderId === currentUserId && getReadStatus(msg)}

                  </div>
                  
                </div>
                <div className="flex items-center gap-2 mt-1">





                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-5 w-6 rounded-full"
                      >
                        ...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align={isCurrentUser ? "end" : "start"}
                    >
                      {!msg.deletedForEveryone && (
                        <>
                          <DropdownMenuItem onSelect={() => onReply(msg)}>
                            Reply
                          </DropdownMenuItem>
                          {msg.senderId === currentUserId && (
                            <>
                              <DropdownMenuItem onSelect={() => onEdit(msg)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  deleteMessage(msg.id, msg.roomId, "everyone")
                                }
                              >
                                Delete for everyone
                              </DropdownMenuItem>
                            </>
                          )}
                        </>
                      )}
                      <DropdownMenuItem
                        onSelect={() => deleteMessage(msg.id, msg.roomId, "me")}
                      >
                        {msg.deletedForEveryone ? "Delete" : "Delete for me"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
