import React from "react";
import "./globals.css";

const FollowStats: React.FC<{
  followerCount: number;
  followingCount: number;
  followStatus: string;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  errorMessage?: string;
}> = ({
  followerCount,
  followingCount,
  followStatus,
  onFollowersClick,
  onFollowingClick,
  errorMessage,
}) => {
  return (
    <div className="follow-stats">
      <div
        className="followers"
        onClick={(e) => {
          e.preventDefault();
          if (followStatus === "following") onFollowersClick();
          else alert("Follow this user to see the follower list");
        }}
      >
        {followerCount} Followers
      </div>
      <div
        className="following"
        onClick={(e) => {
          e.preventDefault();
          if (followStatus === "following") onFollowingClick();
          else alert("Follow this user to see the following list");
        }}
      >
        {followingCount} Following
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default FollowStats;
