

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import Image from 'next/image';
// import Modal from '@/components/Modal';
// import { LikesModalProps, LikeUserResponse } from '@/types/likedby';
// import { Spinner } from "@/components/ui/";


// const LikesModal = ({ isOpen, onClose, postId }: LikesModalProps) => {
//   const [users, setUsers] = useState<LikeUserResponse[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchUsers = useCallback(async () => {
//     if (!isOpen || !postId) return;
    
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/post/like/likedby`, {
//         params: { postId },
//         withCredentials: true 
//       });
      
//       setUsers(response.data.users || []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [postId, isOpen]);

//   useEffect(() => {
//     let isMounted = true;

//     if (isOpen && postId) {
//       fetchUsers();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [isOpen, postId]); // Remove fetchUsers from dependency array

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (diffInSeconds < 60) {
//       return 'just now';
//     } else if (diffInSeconds < 3600) {
//       const minutes = Math.floor(diffInSeconds / 60);
//       return `${minutes}m ago`;
//     } else if (diffInSeconds < 86400) {
//       const hours = Math.floor(diffInSeconds / 3600);
//       return `${hours}h ago`;
//     } else if (diffInSeconds < 604800) {
//       const days = Math.floor(diffInSeconds / 86400);
//       return `${days}d ago`;
//     } else {
//       return date.toLocaleDateString();
//     }
//   };

//   // Reset users when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setUsers([]);
//       setLoading(false);
//     }
//   }, [isOpen]);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
//       <div className="max-h-[70vh] overflow-y-auto">
//         {loading ? (
//           <Spinner/>
//         ) : users.length === 0 ? (
//           <div className="text-center p-4 t500">No likes yet</div>
//         ) : (
//           <div className="divide-y divide-gray-200">
//             {users.map((user) => (
//               <div
//                 key={user.uid}
//                 className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="relative h-10 w-10 flex-shrink-0">
//                   <Image
//                     src={`/api/proxy?url=${encodeURIComponent(user.profilePic)}`}
//                     alt={user.username}
//                     className="rounded-md object-cover"
//                     height={50}
//                     width={50}
//                   />
//                 </div>
//                 <div className="flex-grow">
//                   <h3 className="font-medium t900">{user.username}</h3>
//                   <p className="text-sm t500">
//                     {formatDate(user.timestamp)}
//                   </p>
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








import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { LikesModalProps, LikeUserResponse } from '@/types/likedby';
import { Spinner } from "@/components/ui/spinner";

const LikesModal = ({ isOpen, onClose, postId }: LikesModalProps) => {
  const [users, setUsers] = useState<LikeUserResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!isOpen || !postId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/post/like/likedby?postId=${postId}`, {
        credentials: 'include',
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

  useEffect(() => {
    if (!isOpen) {
      setUsers([]);
      setLoading(false);
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Liked by">
      <div className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <Spinner/>
        ) : users.length === 0 ? (
          <div className="text-center p-4 t500">No likes yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user.uid}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={`/api/proxy?url=${encodeURIComponent(user.profilePic)}`}
                    alt={user.username}
                    className="rounded-md object-cover"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium t900">{user.username}</h3>
                  <p className="text-sm t500">{formatDate(user.timestamp)}</p>
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
