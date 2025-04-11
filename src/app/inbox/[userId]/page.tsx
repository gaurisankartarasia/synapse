
"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/types/chat";
import { CustomJWTPayload } from "@/types/auth";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/inbox/chat/useUserProfile";
import ChatHeader from "@/components/inbox/chat/ChatHeader";
import ChatInterface from "@/components/inbox/chat/ChatInterface";

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const targetUserId = resolvedParams.userId;

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CustomJWTPayload | null>(null);

  // Use the auth hook without passing router
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { userInfo, loading: profileLoading } = useUserProfile(targetUserId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/signin");
    }
    
    if (user) {
      setCurrentUser(user);
    }
  }, [authLoading, isAuthenticated, router, user]);

  const handleReply = (message: Message) => {
    setEditingMessage(null);
    setReplyingTo(message);
  };

  const handleEdit = (message: Message) => {
    setReplyingTo(null);
    setEditingMessage(message);
  };

  const handleCancelAction = () => {
    setReplyingTo(null);
    setEditingMessage(null);
  };

  if (authLoading || profileLoading || !currentUser) {
    return <div className="flex items-center justify-center min-h-screen"><CircularProgress /></div>;
  }

  return (
    <>
      <ChatHeader 
        userInfo={userInfo} 
        isReportModalOpen={isReportModalOpen}
        setIsReportModalOpen={setIsReportModalOpen}
        targetUserId={targetUserId}
      />

      <ChatInterface
        targetUserId={targetUserId}
        currentUser={currentUser}
        replyingTo={replyingTo}
        editingMessage={editingMessage}
        onReply={handleReply}
        onEdit={handleEdit}
        onCancelAction={handleCancelAction}
        isReportModalOpen={isReportModalOpen}
        setIsReportModalOpen={setIsReportModalOpen}
      />
    </>
  );
}