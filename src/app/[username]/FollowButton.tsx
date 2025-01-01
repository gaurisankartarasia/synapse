import React from "react";
import { Button } from "@mui/material";


const Followbutton: React.FC<{
  isUpdating: boolean;
  followStatus: string;
  onFollowClick: () => void;
}> = ({ isUpdating, followStatus, onFollowClick }) => {
  return (
    <Button
      className="follow-button"
      onClick={onFollowClick}
      disabled={isUpdating}
      color="primary"
    >
      {isUpdating ? (
        'Loading...'
        
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
