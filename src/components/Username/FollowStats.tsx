
import { FollowStatus } from "@/types/profile";
import { useAuth } from "@/hooks/useAuth";


interface FollowStatsProps {
  followerCount: number;
  followingCount: number;
  followStatus: FollowStatus;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  profileUid: string; 
}

export const FollowStats: React.FC<FollowStatsProps> = ({
  followerCount,
  followingCount,
  followStatus,
  onFollowersClick,
  onFollowingClick,
  profileUid,
}) => {
  const { user } = useAuth(); // Get logged-in user

  const isOwnProfile = user?.uid === profileUid; // Check if viewing own profile

  return (
    <div className="flex justify-center space-x-4 my-6">
      <div
        
        onClick={(e) => {
          e.preventDefault();
          if (isOwnProfile || followStatus === "following") onFollowersClick();
          else alert("Follow this user to see the follower list");
        }}
        className="flex gap-2 font-semibold items-center cursor-pointer"
      >
        <span className="">{followerCount}</span>
        <span className="text-sm text-muted-foreground">Followers</span>
      </div>
      <div
        
        onClick={(e) => {
          e.preventDefault();
          if (isOwnProfile || followStatus === "following") onFollowingClick();
          else alert("Follow this user to see the following list");
        }}
        className="flex font-semibold items-center gap-2 cursor-pointer"
      >
        <span className="">{followingCount}</span>
        <span className="text-sm text-">Following</span>
      </div>
    </div>
  );
};
