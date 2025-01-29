// components/CommentReplies.tsx
import { useState, useEffect } from 'react';
import { Avatar, Button, TextField } from '@mui/material';
import { Trash2, Heart } from 'lucide-react';
import { formatRelativeTime } from '@/utils/date';

interface Reply {
  id: string;
  authorId: string;
  authorUsername?: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: any;
  likeCount: number;
  isLiked?: boolean;
}

interface CommentRepliesProps {
  postId: string;
  commentId: string;
  currentUser: any;
}

export const CommentReplies = ({ postId, commentId, currentUser }: CommentRepliesProps) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/comments/${postId}/${commentId}/replies`);
      if (!response.ok) throw new Error('Failed to fetch replies');
      const data = await response.json();
      setReplies(data);
    } catch (err) {
      setError('Failed to load replies');
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newReply.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments/${postId}/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newReply.trim(),
          authorId: currentUser.uid,
        }),
      });

      if (!response.ok) throw new Error('Failed to post reply');

      setNewReply('');
      await fetchReplies();
    } catch (err) {
      setError('Failed to post reply');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `/api/comments/${postId}/${commentId}/replies/${replyId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete reply');
      await fetchReplies();
    } catch (err) {
      setError('Failed to delete reply');
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `/api/comments/${postId}/${commentId}/replies/${replyId}/like`,
        { method: 'POST' }
      );

      if (!response.ok) throw new Error('Failed to like reply');
      
      // Optimistically update the UI
      setReplies(replies.map(reply => {
        if (reply.id === replyId) {
          return {
            ...reply,
            likeCount: reply.isLiked ? reply.likeCount - 1 : reply.likeCount + 1,
            isLiked: !reply.isLiked,
          };
        }
        return reply;
      }));
    } catch (err) {
      setError('Failed to like reply');
    }
  };

  return (
    <div className="mt-4 ml-8 space-y-4">
      {currentUser && (
        <form onSubmit={handleSubmitReply} className="space-y-2">
          <TextField
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write a reply..."
            className="w-full min-h-[80px]"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !newReply.trim()}
          >
            {isLoading ? 'Posting...' : 'Post Reply'}
          </Button>
        </form>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {replies.map((reply) => (
        <div key={reply.id} className="border-l-2 pl-4 py-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <img
                src={reply.authorPhotoURL || '/default-avatar.png'}
                alt={reply.authorUsername || 'User'}
                className="h-6 w-6 rounded-full"
              />
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold text-sm">
                {reply.authorUsername || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(reply.createdAt)}
              </p>
            </div>
            {currentUser?.uid === reply.authorId && (
              <Button
                onClick={() => handleDeleteReply(reply.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-sm text-gray-800 mt-1">{reply.content}</p>
          
          <div className="flex items-center gap-4 mt-2">
            <Button
       
              onClick={() => handleLikeReply(reply.id)}
              className={reply.isLiked ? "text-red-500" : "text-gray-600"}
            >
              <Heart className="h-4 w-4 mr-1" />
              {reply.likeCount}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};