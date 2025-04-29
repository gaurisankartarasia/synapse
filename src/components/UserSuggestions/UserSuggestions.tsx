"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Verified } from "@mui/icons-material";
import Link from "next/link";
import { FollowButton } from "../Username/FollowButton";
import { AppDispatch, RootState } from "@/redux/store";
import { setFollowStatus, toggleFollow } from "@/redux/features/followSlice";
import { fetchSuggestedUsers } from "@/redux/features/suggestionSlice";
import { UserHoverCard } from "../hover-card/user-profile-hover-card";
import {
  CircularProgress,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";

export default function UserSuggestions() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users: suggestions,
    loading,
    error,
  } = useSelector((state: RootState) => state.suggestions);
  const followState = useSelector((state: RootState) => state.follow);

  useEffect(() => {
    if (suggestions.length === 0) {
      dispatch(fetchSuggestedUsers());
    }
  }, [dispatch, suggestions.length]);

  useEffect(() => {
    suggestions.forEach((user) => {
      dispatch(
        setFollowStatus({
          username: user.username,
          isFollowing: user.isFollowing,
          isRequested: user.isRequested || false,
          followerCount: 0,
        })
      );
    });
  }, [dispatch, suggestions]);

  const handleFollow = async (username: string) => {
    try {
      await dispatch(toggleFollow(username)).unwrap();
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="w-full max-w-sm">
      <h3 className="font-semibold mb-4">Suggested for you</h3>

      <div>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            "& > *": {
              // Targeting direct children
              marginBottom: 1, // Another way to add vertical spacing
            },
          }}
        >
          {suggestions.map((user) => {
            const currentFollowStatus = followState.followStatus[
              user.username
            ] || {
              isFollowing: user.isFollowing,
              isRequested: user.isRequested || false,
              loading: false,
            };

            const followStatus = currentFollowStatus.isFollowing
              ? "following"
              : currentFollowStatus.isRequested
              ? "requested"
              : "none";

            return (
              <Card
                key={user.uid}
                
              >
                
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar src={user.profilePhotoURL} alt={user.username}>
                        {user.username.slice(0, 1)}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <UserHoverCard username={user.username}>
                            <Link
                              href={`/${user.username}`}
                              className="font-medium "
                            >
                              {user.username}
                            </Link>
                          </UserHoverCard>
                          {user.isVerified && <Verified sx={{fontSize:'16px'}} />}
                        </div>
                        <p className="t500 text-xs">{user.displayName}</p>
                      </div>
                    </div>
                    <FollowButton
                      isUpdating={currentFollowStatus.loading || false}
                      followStatus={followStatus}
                      onFollowClick={() => handleFollow(user.username)}
                    />
                  </CardContent>{" "}
              </Card>
            );
          })}
        </CardContent>
      </div>
    </div>
  );
}
