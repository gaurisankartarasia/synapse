"use client";

import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { formatFullDate } from "@/utils/date";
import { FollowButton } from "@/app/[username]/FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setFollowStatus, toggleFollow } from "@/redux/features/followSlice";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "./ui/button";
import { ChatButton } from "@/app/[username]/ChatButton";
import { VscVerifiedFilled } from "react-icons/vsc";
import Link from "next/link";

interface UserHoverCardProps {
  username: string;
  children: React.ReactNode;
}

interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  followerCount: number;
  followingCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing?: boolean;
  isRequested?: boolean;
  isFollowingWithoutFollowback?: boolean;
}

export function UserHoverCard({ username, children }: UserHoverCardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user: authUser } = useAuth();

  // Get follow state from Redux
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

  useEffect(() => {
    if (open && !profile) {
      const fetchProfile = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/user-profile/query?username=${username}`,
            { credentials: "include" }
          );

          if (!response.ok) {
            throw new Error(
              response.status === 404
                ? "User not found"
                : "Failed to fetch user"
            );
          }

          const data = await response.json();
          setProfile(data);
          dispatch(
            setFollowStatus({
              username: data.username,
              isFollowing: data.isFollowing,
              isRequested: data.isRequested,
              isFollowingWithoutFollowback: data.isFollowingWithoutFollowback,
              followerCount: data.followerCount,
            })
          );
          setError(null);
        } catch (err) {
          setError("Failed to load user data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [open, username, profile, dispatch]);

  const handleFollow = () => {
    if (!authUser || followStatus.loading) return;
    dispatch(toggleFollow(username));
  };

  const currentFollowState = followStatus.isFollowing
    ? "following"
    : followStatus.isRequested
    ? "requested"
    : followStatus.isFollowingWithoutFollowback
    ? "followBack"
    : "none";

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[350px]">
        {isLoading ? (
          <div className="flex justify-center items-center ">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center text-sm">{error}</div>
        ) : profile ? (
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={profile.profilePhotoURL} />
              <AvatarFallback>
                {profile.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Link href={`/${profile.username}`} className="text-sm font-semibold">{profile.username}</Link>
                {profile.isVerified && <VscVerifiedFilled />}
              </div>

              <p className="text-sm text-muted-foreground">
                {profile.displayName}
              </p>
              <div className="flex gap-4 pt-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {profile.followerCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Followers
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {profile.followingCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Following
                  </span>
                </div>
              </div>

              <div className="flex items-center pt-2 text-xs text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Joined {formatFullDate(profile.createdAt)}
              </div>
              <div className="flex items-center gap-2 container">
                {authUser && authUser.uid === profile.uid ? (
               <Link href={"/settings/profile/edit"}>
                  <Button variant="secondary" className="w-full">
                    Edit Profile
                  </Button></Link>
                ) : (
                  <FollowButton
                    isUpdating={followStatus.loading ?? false}
                    followStatus={currentFollowState}
                    onFollowClick={handleFollow}
                  />
                )}

                {profile.uid === authUser?.uid ? (
                  <Link href={"/settings"} >
                  <Button variant="outline">Settings</Button></Link>
                ) : (
                  <ChatButton targetUserId={profile.uid} />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}
