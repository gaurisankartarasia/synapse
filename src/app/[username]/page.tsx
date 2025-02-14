
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { auth } from "../../lib/firebaseClient";
// import {ProfileHeader} from "./ProfileHeader";
// import {FollowStats} from "./FollowStats";
// import {FollowButton} from "./FollowButton";
// import ModalList from "./ModalList";
// import {ChatButton} from "./ChatButton";
// import UserPosts from '../profile/Posts';
// import { ProfileData } from "@/types/profile";
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../redux/store';
// import { toggleFollow, setFollowStatus } from '../../redux/features/followSlice';


// const PublicProfilePage: React.FC = () => {
//   const params = useParams();
//   const username = params?.username as string;
//   const router = useRouter();

//   const [profileData, setProfileData] = useState<ProfileData | null>(null);
//   const [followersList, setFollowersList] = useState<any[]>([]);
//   const [followingList, setFollowingList] = useState<any[]>([]);
//   const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
//   const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
//   const [isUpdating, setIsUpdating] = useState<boolean>(false);
//   const [loadingModal, setLoadingModal] = useState<boolean>(false);

//   const dispatch = useDispatch<AppDispatch>();
//   const followState = useSelector((state: RootState) => state.follow);

//   const fetchUserData = useCallback(async () => {
//     try {
//       const currentUser = await new Promise<any>((resolve, reject) => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//           unsubscribe();
//           if (user) {
//             resolve(user);
//           } else {
//             reject(new Error("Not authenticated"));
//           }
//         });
//       });
  
//       const token = await currentUser.getIdToken();
  
//       // Redirect if the current user is viewing their own profile
//       if (currentUser.displayName === username) {
//         router.push("/profile");
//         return;
//       }
  
//       // Fetch user data from the merged API
//       const response = await fetch(`/api/user-profile/query?username=${username}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       if (!response.ok) {
//         if (response.status === 403) {
//           console.log("Content not available - User may be blocked");
//         }
//         router.back();
//         return;
//       }
  
//       const data = await response.json();
//       setProfileData(data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   }, [username, router]);

//   const fetchModalData = useCallback(
//     async (type: "followers" | "following") => {
//       setLoadingModal(true);
//       try {
//         const token = await auth.currentUser?.getIdToken();
//         const endpoint =
//           type === "followers"
//             ? `/api/target_user_followers_list?username=${username}`
//             : `/api/target_user_followings_list?username=${username}`;
//         const response = await fetch(endpoint, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (type === "followers") {
//             setFollowersList(data.followers || []);
//           } else {
//             setFollowingList(data.following || []);
//           }
//         } else {
//           throw new Error(`Failed to fetch ${type} data`);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoadingModal(false);
//       }
//     },
//     [username]
//   );

//   useEffect(() => {
//     fetchUserData();
//   }, [fetchUserData]);

//   const handleModalOpen = (type: "followers" | "following") => {
//     if (type === "followers") {
//       setIsFollowersModalOpen(true);
//       fetchModalData("followers");
//       window.history.pushState(null, "", `/${username}?followers`);
//     } else {
//       setIsFollowingModalOpen(true);
//       fetchModalData("following");
//       window.history.pushState(null, "", `/${username}?following`);
//     }
//   };

//   const handleModalClose = (type: "followers" | "following") => {
//     if (type === "followers") {
//       setIsFollowersModalOpen(false);
//     } else {
//       setIsFollowingModalOpen(false);
//     }
//     window.history.pushState(null, "", `/${username}`);
//   };

//   useEffect(() => {
//     if (profileData) {
//       dispatch(setFollowStatus({
//         username: profileData.username,
//         isFollowing: profileData.isFollowing,
//         isRequested: profileData.isRequested,
//         followerCount: profileData.followerCount,
//       }));
//     }
//   }, [dispatch, profileData]);


//   const handleFollow = useCallback(async () => {
//     if (!auth.currentUser || followState.loading || !profileData) return;

//     dispatch(toggleFollow(username));
//   }, [dispatch, username, profileData, followState.loading]);

//   if (!profileData) {
//     return null;
//   }

//   const currentFollowStatus = followState.followStatus[username] || {
//     isFollowing: profileData.isFollowing,
//     isRequested: profileData.isRequested,
//     followerCount: profileData.followerCount,
//   };

//   const followStatus = currentFollowStatus.isFollowing 
//     ? "following" 
//     : currentFollowStatus.isRequested 
//     ? "requested" 
//     : "none";


//   if (!profileData) {
//     return null;
//   }


//   return (
//     <main className="">
//       <ProfileHeader
//         profilePhotoURL={profileData.profilePhotoURL || "/default.webp"}
//         username={profileData.username}
//         displayName={profileData.displayName || profileData.username}
//         isVerified={profileData.isVerified}
//         createdAt={profileData.createdAt}
//         bio={profileData.bio}
//       />
//       <FollowStats
//         followerCount={profileData.followerCount}
//         followingCount={profileData.followingCount}
//         followStatus={followStatus}
//         onFollowersClick={() => handleModalOpen("followers")}
//         onFollowingClick={() => handleModalOpen("following")}
//       />
//      <div className="flex ">
//      <FollowButton
//           isUpdating={followState.loading}
//           followStatus={followStatus}
//           onFollowClick={handleFollow}
//         />

// {!profileData.isPrivate &&  <ChatButton targetUserId={profileData.uid} />}
//      </div>
     

//       <ModalList
//         isOpen={isFollowersModalOpen}
//         onClose={() => handleModalClose("followers")}
//         title="Followers"
//         loading={loadingModal}
//         items={followersList}
//       />
//       <ModalList
//         isOpen={isFollowingModalOpen}
//         onClose={() => handleModalClose("following")}
//         title="Following"
//         loading={loadingModal}
//         items={followingList}
//       />
    

//     <div>
    
//     </div>
    
//     <UserPosts uid={profileData.uid}/>

      
//     </main>
//   );
// };

// export default PublicProfilePage;




"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import { ProfileHeader } from "./ProfileHeader";
import { FollowStats } from "./FollowStats";
import { FollowButton } from "./FollowButton";
import ModalList from "./ModalList";
import { ChatButton } from "./ChatButton";
import UserPosts from '../profile/Posts';
import { ProfileData } from "@/types/profile";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { toggleFollow, setFollowStatus } from '../../redux/features/followSlice';
import MutualFollowers  from './MutualFollowers'

const PublicProfilePage: React.FC = () => {
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  // Get follow state from Redux with default values to ensure type safety
  const followStatus = useSelector((state: RootState) => 
    state.follow.followStatus[username] ?? {
      isFollowing: false,
      isRequested: false,
      followerCount: 0,
      loading: false
    }
  );

  const fetchUserData = useCallback(async () => {
    try {
      const currentUser = await new Promise<any>((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            resolve(user);
          } else {
            reject(new Error("Not authenticated"));
          }
        });
      });

      const token = await currentUser.getIdToken();

      if (currentUser.displayName === username) {
        router.push("/profile");
        return;
      }

      const response = await fetch(`/api/user-profile/query?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.log("Content not available - User may be blocked");
        }
        router.back();
        return;
      }

      const data = await response.json();
      setProfileData(data);
      
      // Initialize follow status in Redux
      dispatch(setFollowStatus({
        username: data.username,
        isFollowing: data.isFollowing,
        isRequested: data.isRequested,
        followerCount: data.followerCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [username, router, dispatch]);

  const fetchModalData = useCallback(async (type: "followers" | "following") => {
    setLoadingModal(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const endpoint = type === "followers"
        ? `/api/target_user_followers_list?username=${username}`
        : `/api/target_user_followings_list?username=${username}`;
        
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (type === "followers") {
          setFollowersList(data.followers || []);
        } else {
          setFollowingList(data.following || []);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingModal(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleModalOpen = (type: "followers" | "following") => {
    if (type === "followers") {
      setIsFollowersModalOpen(true);
      fetchModalData("followers");
      window.history.pushState(null, "", `/${username}?followers`);
    } else {
      setIsFollowingModalOpen(true);
      fetchModalData("following");
      window.history.pushState(null, "", `/${username}?following`);
    }
  };

  const handleModalClose = (type: "followers" | "following") => {
    if (type === "followers") {
      setIsFollowersModalOpen(false);
    } else {
      setIsFollowingModalOpen(false);
    }
    window.history.pushState(null, "", `/${username}`);
  };

  const handleFollow = useCallback(() => {
    if (!auth.currentUser || followStatus.loading || !profileData) return;
    dispatch(toggleFollow(username));
  }, [dispatch, username, profileData, followStatus.loading]);

  if (!profileData) return null;

  const currentFollowState = followStatus.isFollowing 
    ? "following" 
    : followStatus.isRequested 
    ? "requested" 
    : "none";

  return (
    <main className="">
      <ProfileHeader
        profilePhotoURL={profileData.profilePhotoURL || "/default.webp"}
        username={profileData.username}
        displayName={profileData.displayName || profileData.username}
        isVerified={profileData.isVerified}
        createdAt={profileData.createdAt}
        bio={profileData.bio}
      />
      <FollowStats
        followerCount={followStatus.followerCount}
        followingCount={profileData.followingCount}
        followStatus={currentFollowState}
        onFollowersClick={() => handleModalOpen("followers")}
        onFollowingClick={() => handleModalOpen("following")}
      />
      <MutualFollowers 
  username={username} 
  onUserClick={(username) => router.push(`/${username}`)}
/>
      <div className="flex">
        <FollowButton
          isUpdating={followStatus.loading ?? false} // Ensure boolean type with fallback
          followStatus={currentFollowState}
          onFollowClick={handleFollow}
        />
        {!profileData.isPrivate && <ChatButton targetUserId={profileData.uid} />}
      </div>

      <ModalList
        isOpen={isFollowersModalOpen}
        onClose={() => handleModalClose("followers")}
        title="Followers"
        loading={loadingModal}
        items={followersList}
      />
      <ModalList
        isOpen={isFollowingModalOpen}
        onClose={() => handleModalClose("following")}
        title="Following"
        loading={loadingModal}
        items={followingList}
      />

      <UserPosts uid={profileData.uid} />
    </main>
  );
};

export default PublicProfilePage;