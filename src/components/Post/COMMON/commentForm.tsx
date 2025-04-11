
// CommentForm.tsx
import { useState } from "react";
import Button from "@mui/material/Button";
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
    <div className="mt-4 flex">
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <Button
        onClick={handleSubmit}
        disabled={!content.trim()}
        variant="contained"
      >
        <SendOutlinedIcon/>
      </Button>
    </div>
  );
};






