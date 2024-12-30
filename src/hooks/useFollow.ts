import { useState, useCallback } from 'react';
import { auth } from '@/lib/firebaseClient';

interface UseFollowProps {
  initialFollowStatus: string;
  initialFollowersCount: number;
  targetUsername: string;
}

export const useFollow = ({ 
  initialFollowStatus, 
  initialFollowersCount, 
  targetUsername 
}: UseFollowProps) => {
  const [followStatus, setFollowStatus] = useState(initialFollowStatus);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isUpdating, setIsUpdating] = useState(false);

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
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ targetUsername }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "Unfollowed") {
          setFollowStatus("");
          setFollowersCount(data.followersCount ?? followersCount);
        } else if (data.status === "Follow request sent") {
          setFollowStatus("requested");
          setFollowersCount(data.followersCount ?? followersCount);
        } else if (data.following) {
          setFollowStatus("following");
          setFollowersCount(data.followersCount ?? followersCount);
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
  }, [followStatus, followersCount, isUpdating, targetUsername]);

  return {
    followStatus,
    followersCount,
    isUpdating,
    handleFollow
  };
};