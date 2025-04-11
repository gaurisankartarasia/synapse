import { Message } from "@/types/chat";
import { CustomJWTPayload } from "@/types/auth";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { ReportModal } from "@/components/ReportModal";
import { useReportUser } from "@/hooks/COMMON/Report/useProfile";

interface ChatInterfaceProps {
  targetUserId: string;
  currentUser: CustomJWTPayload;
  replyingTo: Message | null;
  editingMessage: Message | null;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
  onCancelAction: () => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (isOpen: boolean) => void;
}

export default function ChatInterface({
  targetUserId,
  currentUser,
  replyingTo,
  editingMessage,
  onReply,
  onEdit,
  onCancelAction,
  isReportModalOpen,
  setIsReportModalOpen,
}: ChatInterfaceProps) {
  const { reportUser } = useReportUser();

  const handleReport = async (reason: string) => {
    const success = await reportUser(targetUserId, reason, "profile");
    if (success) {
      setIsReportModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] relative w-full">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages
          userId={targetUserId}
          onReply={onReply}
          onEdit={onEdit}
          replyingTo={replyingTo}
          editingMessage={editingMessage}
          currentUserId={currentUser.uid}
        />
      </div>

      <div className="sticky bottom-0 w-full bg-white">
        <ChatInput
          userId={targetUserId}
          replyingTo={replyingTo}
          editingMessage={editingMessage}
          onCancelAction={onCancelAction}
        />
      </div>

      <ReportModal
        type="profile"
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />
    </div>
  );
}