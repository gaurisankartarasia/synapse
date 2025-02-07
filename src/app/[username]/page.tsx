
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import ProfileHeader from "./ProfileHeader";
import FollowStats from "./FollowStats";
import FollowButton from "./FollowButton";
import ModalList from "./ModalList";
import ChatButton from "./ChatButton";
import UserPosts from '../profile/Posts'

const PublicProfilePage: React.FC = () => {
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followStatus, setFollowStatus] = useState<string>(""); 
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
  
      // Fetch user data from the API
      const userResponse = await fetch(`/api/user-profile-public?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!userResponse.ok) {
        router.back()
        // throw new Error("Failed to fetch user data f");
      }
  
      const userData = await userResponse.json();
      setUser(userData);
  
      // Fetch follow data
      const followResponse = await fetch(`/api/get-following-followers?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (followResponse.status === 403) {
        console.log("You have blocked this user. Skipping followers/following fetch.");
        setFollowersCount(0);
        setFollowingCount(0);
        setFollowStatus("");
        return;
      }
  
      if (!followResponse.ok) {
        throw new Error("Failed to fetch follow data");
      }
  
      const followData = await followResponse.json();
      setFollowersCount(followData.followersCount || 0);
      setFollowingCount(followData.followingCount || 0);
      setFollowStatus(
        followData.isFollowing ? "following" : followData.isRequested ? "requested" : ""
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      // router.push("/signin");
    } finally {
      // setLoadingProfile(false);
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
          throw new Error(`Failed to fetch ${type} data f`);
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
    if (!auth.currentUser || isUpdating) return;

    const isFollowing = followStatus === "following";
    const isRequesting = followStatus === "requested";

    setIsUpdating(true);

    const tempFollowersCount = isFollowing
      ? Math.max(0, followersCount - 1)
      : followersCount + 1;

    setFollowersCount(tempFollowersCount);
    setFollowStatus(isFollowing || isRequesting ? "" : "requested");

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/follow-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUsername: username }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "Unfollowed") {
          setFollowStatus("");
          setFollowersCount(data.followersCount || followersCount);
        } else if (data.status === "Follow request sent") {
          setFollowStatus("requested");
          setFollowersCount(data.followersCount || followersCount);
        } else if (data.following) {
          setFollowStatus("following");
          setFollowersCount(data.followersCount || followersCount);
        }
      } else {
        throw new Error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Follow action failed:", error);
      setFollowersCount(followersCount);
      setFollowStatus(isFollowing || isRequesting ? "following" : "");
    } finally {
      setIsUpdating(false);
    }
  }, [followStatus, followersCount, isUpdating, username]);



  if (!user) {
    return null
    ;
  }

  return (
    <main className="profile-container">
          
      <ProfileHeader
        photoURL={user.photoURL || "/default.webp"}
        username={user.username}
        displayName={user.displayName || user.username}
        verified={user.verified}
        bio={user.bio}
      />
      <FollowStats
        followersCount={followersCount}
        followingCount={followingCount}
        followStatus={followStatus}
        onFollowersClick={() => handleModalOpen("followers")}
        onFollowingClick={() => handleModalOpen("following")}
      />
      <FollowButton
        isUpdating={isUpdating}
        followStatus={followStatus}
        onFollowClick={handleFollow}
      />
      <ChatButton targetUserId={user.uid} />
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
      <UserPosts uid={user.uid}/>
    </main>
  );
};

export default PublicProfilePage;











