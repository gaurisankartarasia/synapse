import React from "react";
import {Button} from "@nextui-org/button";

const FollowButton: React.FC<{
  isUpdating: boolean;
  followStatus: string;
  onFollowClick: () => void;
}> = ({ isUpdating, followStatus, onFollowClick }) => {
  return (
    <Button
      className="follow-button"
      onPress={onFollowClick}
      disabled={isUpdating}
      variant="flat"
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

export default FollowButton;
