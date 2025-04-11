import { Message } from "@/types/chat";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
}

export default function MessageList({
  messages,
  currentUserId,
  onReply,
  onEdit,
}: MessageListProps) {
  return (
    <>
      {messages.map((msg) => {
        if (
          !msg.id ||
          !msg.roomId ||
          msg.deletedFor?.includes(currentUserId)
        ) {
          return null;
        }
        
        return (
          <MessageItem
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
            onReply={onReply}
            onEdit={onEdit}
          />
        );
      })}
    </>
  );
}