// // CommentForm.tsx
// import { useState } from "react";

// type CommentFormProps = {
//   onSubmit: (content: string) => Promise<void>;
// };

// export const CommentForm = ({ onSubmit }: CommentFormProps) => {
//   const [content, setContent] = useState("");

//   const handleSubmit = async () => {
//     if (!content.trim()) return;
//     await onSubmit(content);
//     setContent("");
//   };

//   return (
//     <div className="mt-4">
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write a comment..."
//       />
//       <Button
//         onClick={handleSubmit}
//         color="primary"
//         className="mt-2"
//       >
//         Add Comment
//       </Button>
//     </div>
//   );
// };








// CommentForm.tsx
import { useState } from "react";
import {Button} from '@mui/material'

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
        className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <Button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        Add Comment
      </Button>
    </div>
  );
};