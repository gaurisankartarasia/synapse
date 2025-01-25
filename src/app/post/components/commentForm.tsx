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








// // CommentForm.tsx
// import { useState } from "react";
// import {Button} from '@mui/material'

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
//         className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//         rows={3}
//       />
//       <Button
//         onClick={handleSubmit}
//         disabled={!content.trim()}
//       >
//         Add Comment
//       </Button>
//     </div>
//   );
// };






// CommentForm.tsx
import { useState } from 'react';
import { Button, TextField } from '@mui/material';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!content.trim() || isSubmitting}
        className="float-right"
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  );
};



