//src/app/[username]/FollowButton.tsx
import React from "react";
import {Button, CircularProgress} from '@mui/material'

const Followbutton: React.FC<{
  isUpdating: boolean;
  followStatus: string;
  onFollowClick: () => void;
  className?: string;

}> = ({ isUpdating, followStatus, onFollowClick, className }) => {
  return (
    <Button
    className={` ${className || ''}`}
variant="contained"
      onClick={onFollowClick}
      disabled={isUpdating}
      color="primary"
    >
      {isUpdating ? (
        <CircularProgress size={15}/>
        
      ) : followStatus === "following" ? (
        "Following"
      ) : followStatus === "requested" ? (
        "Requested"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default Followbutton;


