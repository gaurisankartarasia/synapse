
// import React from "react";
// import Modal from "@/components/Modal";
// import Link from "next/link";
// import { UserMinus } from "lucide-react";
// import { VscVerifiedFilled } from "react-icons/vsc";
// import {Spinner} from "@/components/ui/spinner"// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { toggleFollow } from "@/redux/features/followSlice";
// import { FollowButton } from "./FollowButton";
// import { ChatButton } from "./ChatButton";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// interface User {
//   uid: string;
//   username: string;
//   displayName: string;
//   profilePhotoURL: string;
//   isVerified: boolean;
//   isPrivate: boolean;
//   isFollowing?: boolean;
//   isRequested?: boolean;
// }

// interface EnhancedModalListProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   loading: boolean;
//   items: User[];
//   isOwnProfile: boolean;
//   onRemoveFollower?: (uid: string) => Promise<void>;
// }

// const EnhancedModalList: React.FC<EnhancedModalListProps> = ({
//   isOpen,
//   onClose,
//   title,
//   loading,
//   items,
//   isOwnProfile,
//   onRemoveFollower,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const followState = useSelector((state: RootState) => state.follow);
//   const [removingUser, setRemovingUser] = React.useState<string | null>(null);

//   const handleFollow = async (username: string) => {
//     try {
//       await dispatch(toggleFollow(username)).unwrap();
//     } catch (error) {
//       console.error("Failed to toggle follow:", error);
//     }
//   };

//   const handleRemoveFollower = async (uid: string) => {
//     if (!onRemoveFollower) return;
//     setRemovingUser(uid);
//     try {
//       await onRemoveFollower(uid);
//     } finally {
//       setRemovingUser(null);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={title} >
//       {loading ? (
//         <div className="flex justify-center p-4">
//           <Spinner />
//         </div>
//       ) : (
//         <ul className="divide-y">
//           {items.map((user) => {
//             const currentFollowStatus = followState.followStatus[
//               user.username
//             ] || {
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
//               <li
//                 key={user.uid}
//                 className="flex items-center justify-between p-2"
//               >
//                 <div className="flex items-center ">
//                   <Link href={`/${user.username}`}>
//                     <Avatar className="cursor-pointer">
//                       <AvatarImage
//                         src={`/api/proxy?url=${encodeURIComponent(
//                           user.profilePhotoURL
//                         )}`}
//                         alt={user.username}
//                         className="object-cover"
//                       />
//                       <AvatarFallback>
//                         {user.displayName.slice(0, 2)}
//                       </AvatarFallback>
//                     </Avatar>
//                   </Link>
//                   <div>
//                     <div className="flex items-center space-x-1">
//                       <Link href={`/${user.username}`}>
//                         <span className="font-medium cursor-pointer hover:underline">
//                           {user.username}
//                         </span>
//                       </Link>
//                       {user.isVerified && (
//                         <VscVerifiedFilled className="w-4 h-4 text-blue-500" />
//                       )}
//                     </div>
//                     <p className="">{user.displayName}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   {isOwnProfile && title === "Followers" && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleRemoveFollower(user.uid)}
//                       disabled={removingUser === user.uid}
//                       className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                       title="Remove follower"
//                     >
//                       {removingUser === user.uid ? (
//                         <Spinner />
//                       ) : (
//                         <UserMinus className="w-4 h-4" />
//                       )}
//                     </Button>
//                   )}
//                   <FollowButton
//                     isUpdating={currentFollowStatus.loading || false}
//                     followStatus={followStatus}
//                     onFollowClick={() => handleFollow(user.username)}
//                     className="w-24"
//                   />
//                   {currentFollowStatus.isFollowing && (
//                     <ChatButton targetUserId={user.uid} />
//                   )}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </Modal>
//   );
// };

// export default EnhancedModalList;








import React from "react";
import Modal from "@/components/Modal";
import Link from "next/link";
import { UserMinus } from "lucide-react";
import { VscVerifiedFilled } from "react-icons/vsc";
import {Spinner} from "@/components/ui/spinner"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleFollow } from "@/redux/features/followSlice";
import { FollowButton } from "./FollowButton";
import { ChatButton } from "./ChatButton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing?: boolean;
  isRequested?: boolean;
  isFollowingWithoutFollowback?: boolean;
}

interface EnhancedModalListProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  loading: boolean;
  items: User[];
  isOwnProfile: boolean;
  onRemoveFollower?: (uid: string) => Promise<void>;
}

const EnhancedModalList: React.FC<EnhancedModalListProps> = ({
  isOpen,
  onClose,
  title,
  loading,
  items,
  isOwnProfile,
  onRemoveFollower,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const followState = useSelector((state: RootState) => state.follow);
  const [removingUser, setRemovingUser] = React.useState<string | null>(null);

  const handleFollow = async (username: string) => {
    try {
      await dispatch(toggleFollow(username)).unwrap();
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const handleRemoveFollower = async (uid: string) => {
    if (!onRemoveFollower) return;
    setRemovingUser(uid);
    try {
      await onRemoveFollower(uid);
    } finally {
      setRemovingUser(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} >
      {loading ? (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      ) : (
        <ul className="divide-y">
          {items.map((user) => {
            const currentFollowStatus = followState.followStatus[
              user.username
            ] ?? {
              isFollowing: user.isFollowing || false,
              isRequested: user.isRequested || false,
              isFollowingWithoutFollowback: user.isFollowingWithoutFollowback || false,
              loading: false,
            };

            const followStatus = currentFollowStatus.isFollowing
              ? "following"
              : currentFollowStatus.isRequested
              ? "requested"
              : currentFollowStatus.isFollowingWithoutFollowback
              ? "followBack"
              : "none";

            return (
              <li
                key={user.uid}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center ">
                  <Link href={`/${user.username}`}>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={`/api/proxy?url=${encodeURIComponent(
                          user.profilePhotoURL
                        )}`}
                        alt={user.username}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user.displayName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <div className="flex items-center space-x-1">
                      <Link href={`/${user.username}`}>
                        <span className="font-medium cursor-pointer hover:underline">
                          {user.username}
                        </span>
                      </Link>
                      {user.isVerified && (
                        <VscVerifiedFilled className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="">{user.displayName}</p>
                    {currentFollowStatus.isFollowingWithoutFollowback && (
                      <p className="text-xs text-gray-500">Follows you</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isOwnProfile && title === "Followers" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFollower(user.uid)}
                      disabled={removingUser === user.uid}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      title="Remove follower"
                    >
                      {removingUser === user.uid ? (
                        <Spinner />
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
                  {currentFollowStatus.isFollowing && (
                    <ChatButton targetUserId={user.uid} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
};

export default EnhancedModalList;