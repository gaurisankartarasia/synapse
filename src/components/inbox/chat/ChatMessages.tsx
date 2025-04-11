
"use client";
import { useEffect } from "react";
import { useChatMessages } from "@/hooks/inbox/useChatMessages";
import { useChatOperations } from "@/hooks/inbox/useChatOperations";
import { Message } from "@/types/chat";
import { CircularProgress, Button } from "@mui/material";
import MessageList from "./MessageList";

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
  const { messages, loading, error: fetchError, loadMoreMessages, hasMore } =
    useChatMessages(userId, currentUserId);
  
  const { markMessagesAsRead, error: operationError } = useChatOperations();

  useEffect(() => {
    const firstUnreadMsg = messages.find(
      (msg) =>
        msg.senderId !== currentUserId && !msg.readBy?.includes(currentUserId)
    );

    if (firstUnreadMsg?.roomId) {
      markMessagesAsRead(firstUnreadMsg.roomId);
    }
  }, [messages, currentUserId, markMessagesAsRead]);

  if (loading) return <CircularProgress  />;
  if (fetchError) return <div>Error: {fetchError}</div>;
  if (operationError) return <div>Operation Error: {operationError}</div>;
  if (messages.length === 0) return <p className="text-center">No messages</p>;

  return (
    <div className="pb-32 w-full">
      {hasMore && (
        <Button 
          onClick={loadMoreMessages} 
          className="mx-auto block mb-4"
        >
          Load older messages
        </Button>
      )}
      <MessageList 
        messages={messages}
        currentUserId={currentUserId}
        onReply={onReply}
        onEdit={onEdit}
      />
    </div>
  );
}
