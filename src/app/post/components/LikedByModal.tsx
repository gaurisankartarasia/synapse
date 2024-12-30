import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import { useAuth } from '@/hooks/useAuth';
import { LikesModalProps, LikeUserResponse } from '@/types/likedby';
import { Avatar } from '@nextui-org/react';
import P_card from '@/components/Skeletons/P_card';

const LikesModal = ({ isOpen, onClose, postId }: LikesModalProps) => {
  const [users, setUsers] = useState<LikeUserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { getIdToken } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!isOpen || !postId) return;
    
    try {
      setLoading(true);
      const token = await getIdToken();
      const response = await fetch(`/api/post/like/likedby?postId=${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
      } else {
        console.error("Error fetching users:", data.error);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [postId, isOpen, getIdToken]);

  useEffect(() => {
    let isMounted = true;

    if (isOpen && postId) {
      fetchUsers();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, postId]); // Remove fetchUsers from dependency array

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Reset users when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUsers([]);
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
      <div className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <P_card/>
        ) : users.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No likes yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user.uid}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Avatar
                    src={`/api/proxy?url=${encodeURIComponent(user.profilePic)}`}
                    alt={user.username}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(user.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LikesModal;