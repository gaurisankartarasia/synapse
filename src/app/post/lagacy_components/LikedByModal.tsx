

// import { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import Modal from '@/components/Modal';
// import { LikesModalProps, LikeUserResponse } from '@/types/likedby';
// import { Spinner } from "@/components/ui/spinner";
// import { formatRelativeTime } from '@/utils/date';

// const LikesModal = ({ isOpen, onClose, postId }: LikesModalProps) => {
//   const [users, setUsers] = useState<LikeUserResponse[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchUsers = useCallback(async () => {
//     if (!isOpen || !postId) return;

//     try {
//       setLoading(true);
//       const response = await fetch(`/api/post/like/likedby?postId=${postId}`, {
//         credentials: 'include',
//       });

//       if (!response.ok) throw new Error("Failed to fetch users");

//       const data = await response.json();
//       setUsers(data.users || []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [postId, isOpen]);

//   useEffect(() => {
//     if (isOpen && postId) {
//       fetchUsers();
//     }
//   }, [isOpen, postId, fetchUsers]);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
//       <div className="max-h-[70vh] overflow-y-auto">
//         {loading ? (
//           <Spinner />
//         ) : users.length === 0 && isOpen ? ( //add isOpen condition here
//           <div className="text-center p-4 ">No likes yet</div>
//         ) : (
//           <div >
//             {users.map((user) => (
//               <div
//                 key={user.uid}
//                 className="flex items-center gap-3 p-4"
//               >
//                 <div className="relative h-10 w-10 flex-shrink-0">
//                   <Image
//                     src={`/api/proxy?url=${encodeURIComponent(user.profilePhotoURL)}`}
//                     alt={user.username}
//                     className="rounded-full object-cover"
//                     height={50}
//                     width={50}
//                   />
//                 </div>
//                 <div className="flex-grow">
//                   <h3 className="font-medium ">{user.username}</h3>
//                   <p className="text-sm ">{formatRelativeTime(user.timestamp)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default LikesModal;



import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Modal from "@/components/Modal";
import { LikesModalProps, LikeUserResponse } from "@/types/likedby";
import { Spinner } from "@/components/ui/spinner";
import { formatRelativeTime } from "@/utils/date";
import { FollowButton } from "@/app/[username]/FollowButton";
import { AppDispatch, RootState } from '@/redux/store';
import { toggleFollow } from "@/redux/features/followSlice";

const LikesModal = ({ isOpen, onClose, postId }: LikesModalProps) => {
  const [users, setUsers] = useState<LikeUserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

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

  const followStatusMap = useSelector((state: RootState) => {
    return users.reduce((acc, user) => {
      acc[user.username] =
        state.follow.followStatus[user.username] ?? {
          isFollowing: false,
          isRequested: false,
          isFollowingWithoutFollowback: false,
          loading: false, // Ensure a boolean value
        };
      return acc;
    }, {} as Record<string, any>);
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
      <div className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <Spinner />
        ) : users.length === 0 && isOpen ? (
          <div className="text-center p-4">No likes yet</div>
        ) : (
          <div>
            {users.map((user) => {
              const followStatus = followStatusMap[user.username];

              const handleFollow = () => {
                if (!followStatus.loading) {
                  dispatch(toggleFollow(user.username));
                }
              };

              return (
                <div key={user.uid} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={`/api/proxy?url=${encodeURIComponent(user.profilePhotoURL)}`}
                        alt={user.username}
                        className="rounded-full object-cover"
                        height={50}
                        width={50}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <p className="text-sm">{formatRelativeTime(user.timestamp)}</p>
                    </div>
                  </div>
                  <FollowButton
                    isUpdating={!!followStatus.loading} // ✅ Ensure it's always a boolean
                    followStatus={
                      followStatus.isFollowing
                        ? "following"
                        : followStatus.isRequested
                        ? "requested"
                        : followStatus.isFollowingWithoutFollowback
                        ? "followBack"
                        : "none"
                    }
                    onFollowClick={handleFollow}
                  />
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
