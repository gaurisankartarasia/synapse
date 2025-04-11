
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import { LikesModalProps, LikeUserResponse } from "@/types/likedby";
import { CircularProgress } from "@mui/material";
import { formatRelativeTime } from "@/utils/date";
import { UserHoverCard } from "@/components/hover-card/user-profile-hover-card";
import Link from "next/link";

const LikesModal = ({ isOpen, onClose, postId }: LikesModalProps) => {
  const [users, setUsers] = useState<LikeUserResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!isOpen || !postId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/post/like/likedby?postId=${postId}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [postId, isOpen]);

  useEffect(() => {
    if (isOpen && postId) {
      fetchUsers();
    }
  }, [isOpen, postId, fetchUsers]);

 
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
      <div className="max-h-[70vh] ">
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : users.length === 0 && isOpen ? (
          <div className="text-center p-4">No likes yet</div>
        ) : (
          <div>
            {users.map((user) => {


              return (
                <div
                  key={user.uid}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={`/api/proxy?url=${encodeURIComponent(
                          user.profilePhotoURL
                        )}`}
                        alt={user.username}
                        className="rounded-full object-cover"
                        height={50}
                        width={50}
                      />
                    </div>
                    <div>
<UserHoverCard username={user.username}>
                      <Link href={`/${user.username}`} className="font-medium hover:opacity-70">{user.username}</Link>
</UserHoverCard>
                      <p className="text-sm">
                        {formatRelativeTime(user.timestamp)}
                      </p>
                    </div>
                  </div>
                 
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LikesModal;
