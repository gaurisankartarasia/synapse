// CommentForm.tsx
import { useState } from "react";
import { Textarea, Button } from "@nextui-org/react";

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
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <Button
        onPress={handleSubmit}
        variant="flat"
        radius="sm"
        color="primary"
        className="mt-2"
      >
        Add Comment
      </Button>
    </div>
  );
};



