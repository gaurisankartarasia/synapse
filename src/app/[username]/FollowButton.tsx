//src/app/[username]/FollowButton.tsx
import React from "react";
import {Button} from '@/components/ui/button';
import {Spinner} from '@/components/ui/spinner'

const Followbutton: React.FC<{
  isUpdating: boolean;
  followStatus: string;
  onFollowClick: () => void;
  className?: string;

}> = ({ isUpdating, followStatus, onFollowClick, className }) => {
  return (
    <Button
    className={` ${className || ''}`}
      onClick={onFollowClick}
      disabled={isUpdating}
    >
      {isUpdating ? (
        <Spinner />
        
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


