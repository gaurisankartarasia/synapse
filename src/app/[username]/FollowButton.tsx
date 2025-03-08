
// //./FollowButton.tsx
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import { FollowStatus } from "@/types/profile";

// interface FollowButtonProps {
//   isUpdating: boolean;
//   followStatus: FollowStatus;
//   onFollowClick: () => void;
//   className?: string;
// }

// export const FollowButton: React.FC<FollowButtonProps> = ({
//   isUpdating,
//   followStatus,
//   onFollowClick,
//   className,
// }) => {
//   return (
//     <Button
//       onClick={onFollowClick}
//       disabled={isUpdating}
//       className={` ${className || ''} `}
//     >
//       {isUpdating ? (
//         <Spinner />
//       ) : followStatus === "following" ? (
//         "Following"
//       ) : followStatus === "requested" ? (
//         "Requested"
//            ) : followStatus === "followBack" ? (
//         "Follow back"
//       ) : (
//         "Follow"
//       )}
//     </Button>
//   );
// };




// FollowButton.tsx
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
  let buttonText: string;
  let buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" = "default"; // Default variant
  let buttonClassName: string = "";

  if (isUpdating) {
    buttonText = ""; // Spinner handles loading state
  } else {
    switch (followStatus) {
      case "following":
        buttonText = "Following";
        buttonVariant = "secondary"; 
        break;
      case "requested":
        buttonText = "Requested";
        buttonVariant = "secondary"; 
        break;
      case "followBack":
        buttonText = "Follow back";
        buttonVariant = "default"; 
        break;
      default:
        buttonText = "Follow";
        buttonVariant = "default";
        break;
    }
  }

  return (
    <Button
      onClick={onFollowClick}
      disabled={isUpdating}
      variant={buttonVariant}
      className={`${className || ""} ${buttonClassName}`}
    >
      {isUpdating ? <Spinner /> : buttonText}
    </Button>
  );
};