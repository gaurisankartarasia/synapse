
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import ProfileHeader from "./ProfileHeader";
import FollowStats from "./FollowStats";
import FollowButton from "./FollowButton";
import ModalList from "./ModalList";
import ChatButton from "./ChatButton";
import UserPosts from '../profile/Posts';


interface ProfileData {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  createdAt:string;
  bio: string;
  isVerified: boolean;
  isPrivate:boolean;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isRequested: boolean;
  blocked?: boolean;
}


const PublicProfilePage: React.FC = () => {
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

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
  
      // Redirect if the current user is viewing their own profile
      if (currentUser.displayName === username) {
        router.push("/profile");
        return;
      }
  
      // Fetch user data from the merged API
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
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [username, router]);

  const fetchModalData = useCallback(
    async (type: "followers" | "following") => {
      setLoadingModal(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const endpoint =
          type === "followers"
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
        } else {
          throw new Error(`Failed to fetch ${type} data`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingModal(false);
      }
    },
    [username]
  );

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

  const handleFollow = useCallback(async () => {
    if (!auth.currentUser || isUpdating || !profileData) return;

    const isFollowing = profileData.isFollowing;
    const isRequesting = profileData.isRequested;

    setIsUpdating(true);

    const tempfollowerCount = isFollowing
      ? Math.max(0, profileData.followerCount - 1)
      : profileData.followerCount + 1;

    setProfileData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        followerCount: tempfollowerCount,
        isFollowing: false,
        isRequested: !isFollowing && !isRequesting
      };
    });

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/follow-user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ targetUsername: username }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            followerCount: data.followerCount || prev.followerCount,
            isFollowing: data.status === "Following",
            isRequested: data.status === "Follow request sent"
          };
        });
      } else {
        throw new Error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Follow action failed:", error);
      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          followerCount: profileData.followerCount,
          isFollowing: isFollowing,
          isRequested: isRequesting
        };
      });
    } finally {
      setIsUpdating(false);
    }
  }, [profileData, isUpdating, username]);

  if (!profileData) {
    return null;
  }

  const followStatus = profileData.isFollowing ? "following" : profileData.isRequested ? "requested" : "";

  return (
    <main className="profile-container">
      <ProfileHeader
        profilePhotoURL={profileData.profilePhotoURL || "/default.webp"}
        username={profileData.username}
        displayName={profileData.displayName || profileData.username}
        isVerified={profileData.isVerified}
        createdAt={profileData.createdAt}
        bio={profileData.bio}
      />
      <FollowStats
        followerCount={profileData.followerCount}
        followingCount={profileData.followingCount}
        followStatus={followStatus}
        onFollowersClick={() => handleModalOpen("followers")}
        onFollowingClick={() => handleModalOpen("following")}
      />
      <FollowButton
        isUpdating={isUpdating}
        followStatus={followStatus}
        onFollowClick={handleFollow}
      />

{!profileData.isPrivate &&  <ChatButton targetUserId={profileData.uid} />}
     

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
    

    <div>
      {/* {profileData.isPrivate ? 
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-gray-600">
        <LockPersonIcon fontSize='large' />
        <p className="text-lg font-medium text-center">This user's posts are private</p>
        <p className="text-sm text-center">Follow this user to see their posts</p>
      </div> 
      :
       <UserPosts uid={profileData.uid}/>} */}
    </div>
    
    <UserPosts uid={profileData.uid}/>

      
    </main>
  );
};

export default PublicProfilePage;