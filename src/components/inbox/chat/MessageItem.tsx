

import { Message } from "@/types/chat";
import { formatRelativeTime } from "@/utils/date";
import { Check, DoneAll} from '@mui/icons-material';
import MessageActions from "./MessageActions"; // Assuming this uses MUI now
import ReplyPreview from "./ReplyPreview";

interface MessageItemProps {
  message: Message;
  currentUserId: string;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
}

export default function MessageItem({
  message: msg,
  currentUserId,
  onReply,
  onEdit,
}: MessageItemProps) {
  const isCurrentUser = msg.senderId === currentUserId;

  // The main message bubble content + timestamp/status
  const MessageContent = () => (
    <div
      className={`flex flex-col ${
        isCurrentUser ? "items-end" : "items-start"
      }`}
    >
      {msg.replyTo && !msg.deletedForEveryone && (
        <ReplyPreview replyTo={msg.replyTo} />
      )}

      <div
        className={`px-4 py-2 rounded-2xl flex gap-1 w-fit ${
          isCurrentUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900"
        } ${isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none'}`} 
      >
        <p className={msg.deletedForEveryone ? "italic text-sm" : ""}>
          {msg.deletedForEveryone
            ? "This message was deleted"
            : msg.content}
        </p>

        {/* Timestamp and Read Status */}
        {!msg.deletedForEveryone && (
             <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
                {msg.edited && (
                <span className="text-xs mr-1">edited</span>
                )}
                <small>{formatRelativeTime(msg.timestamp)}</small>
                {isCurrentUser && getReadStatus(msg)}
            </div>
        )}
      </div>
    </div>
  );

  // Message Actions Component (conditionally visible on hover)
  const ActionsComponent = () => (
     <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"> {/* Use self-center or adjust alignment as needed */}
        <MessageActions
            message={msg}
            isCurrentUser={isCurrentUser}
            currentUserId={currentUserId}
            onReply={onReply}
            onEdit={onEdit}
        />
     </div>
  );


  return (
    // The outermost div controls overall alignment (left/right) and enables group-hover
    <div
      className={`group flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } px-4 py-1`} // Adjusted padding
    >
      {/* Inner flex container to position actions button and message content */}
      <div className="flex items-center gap-2 max-w-[75%]"> {/* Use items-start, items-end or items-center; Added max-width */}
        {isCurrentUser && <ActionsComponent />} {/* Actions on the left for current user */}

        <MessageContent />

        {!isCurrentUser && <ActionsComponent />} {/* Actions on the right for other users */}
      </div>
    </div>
  );
}

// --- Helper Function (no changes needed) ---
function getReadStatus(msg: Message) {
  // Assuming Check and CheckCheck are small enough or sized appropriately
  const iconSize = 14; // Adjusted size slightly
  if (!msg.sent) return null;
  if (msg.readBy?.length > 0) {
    // Use a class if direct color props aren't available or needed
    // For MUI icons, you'd use sx={{ color: 'primary.main' }} or similar
    return <DoneAll  sx={{fontSize:iconSize}}       />; 
  }
  return <Check  sx={{fontSize:iconSize}}   />;
}