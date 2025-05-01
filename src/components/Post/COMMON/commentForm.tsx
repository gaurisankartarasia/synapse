
// CommentForm.tsx
import { useState } from "react";
import {IconButton} from "@mui/material";
import TextField from "@mui/material/TextField";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

type CommentFormProps = {
  onSubmit: (content: string) => Promise<void>;
};

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await onSubmit(content);
    setContent("");
  };

  return (
    <div className="mt-4 flex gap-3 items-center">
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <IconButton
        onClick={handleSubmit}
        disabled={!content.trim()}
        size="large"
      >
        <SendOutlinedIcon/>
      </IconButton>
    </div>
  );
};






