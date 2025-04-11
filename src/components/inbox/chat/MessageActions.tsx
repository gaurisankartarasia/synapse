
import * as React from "react";
import { Message } from "@/types/chat";
import { useChatOperations } from "@/hooks/inbox/useChatOperations";

// MUI Imports
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';

interface MessageActionsProps {
  message: Message;
  isCurrentUser: boolean;
  currentUserId: string;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
}

export default function MessageActions({
  message: msg,
  isCurrentUser,
  currentUserId,
  onReply,
  onEdit,
}: MessageActionsProps) {
  const { deleteMessage, isDeleting } = useChatOperations();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (deleteType: "me" | "everyone") => {
    deleteMessage(msg.id, msg.roomId, deleteType);
    handleClose(); // Close menu after action
  };

  const handleReply = () => {
    onReply(msg);
    handleClose(); // Close menu after action
  };

  const handleEdit = () => {
    onEdit(msg);
    handleClose(); // Close menu after action
  };

  return (
    // Container Box - positioning is now handled by parent MessageItem's flexbox
    // Removed margin/padding from here as it's controlled by parent's 'gap'
    <Box>
     
      <IconButton
        aria-label="message actions"
        aria-controls={open ? "message-actions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        disabled={isDeleting}
        sx={{ padding: '4px' }} // Keep padding consistent if needed
      >
        <MoreVertIcon fontSize="inherit" /> 
       
      </IconButton>
 <IconButton
        aria-label="message actions"
        aria-controls={open ? "message-actions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleReply}
        size="small"
        disabled={isDeleting}
        sx={{ padding: '4px' }} // Keep padding consistent if needed
      >
        <TurnLeftOutlinedIcon fontSize="inherit" /> 
       
      </IconButton>
      <Menu
        id="message-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "message-actions-button", 
                }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isCurrentUser ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isCurrentUser ? "right" : "left",
        }}
      >
        {/* ---- Removed Fragments, using direct conditional rendering ---- */}

        {/* Render Reply MenuItem if message is not deleted for everyone */}
        {!msg.deletedForEveryone && (
          <MenuItem onClick={handleReply} disabled={isDeleting}>
            Reply
          </MenuItem>
        )}

        {/* Render Edit MenuItem if message is not deleted and sent by current user */}
        {!msg.deletedForEveryone && msg.senderId === currentUserId && (
          <MenuItem onClick={handleEdit} disabled={isDeleting}>
            Edit
          </MenuItem>
        )}

        {/* Render Delete for Everyone MenuItem if message is not deleted and sent by current user */}
        {!msg.deletedForEveryone && msg.senderId === currentUserId && (
          <MenuItem
            onClick={() => handleDelete("everyone")}
            disabled={isDeleting}
          >
            Delete for everyone
          </MenuItem>
        )}

        {/* Always render the "Delete for me" or "Delete" option */}
        <MenuItem
           onClick={() => handleDelete("me")}
           disabled={isDeleting}
         >
           {msg.deletedForEveryone ? "Delete" : "Delete for me"}
         </MenuItem>

      </Menu>
    </Box>
  );
}