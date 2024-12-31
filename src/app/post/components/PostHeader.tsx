
// "use client";

// import React, { useState, useCallback } from "react";
// import { div, img } from "@mui/material";
// import P_card from "@/components/Skeletons/P_div";
// import { auth } from "@/lib/firebaseClient";

// type ProfileData = {
//   displayName: string;
//   followersCount: number;
//   followingCount: number;
//   photoURL: string;
//   private: boolean;
//   username: string;
//   verified: boolean;
//   uid: string;
// };

// const profileCache = new Map<string, ProfileData>();

// interface PostHeaderProps {
//   authorUsername: string;
// }

// export const PostHeader: React.FC<PostHeaderProps> = ({ authorUsername }) => {
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [isPopoverVisible, setIsPopoverVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [followStatus, setFollowStatus] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const fetchProfile = async () => {
//     if (profileCache.has(authorUsername)) {
//       setProfile(profileCache.get(authorUsername)!);
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = await auth.currentUser?.getIdToken();
//       const [profileResponse, followResponse] = await Promise.all([
//         fetch(`/api/user/profile/${authorUsername}`),
//         fetch(`/api/get-following-followers?username=${authorUsername}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       ]);

//       const profileData = await profileResponse.json();
//       const followData = await followResponse.json();
      
//       const fetchedProfile = {
//         ...profileData.profile,
//         followStatus: followData.isFollowing ? "following" : followData.isRequested ? "requested" : ""
//       };

//       profileCache.set(authorUsername, fetchedProfile);
//       setProfile(fetchedProfile);
//       setFollowStatus(fetchedProfile.followStatus);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFollow = useCallback(async () => {
//     if (!auth.currentUser || isUpdating || !profile) return;

//     setIsUpdating(true);
//     const prevStatus = followStatus;
//     setFollowStatus(prevStatus === "following" ? "" : "requested");

//     try {
//       const token = await auth.currentUser.getIdToken();
//       const response = await fetch("/api/follow-user", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json", 
//           Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify({ targetUsername: authorUsername }),
//       });

//       const data = await response.json();
//       setFollowStatus(data.status === "Unfollowed" ? "" : 
//                      data.status === "Follow request sent" ? "requested" : 
//                      "following");
//     } catch (error) {
//       console.error("Follow action failed:", error);
//       setFollowStatus(prevStatus);
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [followStatus, isUpdating, authorUsername, profile]);

//   const handleMouseEnter = () => {
//     setIsPopoverVisible(true);
//     if (!profile) {
//       fetchProfile();
//     }
//   };
  
//   const handleMouseLeave = (event: React.MouseEvent) => {
//     const relatedTarget = event.relatedTarget as HTMLElement | null;
//     // Check if the mouse is moving to the div or staying within the component
//     if (
//       relatedTarget &&
//       (relatedTarget.closest(".popover-div") || relatedTarget.closest(".username-span"))
//     ) {
//       return;
//     }
//     setIsPopoverVisible(false);
//   };
  
//   return (
//     <div className="relative">
//       <span
//         className="font-medium cursor-pointer username-span"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         {authorUsername}
//       </span>
  
//       {isPopoverVisible && (
//         <div
//           className="absolute left-0 z-[1500] w-72 p-4"
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           {loading ? (
//              <P_card/>
//           ) : profile ? (
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3">
//                 <img
//                   // src={profile.photoURL}
//                   src={`/api/proxy?url=${encodeURIComponent(profile.photoURL)}`}
//                   alt={`${profile.displayName}`}
//                   className="w-12 h-12 rounded-full"
//                 />
//                 <div>
//                   <h3 className="font-bold">{profile.displayName}</h3>
//                   <p className="text-gray-600">@{profile.username}</p>
//                 </div>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Followers: {profile.followersCount}</span>
//                 <span>Following: {profile.followingCount}</span>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleFollow}
//                   disabled={isUpdating}
//                   className={`px-4 py-1 rounded-full text-sm text-black ${
//                     followStatus === "following"
//                       ? "bg-gray-200 hover:bg-gray-300"
//                       : "bg-blue-500 text-white hover:bg-blue-600"
//                   }`}
//                 >
//                   {followStatus === "following"
//                     ? "Following"
//                     : followStatus === "requested"
//                     ? "Requested"
//                     : "Follow"}
//                 </button>
//                 {followStatus === "following" && (
//                   <button
//                     onClick={() =>
//                       (window.location.href = `/inbox/${profile.uid}`)
//                     }
//                     className="px-4 py-1 rounded-full text-black bg-gray-200 hover:bg-gray-300 text-sm"
//                   >
//                     Message
//                   </button>
//                 )}
//               </div>
//               {profile.verified && (
//                 <span className="text-green-500 text-sm">Verified</span>
//               )}
//               {profile.private && (
//                 <p className="text-red-500 text-sm">Private Account</p>
//               )}
//             </div>
//           ) : (
//             <p>Error loading profile</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }  






"use client";

import React, { useState, useCallback } from "react";
import { auth } from "@/lib/firebaseClient";

type ProfileData = {
  displayName: string;
  followersCount: number;
  followingCount: number;
  photoURL: string;
  private: boolean;
  username: string;
  verified: boolean;
  uid: string;
};

const profileCache = new Map<string, ProfileData>();

interface PostHeaderProps {
  authorUsername: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ authorUsername }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    if (profileCache.has(authorUsername)) {
      setProfile(profileCache.get(authorUsername)!);
      return;
    }

    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const [profileResponse, followResponse] = await Promise.all([
        fetch(`/api/user/profile/${authorUsername}`),
        fetch(`/api/get-following-followers?username=${authorUsername}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const profileData = await profileResponse.json();
      const followData = await followResponse.json();
      
      const fetchedProfile = {
        ...profileData.profile,
        followStatus: followData.isFollowing ? "following" : followData.isRequested ? "requested" : ""
      };

      profileCache.set(authorUsername, fetchedProfile);
      setProfile(fetchedProfile);
      setFollowStatus(fetchedProfile.followStatus);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = useCallback(async () => {
    if (!auth.currentUser || isUpdating || !profile) return;

    setIsUpdating(true);
    const prevStatus = followStatus;
    setFollowStatus(prevStatus === "following" ? "" : "requested");

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/follow-user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ targetUsername: authorUsername }),
      });

      const data = await response.json();
      setFollowStatus(data.status === "Unfollowed" ? "" : 
                     data.status === "Follow request sent" ? "requested" : 
                     "following");
    } catch (error) {
      console.error("Follow action failed:", error);
      setFollowStatus(prevStatus);
    } finally {
      setIsUpdating(false);
    }
  }, [followStatus, isUpdating, authorUsername, profile]);

  const handleMouseEnter = () => {
    setIsPopoverVisible(true);
    if (!profile) {
      fetchProfile();
    }
  };
  
  const handleMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    // Check if the mouse is moving to the div or staying within the component
    if (
      relatedTarget &&
      (relatedTarget.closest(".popover-div") || relatedTarget.closest(".username-span"))
    ) {
      return;
    }
    setIsPopoverVisible(false);
  };
  
  return (
    <div className="relative">
      <span
        className="font-medium cursor-pointer username-span"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {authorUsername}
      </span>
  
      {isPopoverVisible && (
        <div
          className="absolute left-0 z-[1500] w-72 p-4 bg-gray-100  "
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {loading ? (
            'loading...'
          ) : profile ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  // src={profile.photoURL}
                  src={`/api/proxy?url=${encodeURIComponent(profile.photoURL)}`}
                  alt={`${profile.displayName}`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{profile.displayName}</h3>
                  <p className="text-gray-600">@{profile.username}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Followers: {profile.followersCount}</span>
                <span>Following: {profile.followingCount}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFollow}
                  disabled={isUpdating}
                  className={`px-4 py-1 rounded-full text-sm text-black ${
                    followStatus === "following"
                      ? "bg-gray-200 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {followStatus === "following"
                    ? "Following"
                    : followStatus === "requested"
                    ? "Requested"
                    : "Follow"}
                </button>
                {followStatus === "following" && (
                  <button
                    onClick={() =>
                      (window.location.href = `/inbox/${profile.uid}`)
                    }
                    className="px-4 py-1 rounded-full text-black bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    Message
                  </button>
                )}
              </div>
              {profile.verified && (
                <span className="text-green-500 text-sm">Verified</span>
              )}
              {profile.private && (
                <p className="text-red-500 text-sm">Private Account</p>
              )}
            </div>
          ) : (
            <p>Error loading profile</p>
          )}
        </div>
      )}
    </div>
  );
}  