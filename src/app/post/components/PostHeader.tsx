

"use client";

import React, { useState, useCallback } from "react";
import { auth } from "@/lib/firebaseClient";
import Link from 'next/link'
import {Button} from '@mui/material'

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
  const [followStatus, setFollowStatus] = useState<string>("");
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingFollowStatus, setLoadingFollowStatus] = useState(false);

  const fetchProfile = async () => {
    if (profileCache.has(authorUsername)) {
      const cachedProfile = profileCache.get(authorUsername)!;
      setProfile(cachedProfile);
      setFollowersCount(cachedProfile.followersCount);
      return;
    }

    try {
      setLoading(true);
      setLoadingFollowStatus(true);
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
        followersCount: followData.followersCount || 0
      };

      setFollowStatus(
        followData.isFollowing ? "following" : followData.isRequested ? "requested" : ""
      );
      setFollowersCount(fetchedProfile.followersCount);
      
      profileCache.set(authorUsername, fetchedProfile);
      setProfile(fetchedProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
      setLoadingFollowStatus(false);
    }
  };

  const handleFollow = useCallback(async () => {
    if (!auth.currentUser || isUpdating || !profile) return;

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
        body: JSON.stringify({ targetUsername: authorUsername }),
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
  }, [followStatus, followersCount, isUpdating, authorUsername, profile]);

  const handleMouseEnter = () => {
    setIsPopoverVisible(true);
    if (!profile) {
      fetchProfile();
    }
  };
  
  const handleMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (
      relatedTarget &&
      (relatedTarget.closest(".popover-div") || relatedTarget.closest(".username-span"))
    ) {
      return;
    }
    setIsPopoverVisible(false);
  };

  const getFollowButtonContent = () => {
    if (loadingFollowStatus || isUpdating) {
      return 'loading...';
    }
    
    if (followStatus === "following") return "Following";
    if (followStatus === "requested") return "Requested";
    return "Follow";
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
          className="absolute left-0 z-[1500] w-72 p-4 bg-gray-100 popover-div"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {loading ? (
            'loading...'
          ) : profile ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img
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
                <span>Followers: {followersCount}</span>
                <span>Following: {profile.followingCount}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleFollow}
                  disabled={loadingFollowStatus || isUpdating}
                  className={`px-4 py-1 rounded-full text-sm flex items-center justify-center min-w-[80px] ${
                    followStatus === "following"
                      ? "bg-gray-200 hover:bg-gray-300 text-black"
                      : followStatus === "requested"
                      ? "bg-gray-200 hover:bg-gray-300 text-black"
                      : "bg-blue-500 text-white hover:bg-blue-600 w-full"
                  }`}
                >
                  {getFollowButtonContent()}
                </Button>
                {followStatus === "following" && (
                  <Button
                    onClick={() => window.location.href = `/inbox/${profile.uid}`}
                    className="px-4 py-1 rounded-full text-black bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    Message
                  </Button>
                )}
              </div>
              {profile.verified && (
                <span className="text-green-500 text-sm">Verified</span>
              )}
              {profile.private && (
                <p className="text-red-500 text-sm">Private Account</p>
              )}
              
             <Link href={`/${profile.username}`}>Visit profile</Link>
            </div>
          ) : (
            <p>Error loading profile</p>
          )}
        </div>
      )}
    </div>
  );
}