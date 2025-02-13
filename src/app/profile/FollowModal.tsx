
// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import Modal from "@/components/Modal";
// import Image from "next/image";
// import { BadgeCheck } from 'lucide-react';
// import { auth } from "@/lib/firebaseClient";
// import { useRouter } from "next/navigation";
// import { Spinner } from "@/components/ui/spinner";
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { setFollowStatus, toggleFollow } from '@/redux/features/followSlice';
// import { FollowButton } from "../[username]/FollowButton";
// import { ChatButton } from "../[username]/ChatButton";

// interface User {
//   uid: string;
//   username: string;
//   displayName: string;
//   profilePhotoURL: string;
//   verified: boolean;
//   isFollowing?: boolean;
//   isRequested?: boolean;
// }

// type UserModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   type: "followers" | "following";
// };

// const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, type }) => {
//   const [modalData, setModalData] = useState<User[]>([]);
//   const [modalLoading, setModalLoading] = useState<boolean>(false);
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const followState = useSelector((state: RootState) => state.follow);
//   const hasFetched = useRef(false);

//   const fetchModalData = useCallback(async () => {
//     if (!isOpen || !auth.currentUser || hasFetched.current) return;
//     hasFetched.current = true;
//     setModalLoading(true);

//     try {
//       const token = await auth.currentUser.getIdToken();
//       const response = await fetch(`/api/get-${type}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const users = type === "followers" ? data.followers : data.following;
//         setModalData(users);
        
//         // Initialize follow status in Redux for each user
//         users.forEach((user: User) => {
//           dispatch(setFollowStatus({
//             username: user.username,
//             isFollowing: user.isFollowing || false,
//             isRequested: user.isRequested || false,
//             followerCount: 0,
//           }));
//         });
//       }
//     } catch (error) {
//       console.error(`Error fetching ${type} data`, error);
//     } finally {
//       setModalLoading(false);
//     }
//   }, [isOpen, type, dispatch]);

//   useEffect(() => {
//     fetchModalData();
//   }, [fetchModalData]);

//   useEffect(() => {
//     if (!isOpen) {
//       hasFetched.current = false;
//     }
//   }, [isOpen]);

//   const handleUserClick = async (uid: string) => {
//     try {
//       const response = await fetch(`/api/get_username_from_uid?uid=${uid}`);
//       const result = await response.json();

//       if (response.ok && result.username) {
//         router.push(`/${result.username}`);
//       } else {
//         console.error("Failed to fetch username:", result.error);
//       }
//     } catch (error) {
//       console.error("Error fetching username from uid:", error);
//     }
//   };

//   const handleFollow = async (username: string) => {
//     try {
//       await dispatch(toggleFollow(username)).unwrap();
//     } catch (error) {
//       console.error('Failed to toggle follow:', error);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={type === "followers" ? "Followers" : "Following"}>
//       {modalLoading ? (
//         <div className="flex justify-center p-4">
//           <Spinner />
//         </div>
//       ) : (
//         <ul className="divide-y">
//           {modalData.map((user) => {
//             const currentFollowStatus = followState.followStatus[user.username] || {
//               isFollowing: user.isFollowing || false,
//               isRequested: user.isRequested || false,
//               loading: false,
//             };

//             const followStatus = currentFollowStatus.isFollowing 
//               ? "following" 
//               : currentFollowStatus.isRequested 
//               ? "requested" 
//               : "none";

//             return (
//               <li key={user.uid} className="flex items-center justify-between p-4">
//                 <div className="flex items-center space-x-3">
//                   <Image
//                     src={`/api/proxy?url=${encodeURIComponent(user.profilePhotoURL || "/default.webp")}`}
//                     alt={user.username}
//                     width={50}
//                     height={50}
//                     className="rounded-full cursor-pointer"
//                     onClick={() => handleUserClick(user.uid)}
//                   />
//                   <div>
//                     <div className="flex items-center space-x-1">
//                       <span 
//                         className="font-medium cursor-pointer hover:underline"
//                         onClick={() => handleUserClick(user.uid)}
//                       >
//                         {user.username}
//                       </span>
//                       {user.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
//                     </div>
//                     <p className="text-sm text-gray-500">{user.displayName}</p>
//                   </div>
//                 </div>
//                 <FollowButton
//                   isUpdating={currentFollowStatus.loading || false}
//                   followStatus={followStatus}
//                   onFollowClick={() => handleFollow(user.username)}
//                   className="w-24"
//                 />
//                 <ChatButton targetUserId={user.uid}/>

//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </Modal>
//   );
// };

// export default UserModal;







"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "@/components/Modal";
import Image from "next/image";
import { BadgeCheck, UserMinus } from 'lucide-react';
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setFollowStatus, toggleFollow } from '@/redux/features/followSlice';
import { FollowButton } from "../[username]/FollowButton";
import { ChatButton } from "../[username]/ChatButton";
import { Button } from "@/components/ui/button";

interface User {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  verified: boolean;
  isFollowing?: boolean;
  isRequested?: boolean;
}

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "followers" | "following";
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, type }) => {
  const [modalData, setModalData] = useState<User[]>([]);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const followState = useSelector((state: RootState) => state.follow);
  const hasFetched = useRef(false);

   const fetchModalData = useCallback(async () => {
    if (!isOpen || !auth.currentUser || hasFetched.current) return;
    hasFetched.current = true;
    setModalLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/get-${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const users = type === "followers" ? data.followers : data.following;
        setModalData(users);
        
        // Initialize follow status in Redux for each user
        users.forEach((user: User) => {
          dispatch(setFollowStatus({
            username: user.username,
            isFollowing: user.isFollowing || false,
            isRequested: user.isRequested || false,
            followerCount: 0,
          }));
        });
      }
    } catch (error) {
      console.error(`Error fetching ${type} data`, error);
    } finally {
      setModalLoading(false);
    }
  }, [isOpen, type, dispatch]);

  useEffect(() => {
    fetchModalData();
  }, [fetchModalData]);

  useEffect(() => {
    if (!isOpen) {
      hasFetched.current = false;
    }
  }, [isOpen]);

  const handleUserClick = async (uid: string) => {
    try {
      const response = await fetch(`/api/get_username_from_uid?uid=${uid}`);
      const result = await response.json();

      if (response.ok && result.username) {
        router.push(`/${result.username}`);
      } else {
        console.error("Failed to fetch username:", result.error);
      }
    } catch (error) {
      console.error("Error fetching username from uid:", error);
    }
  };

  const handleFollow = async (username: string) => {
    try {
      await dispatch(toggleFollow(username)).unwrap();
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleRemoveFollower = async (followerUid: string) => {
    if (!auth.currentUser) return;
    setRemovingUser(followerUid);

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/remove-follower', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerUid }),
      });

      if (response.ok) {
        // Remove user from modal data
        setModalData(prevData => prevData.filter(user => user.uid !== followerUid));
      } else {
        console.error('Failed to remove follower');
      }
    } catch (error) {
      console.error('Error removing follower:', error);
    } finally {
      setRemovingUser(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === "followers" ? "Followers" : "Following"}>
      {modalLoading ? (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      ) : (
        <ul className="divide-y">
          {modalData.map((user) => {
            const currentFollowStatus = followState.followStatus[user.username] || {
              isFollowing: user.isFollowing || false,
              isRequested: user.isRequested || false,
              loading: false,
            };

            const followStatus = currentFollowStatus.isFollowing 
              ? "following" 
              : currentFollowStatus.isRequested 
              ? "requested" 
              : "none";

            return (
              <li key={user.uid} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={`/api/proxy?url=${encodeURIComponent(user.profilePhotoURL || "/default.webp")}`}
                    alt={user.username}
                    width={50}
                    height={50}
                    className="rounded-full cursor-pointer"
                    onClick={() => handleUserClick(user.uid)}
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span 
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => handleUserClick(user.uid)}
                      >
                        {user.username}
                      </span>
                      {user.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-500">{user.displayName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {type === "followers" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFollower(user.uid)}
                      disabled={removingUser === user.uid}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      {removingUser === user.uid ? (
                        <Spinner className="w-4 h-4" />
                      ) : (
                        <UserMinus className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <FollowButton
                    isUpdating={currentFollowStatus.loading || false}
                    followStatus={followStatus}
                    onFollowClick={() => handleFollow(user.username)}
                    className="w-24"
                  />
                  <ChatButton targetUserId={user.uid}/>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
};

export default UserModal;