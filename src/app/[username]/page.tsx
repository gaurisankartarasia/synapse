

//src/app/[username]/page.tsx

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import { FollowStats } from "./FollowStats";
import { FollowButton } from "./FollowButton";
import EnhancedModalList from "./ModalList";
import { ChatButton } from "./ChatButton";
import UserPosts from "../profile/Posts";
import { ProfileData } from "@/types/profile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  toggleFollow,
  setFollowStatus,
} from "../../redux/features/followSlice";
import MutualFollowers from "./MutualFollowers";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const PublicProfilePage: React.FC = () => {
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user: authUser } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  // Get follow state from Redux with default values to ensure type safety
  const followStatus = useSelector(
    (state: RootState) =>
      state.follow.followStatus[username] ?? {
        isFollowing: false,
        isRequested: false,
        isFollowingWithoutFollowback: false,
        followerCount: 0,
        loading: false,
      }
  );

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {

      

      if (!authUser) {
        return;
      }

      const response = await fetch(
        `/api/user-profile/query?username=${username}`,
        {
          credentials: "include",
        }
      );

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
      dispatch(
        setFollowStatus({
          username: data.username,
          isFollowing: data.isFollowing,
          isRequested: data.isRequested,
          isFollowingWithoutFollowback: data.isFollowingWithoutFollowback,
          followerCount: data.followerCount,
        })
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [username, router, dispatch, authUser]);

  const fetchModalData = useCallback(
    async (type: "followers" | "following") => {
      setLoadingModal(true);
      try {
        const endpoint =
          type === "followers"
            ? `/api/followers_list/query?username=${username}`
            : `/api/followings_list/query?username=${username}`;

        const response = await fetch(endpoint, {
          credentials: "include",
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
    },
    [username]
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, authUser]);

  const handleModalOpen = (type: "followers" | "following") => {
    if (type === "followers") {
      setIsFollowersModalOpen(true);
      fetchModalData("followers");
    } else {
      setIsFollowingModalOpen(true);
      fetchModalData("following");
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
    if (!authUser || followStatus.loading || !profileData) return;
    dispatch(toggleFollow(username));
  }, [dispatch, username, profileData, authUser, followStatus.loading]);

  const currentFollowState = followStatus.isFollowing
    ? "following"
    : followStatus.isRequested
    ? "requested"
    :followStatus.isFollowingWithoutFollowback
    ? "followBack"
    : "none";

  const goToSettingsPage = () => {
    router.push("/settings");
  };

  const goToEditPage = () => {
    router.push("/profile/edit");
  };

  const handleRemoveFollower = async (followerUid: string) => {
    try {
      const response = await fetch("/api/remove-follower", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ followerUid }),
      });

      if (response.ok) {
        // Update followers list
        setFollowersList((prev) =>
          prev.filter((user) => user.uid !== followerUid)
        );
        // Update follower count in Redux
        dispatch(
          setFollowStatus({
            username,
            followerCount: (followStatus.followerCount || 0) - 1,
            isFollowing: followStatus.isFollowing,
            isRequested: followStatus.isRequested,
            isFollowingWithoutFollowback: followStatus.isFollowingWithoutFollowback
          })
        );
      }
    } catch (error) {
      console.error("Error removing follower:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!profileData) return null;

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
        profileUid={profileData.uid} // Pass user ID for ownership check
        followerCount={followStatus.followerCount}
        followingCount={profileData.followingCount}
        followStatus={currentFollowState}
        onFollowersClick={() => handleModalOpen("followers")}
        onFollowingClick={() => handleModalOpen("following")}
      />

{followStatus.isFollowingWithoutFollowback && (
  <p className="text-sm text-gray-500">This user follows you but you don't.</p>
)}

      <MutualFollowers
        username={username}
        onUserClick={(username) => router.push(`/${username}`)}
      />

      <div className="flex justify-center gap-2">
        {profileData.uid === authUser?.uid ? (
          <Button variant='outline' onClick={goToEditPage}>
            Edit Profile
          </Button>
        ) : (
          <FollowButton
            isUpdating={followStatus.loading ?? false}
            followStatus={currentFollowState}
            onFollowClick={handleFollow}
          />
        )}

        {profileData.uid === authUser?.uid ? (
          <Button variant="outline" onClick={goToSettingsPage}>
            Settings
          </Button>
        ) : (
          <ChatButton targetUserId={profileData.uid} />
        )}
      </div>

      <EnhancedModalList
      
        isOpen={isFollowersModalOpen}
        onClose={() => handleModalClose("followers")}
        title="Followers"
        loading={loadingModal}
        items={followersList}
        isOwnProfile={profileData?.uid === authUser?.uid}
        onRemoveFollower={handleRemoveFollower}
      />
      <EnhancedModalList
        isOpen={isFollowingModalOpen}
        onClose={() => handleModalClose("following")}
        title="Following"
        loading={loadingModal}
        items={followingList}
        isOwnProfile={profileData?.uid === authUser?.uid}
      />

      <UserPosts uid={profileData.uid} currentUserUid={authUser?.uid} />
    </main>
  );
};

export default PublicProfilePage;















