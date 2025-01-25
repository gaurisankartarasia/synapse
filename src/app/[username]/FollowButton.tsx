//src/app/[username]/FollowButton.tsx
import React from "react";
import {CircularProgress} from '@mui/material'

const Followbutton: React.FC<{
  isUpdating: boolean;
  followStatus: string;
  onFollowClick: () => void;
  className?: string;

}> = ({ isUpdating, followStatus, onFollowClick, className }) => {
  return (
    <button
    className={`follow-button ${className || ''}`}

      onClick={onFollowClick}
      disabled={isUpdating}
      color="primary"
    >
      {isUpdating ? (
        <CircularProgress/>
        
      ) : followStatus === "following" ? (
        "Following"
      ) : followStatus === "requested" ? (
        "Requested"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default Followbutton;


