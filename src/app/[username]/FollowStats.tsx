// import React from "react";
// import "./globals.css";

// const FollowStats: React.FC<{
//   followerCount: number;
//   followingCount: number;
//   followStatus: string;
//   onFollowersClick: () => void;
//   onFollowingClick: () => void;
//   errorMessage?: string;
// }> = ({
//   followerCount,
//   followingCount,
//   followStatus,
//   onFollowersClick,
//   onFollowingClick,
//   errorMessage,
// }) => {
//   return (
//     <div className="follow-stats">
//       <div
//         className="followers"
//         onClick={(e) => {
//           e.preventDefault();
//           if (followStatus === "following") onFollowersClick();
//           else alert("Follow this user to see the follower list");
//         }}
//       >
//         {followerCount} Followers
//       </div>
//       <div
//         className="following"
//         onClick={(e) => {
//           e.preventDefault();
//           if (followStatus === "following") onFollowingClick();
//           else alert("Follow this user to see the following list");
//         }}
//       >
//         {followingCount} Following
//       </div>
//       {errorMessage && <p className="error-message">{errorMessage}</p>}
//     </div>
//   );
// };

// export default FollowStats;




// components/profile/FollowStats.tsx
import { Button } from "@/components/ui/button";
import { FollowStatus } from "@/types/profile";

interface FollowStatsProps {
  followerCount: number;
  followingCount: number;
  followStatus: FollowStatus;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

export const FollowStats: React.FC<FollowStatsProps> = ({
  followerCount,
  followingCount,
  followStatus,
  onFollowersClick,
  onFollowingClick,
}) => {
  return (
    <div className="flex justify-center space-x-4 my-6">
      <Button
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          if (followStatus === "following") onFollowersClick();
          else alert("Follow this user to see the follower list");
        }}
        className="flex flex-col items-center p-8"
      >
        <span className="font-semibold">{followerCount}</span>
        <span className="text-sm text-muted-foreground">Followers</span>
      </Button>
      <Button
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          if (followStatus === "following") onFollowingClick();
          else alert("Follow this user to see the following list");
        }}
        className="flex flex-col items-center p-8"
      >
        <span className="font-semibold">{followingCount}</span>
        <span className="text-sm text-muted-foreground">Following</span>
      </Button>
    </div>
  );
};
