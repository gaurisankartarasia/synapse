
//./FollowButton.tsx
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FollowStatus } from "@/types/profile";

interface FollowButtonProps {
  isUpdating: boolean;
  followStatus: FollowStatus;
  onFollowClick: () => void;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isUpdating,
  followStatus,
  onFollowClick,
  className,
}) => {
  return (
    <Button
      onClick={onFollowClick}
      disabled={isUpdating}
      className={` ${className || ''} `}
    >
      {isUpdating ? (
        <Spinner />
      ) : followStatus === "following" ? (
        "Following"
      ) : followStatus === "requested" ? (
        "Requested"
           ) : followStatus === "followBack" ? (
        "Follow back"
      ) : (
        "Follow"
      )}
    </Button>
  );
};