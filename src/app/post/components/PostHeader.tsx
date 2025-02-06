
// src/app/post/components/PostHeader.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { auth } from "@/lib/firebaseClient";
import Link from 'next/link'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
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
  authorVerified: boolean
}

export const PostHeader: React.FC<PostHeaderProps> = ({ 
  authorUsername, 
  authorDisplayName, 
  authorPhotoURL,
  authorVerified
}) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [followStatus, setFollowStatus] = useState<"" | "requested" | "following">("");
 const [followersCount, setFollowersCount] = useState<number>(0);

const router = useRouter()

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
      };

      profileCache.set(authorUsername, { data: profileData, timestamp: Date.now() });
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [authorUsername, token]);

  const handleProfileClick =()=>{
    router.push(`/${authorUsername}`)
  }

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
  }, [followStatus, followersCount, isUpdating, authorUsername]);

  return (
    <HoverCard>
      <HoverCardTrigger 
        onMouseEnter={() => !profile && fetchProfile()} 
        asChild 
        className="cursor-pointer w-fit"
        onClick={handleProfileClick}
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
          <span>{authorVerified && (<VerifiedIcon fontSize="small"/>)}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        {loading ? (
          <div className="flex justify-center p-4">
            <Skeleton  />
          </div>
        ) : profile ? (
          <div className="space-y-2">
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
              <span> followers {profile.followersCount} </span>
              <span>following {profile.followingCount} </span>
            </div>
            <div className="flex gap-2">
              {profile.uid === auth.currentUser?.uid ? (
                <Link
                  href="/settings/profile"
                  className="text-center py-2 rounded text-sm bg-secondary hover:bg-secondary/80 w-full"
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
                    className={`px-4 py-1 w-full  ${
                      followStatus 
                        ? "bg-secondary " 
                        : "bg-primary text-primary-foreground"
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
              className="block py-2 rounded bg-secondary text-center text-sm text-primary w-full"
              prefetch={false}
            >
              Visit profile 
            </Link>
          </div>
        ) : (
          <p className="text-sm">Error loading profile</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};