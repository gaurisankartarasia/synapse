import React from "react";

const Followbutton: React.FC<{
  isUpdating: boolean;
  followStatus: string;
  onFollowClick: () => void;
}> = ({ isUpdating, followStatus, onFollowClick }) => {
  return (
    <button
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
    </button>
  );
};

export default Followbutton;
