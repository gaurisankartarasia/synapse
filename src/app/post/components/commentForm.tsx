// CommentForm.tsx
import { useState } from "react";
import {  Button } from "@mui/material";

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
    <div className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <Button
        onClick={handleSubmit}
        color="primary"
        className="mt-2"
      >
        Add Comment
      </Button>
    </div>
  );
};



