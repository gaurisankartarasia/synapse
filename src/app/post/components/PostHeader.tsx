

// // src/app/post/components/PostHeader.tsx
// "use client";

// import React, { useState, useCallback, useEffect } from "react";
// import { auth } from "@/lib/firebaseClient";
// import Link from 'next/link'
// import Image from "next/image";
// import { CircularProgress } from "@mui/material";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

// type ProfileData = {
//   displayName: string;
//   followersCount: number;
//   followingCount: number;
//   photoURL: string;
//   private: boolean;
//   username: string;
//   verified: boolean;
//   uid: string;
//   isFollowing?: boolean;
//   isRequested?: boolean;
// };

// const CACHE_TTL = 300000; // 5 minutes
// const profileCache = new Map<string, { data: ProfileData, timestamp: number }>();

// interface PostHeaderProps {
//   authorUsername: string;
//   authorDisplayName: string;  
//   authorPhotoURL: string;  
// }

// export const PostHeader: React.FC<PostHeaderProps> = ({ authorUsername, authorDisplayName, 
//   authorPhotoURL }) => {
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const getToken = async () => {
//       const t = await auth.currentUser?.getIdToken() || null;
//       setToken(t);
//     };
//     getToken();
//   }, []);
  

//   const fetchProfile = useCallback(async () => {
//     const cached = profileCache.get(authorUsername);
//     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
//       setProfile(cached.data);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(`/api/user/profile/${authorUsername}`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         cache: 'force-cache'
//       });
      
//       if (!res.ok) throw new Error('Failed to fetch');
      
//       const data = await res.json();
//       const profileData = {
//         ...data.profile,
//         isFollowing: data.isFollowing,
//         isRequested: data.isRequested,
//         followersCount: data.followersCount
//       };

//       profileCache.set(authorUsername, { data: profileData, timestamp: Date.now() });
//       setProfile(profileData);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [authorUsername, token]);

//   const handleFollow = useCallback(async () => {
//     if (!auth.currentUser || isUpdating || !profile) return;

//     setIsUpdating(true);
//     const previousProfile = { ...profile };

//     try {
//       // Optimistic update
//       const newFollowersCount = profile.isFollowing 
//         ? Math.max(0, profile.followersCount - 1)
//         : profile.followersCount + 1;

//       const updatedProfile = {
//         ...profile,
//         followersCount: newFollowersCount,
//         isFollowing: !profile.isFollowing,
//         isRequested: !profile.isFollowing && profile.private
//       };

//       profileCache.set(authorUsername, { 
//         data: updatedProfile, 
//         timestamp: Date.now() 
//       });
//       setProfile(updatedProfile);

//       // Actual API call
//       const response = await fetch("/api/follow-user", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${await auth.currentUser.getIdToken()}`
//         },
//         body: JSON.stringify({ 
//           targetUsername: authorUsername,
//           action: profile.isFollowing ? "unfollow" : "follow"
//         }),
//       });

//       if (!response.ok) throw new Error('Action failed');
//     } catch (error) {
//       console.error("Follow action failed:", error);
//       profileCache.set(authorUsername, { 
//         data: previousProfile, 
//         timestamp: Date.now() 
//       });
//       setProfile(previousProfile);
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [profile, isUpdating, authorUsername]);

//   const getButtonContent = () => {
//     if (isUpdating) return <CircularProgress size={20} />;
//     if (profile?.isRequested) return "Requested";
//     return profile?.isFollowing ? "Following" : "Follow";
//   };

//   return (
//     <HoverCard>
//        <HoverCardTrigger onMouseEnter={() => !profile && fetchProfile()} asChild className="cursor-pointer w-fit">
//         <div className="flex items-center gap-2 ">
//           {/* Author Photo */}
//           {authorPhotoURL && (
//             <Image
//               src={authorPhotoURL}
//               alt={authorDisplayName || authorUsername}
//               width={30}
//               height={30}
//               className="rounded-full"
//             />
//           )}
//           {/* Display Name */}
//           <p className="hover:opacity-60 text-lg font-semibold">
//             {authorUsername}
//           </p>
//         </div>
//       </HoverCardTrigger>
//       <HoverCardContent className="w-80" align="start">
//         {loading ? (
//           <div className="flex justify-center p-4">
//             <CircularProgress size={20} />
//           </div>
//         ) : profile ? (
//           <div className="space-y-3">
//             <div className="flex items-center space-x-3">
//               <Image
//                 src={`/api/proxy?url=${encodeURIComponent(profile.photoURL)}`}
//                 alt={profile.displayName}
//                 width={50}
//                 height={50}
//                 className=" rounded-full"
//                 loading="lazy"
//                 decoding="async"
//                 style={{ contentVisibility: 'auto' }}
//               />
//               <div>
//                 <h3 className="font-bold">{profile.displayName}</h3>
//                 <p className="text-sm text-muted-foreground">@{profile.username}</p>
//               </div>
//             </div>
//             <div className="flex gap-3 text-sm">
//               <span>{profile.followersCount} followers</span>
//               <span>{profile.followingCount} following</span>
//             </div>
//             <div className="flex gap-2">
//               {profile.uid === auth.currentUser?.uid ? (
//                 <Link
//                   href="/settings/profile"
//                   className="px-4 py-1 rounded-full text-sm bg-secondary hover:bg-secondary/80"
//                   prefetch={false}
//                 >
//                   Edit Profile
//                 </Link>
//               ) : (
//                 <>
//                   <button
//                     onClick={handleFollow}
//                     disabled={isUpdating}
//                     className={`px-4 py-1 rounded-full text-sm min-w-[80px] ${
//                       profile.isFollowing || profile.isRequested
//                         ? "bg-secondary hover:bg-secondary/80"
//                         : "bg-primary text-primary-foreground hover:bg-primary/90"
//                     }`}
//                   >
//                     {getButtonContent()}
//                   </button>
//                   {profile.isFollowing && (
//                     <button
//                       onClick={() => window.location.href = `/inbox/${profile.uid}`}
//                       className="px-4 py-1 rounded-full text-sm bg-secondary hover:bg-secondary/80"
//                     >
//                       Message
//                     </button>
//                   )}
//                 </>
//               )}
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               {profile.verified && (
//                 <span className="text-green-500">✓ Verified</span>
//               )}
//               {profile.private && (
//                 <span className="text-red-500">🔒 Private Account</span>
//               )}
//             </div>
//             <Link 
//               href={`/${profile.username}`}
//               className="block text-sm text-primary hover:underline"
//               prefetch={false}
//             >
//               Visit profile →
//             </Link>
//           </div>
//         ) : (
//           <p className="text-sm">Error loading profile</p>
//         )}
//       </HoverCardContent>
//     </HoverCard>
//   );
// };






// src/app/post/components/PostHeader.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { auth } from "@/lib/firebaseClient";
import Link from 'next/link'
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import FollowButton from "@/app/[username]/FollowButton";

type ProfileData = {
  displayName: string;
  followersCount: number;
  followingCount: number;
  photoURL: string;
  private: boolean;
  username: string;
  verified: boolean;
  uid: string;
  isFollowing?: boolean;
  isRequested?: boolean;
};

const CACHE_TTL = 300000;
const profileCache = new Map<string, { data: ProfileData, timestamp: number }>();

interface PostHeaderProps {
  authorUsername: string;
  authorDisplayName: string;  
  authorPhotoURL: string;  
}

export const PostHeader: React.FC<PostHeaderProps> = ({ 
  authorUsername, 
  authorDisplayName, 
  authorPhotoURL 
}) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [followStatus, setFollowStatus] = useState<"" | "requested" | "following">("");

  useEffect(() => {
    const getToken = async () => {
      const t = await auth.currentUser?.getIdToken() || null;
      setToken(t);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (profile) {
      const status = profile.isRequested ? "requested" : 
                    profile.isFollowing ? "following" : "";
      setFollowStatus(status);
    }
  }, [profile]);

  const fetchProfile = useCallback(async () => {
    const cached = profileCache.get(authorUsername);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProfile(cached.data);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/user/profile/${authorUsername}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'force-cache'
      });
      
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      const profileData = {
        ...data.profile,
        isFollowing: data.isFollowing,
        isRequested: data.isRequested,
        followersCount: data.followersCount
      };

      profileCache.set(authorUsername, { data: profileData, timestamp: Date.now() });
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [authorUsername, token]);

  const handleFollow = useCallback(async () => {
    if (!auth.currentUser || isUpdating || !profile) return;

    setIsUpdating(true);
    const previousStatus = followStatus;
    const previousFollowers = profile.followersCount;

    try {
      // Optimistic update
      const newStatus = followStatus === "following" ? "" : 
                       profile.private ? "requested" : "following";
      const newFollowers = followStatus === "following" ? previousFollowers - 1 : 
                          previousFollowers + 1;

      setFollowStatus(newStatus);
      setProfile(prev => ({
        ...prev!,
        followersCount: newFollowers,
        isFollowing: newStatus === "following",
        isRequested: newStatus === "requested"
      }));

      // API call
      const response = await fetch("/api/follow-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`
        },
        body: JSON.stringify({ targetUsername: authorUsername })
      });

      if (!response.ok) throw new Error('Action failed');
      const data = await response.json();

      // Update with actual response
      const actualStatus = data.status === "Unfollowed" ? "" :
                          data.status === "Follow request sent" ? "requested" :
                          "following";
      setFollowStatus(actualStatus);
      setProfile(prev => ({
        ...prev!,
        followersCount: data.followersCount,
        isFollowing: actualStatus === "following",
        isRequested: actualStatus === "requested"
      }));

      // Update cache
      profileCache.set(authorUsername, {
        data: {
          ...profile,
          followersCount: data.followersCount,
          isFollowing: actualStatus === "following",
          isRequested: actualStatus === "requested"
        },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error("Follow action failed:", error);
      setFollowStatus(previousStatus);
      setProfile(prev => ({
        ...prev!,
        followersCount: previousFollowers,
        isFollowing: previousStatus === "following",
        isRequested: previousStatus === "requested"
      }));
    } finally {
      setIsUpdating(false);
    }
  }, [profile, isUpdating, authorUsername, followStatus]);

  return (
    <HoverCard>
      <HoverCardTrigger 
        onMouseEnter={() => !profile && fetchProfile()} 
        asChild 
        className="cursor-pointer w-fit"
      >
        <div className="flex items-center gap-2">
          {authorPhotoURL && (
            <Image
              src={authorPhotoURL}
              alt={authorDisplayName || authorUsername}
              width={30}
              height={30}
              className="rounded-full"
            />
          )}
          <p className="hover:opacity-60 text-lg font-semibold">
            {authorUsername}
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        {loading ? (
          <div className="flex justify-center p-4">
            <CircularProgress size={20} />
          </div>
        ) : profile ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Image
                src={`/api/proxy?url=${encodeURIComponent(profile.photoURL)}`}
                alt={profile.displayName}
                width={50}
                height={50}
                className="rounded-full"
                loading="lazy"
              />
              <div>
                <h3 className="font-bold">{profile.displayName}</h3>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <span>{profile.followersCount} followers</span>
              <span>{profile.followingCount} following</span>
            </div>
            <div className="flex gap-2">
              {profile.uid === auth.currentUser?.uid ? (
                <Link
                  href="/settings/profile"
                  className="px-4 py-1 rounded-full text-sm bg-secondary hover:bg-secondary/80"
                  prefetch={false}
                >
                  Edit Profile
                </Link>
              ) : (
                <>
                  <FollowButton
                    isUpdating={isUpdating}
                    followStatus={followStatus}
                    onFollowClick={handleFollow}
                    className={`px-4 py-1 rounded-full text-sm min-w-[80px] ${
                      followStatus 
                        ? "bg-secondary hover:bg-secondary/80" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  />
                  {followStatus === "following" && (
                    <button
                      onClick={() => window.location.href = `/inbox/${profile.uid}`}
                      className="px-4 py-1 rounded-full text-sm bg-secondary hover:bg-secondary/80"
                    >
                      Message
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {profile.verified && (
                <span className="text-green-500">✓ Verified</span>
              )}
              {profile.private && (
                <span className="text-red-500">🔒 Private Account</span>
              )}
            </div>
            <Link 
              href={`/${profile.username}`}
              className="block text-sm text-primary hover:underline"
              prefetch={false}
            >
              Visit profile →
            </Link>
          </div>
        ) : (
          <p className="text-sm">Error loading profile</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};