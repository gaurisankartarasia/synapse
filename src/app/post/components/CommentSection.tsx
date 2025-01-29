// components/CommentSection.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/utils/date';
import { Avatar, Button , TextField} from '@mui/material';
import { Trash2, Heart, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { CommentReplies } from './CommentReplies';

interface Comment {
  id: string;
  authorId: string;
  authorUsername?: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: any;
  likeCount: number;
  replyCount: number;
  isLiked?: boolean;
}

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment.trim(),
          authorId: user.uid,
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      setNewComment('');
      await fetchComments();
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments/${postId}/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      await fetchComments();
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments/${postId}/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to like comment');
      
      // Optimistically update the UI
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      }));
    } catch (err) {
      setError('Failed to like comment');
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[100px]"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !newComment.trim()}
          >
            {isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <p className="text-gray-600">Please sign in to comment.</p>
      )}

      {error && (
        <div className="text-red-500 p-2">{error}</div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar>
                <img
                  src={comment.authorPhotoURL || '/default-avatar.png'}
                  alt={comment.authorUsername || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              </Avatar>
              <div className="flex-grow">
                <p className="font-semibold">{comment.authorUsername || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">
                  {formatRelativeTime(comment.createdAt)}
                </p>
              </div>
              {user?.uid === comment.authorId && (
                <Button
                 
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <p className="text-gray-800 mt-2">{comment.content}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm">
              <Button
           
                onClick={() => handleLikeComment(comment.id)}
                className={comment.isLiked ? "text-red-500" : "text-gray-600"}
              >
                <Heart className="h-4 w-4 mr-1" />
                {comment.likeCount}
              </Button>


              {user && (  // Only show reply button if user is logged in
    <Button
      onClick={() => toggleReplies(comment.id)}
      className="text-gray-600"
    >
      <Reply className="h-4 w-4 mr-1" />
      Reply
    </Button>
  )}

              {comment.replyCount > 0 && (
                <Button
                
                  onClick={() => toggleReplies(comment.id)}
                  className="text-gray-600"
                >
                  {expandedComments.has(comment.id) ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                </Button>
              )}
            </div>

            {expandedComments.has(comment.id) && (
              <CommentReplies
                postId={postId}
                commentId={comment.id}
                currentUser={user}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};