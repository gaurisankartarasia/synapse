import { useState } from "react";

export function useChatOperations() {
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markMessagesAsRead = async (roomId: string) => {
    if (!roomId) return;
    
    setIsMarking(true);
    setError(null);
    
    try {
      const response = await fetch("/api/chat/markAsRead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to mark messages as read");
      }
    } catch (error) {
      console.error("Failed to mark messages as read", error);
      setError("Failed to mark messages as read");
    } finally {
      setIsMarking(false);
    }
  };

  const deleteMessage = async (
    messageId: string,
    roomId: string | undefined,
    deleteType: "me" | "everyone"
  ) => {
    if (!roomId || !messageId) {
      console.error("roomId or messageId is undefined");
      return;
    }

    setIsDeleting(true);
    setError(null);
    
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
      setError("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    markMessagesAsRead,
    deleteMessage,
    isMarking,
    isDeleting,
    error
  };
}