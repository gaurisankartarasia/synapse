import { CalendarMonth, Verified } from "@mui/icons-material";
import { formatFullDate } from "@/utils/date";
import { ChatButton } from "@/components/Username/ChatButton";
import { FollowButton } from "@/components/Username/FollowButton";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { UserProfile } from "@/types/hover-card/profile";

import { Avatar, Button } from "@mui/material";

interface Props {
  profile: UserProfile;
  onFollowClick: () => void;
}

export const UserHoverCardContent = ({ profile, onFollowClick }: Props) => {
  const { user: authUser } = useAuth();

  const followStatus = useSelector(
    (state: RootState) =>
      state.follow.followStatus[profile.username] ?? {
        isFollowing: false,
        isRequested: false,
        isFollowingWithoutFollowback: false,
        followerCount: 0,
        loading: false,
      }
  );

  const currentFollowState = followStatus.isFollowing
    ? "following"
    : followStatus.isRequested
    ? "requested"
    : followStatus.isFollowingWithoutFollowback
    ? "followBack"
    : "none";

  return (
    <div className="flex gap-4">
      <Avatar src={profile.profilePhotoURL} alt={profile.displayName} >
       
        {profile.displayName[0]?.toUpperCase()}
      </Avatar>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Link href={`/${profile.username}`} className="text-sm font-semibold">
            {profile.username}
          </Link>
          {profile.isVerified && <Verified fontSize="small" />}
        </div>

        <p className="text-sm text-muted-foreground">{profile.displayName}</p>
        <div className="flex gap-4 pt-1">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{profile.followerCount}</span>
            <span className="text-xs text-muted-foreground">Followers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{profile.followingCount}</span>
            <span className="text-xs text-muted-foreground">Following</span>
          </div>
        </div>

        <div className="flex items-center pt-2 text-xs text-muted-foreground">
          <CalendarMonth className="mr-2 h-4 w-4" />
          Joined {formatFullDate(profile.createdAt)}
        </div>

        <div className="flex items-center gap-2 container">
          {authUser && authUser.uid === profile.uid ? (
            <Link href={"/settings/profile/edit"}>
              <Button variant="outlined" className="w-full">
                Edit Profile
              </Button>
            </Link>
          ) : (
            <FollowButton
              isUpdating={followStatus.loading ?? false}
              followStatus={currentFollowState}
              onFollowClick={onFollowClick}
            />
          )}

          {profile.uid === authUser?.uid ? (
            <Link href={"/settings"}>
              <Button variant="outlined">Settings</Button>
            </Link>
          ) : (
            <ChatButton targetUserId={profile.uid} />
          )}
        </div>
      </div>
    </div>
  );
};
