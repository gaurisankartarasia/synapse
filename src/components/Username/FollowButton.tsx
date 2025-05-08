
// // FollowButton.tsx
// import CircularProgress from "@mui/material/CircularProgress";
// import { FollowStatus } from "@/types/profile";

// import Button from "@mui/material/Button";

// interface FollowButtonProps {
//   isUpdating: boolean;
//   followStatus: FollowStatus;
//   onFollowClick: () => void;
//   className?: string;
//   isOwnProfile?: boolean;
// }

// export const FollowButton: React.FC<FollowButtonProps> = ({
//   isUpdating,
//   isOwnProfile,
//   followStatus,
//   onFollowClick,
//   className,
// }) => {
//   let buttonText: string;
//   let buttonVariant: "contained" | "outlined" | "text" = "contained"; // MUI button variants
//   const buttonClassName: string = "";

//   if (isUpdating) {
//     buttonText = "";
//   } else {
//     switch (followStatus) {
//       case "following":
//         buttonText = "Following";
//         buttonVariant = "outlined";
//         break;
//       case "requested":
//         buttonText = "Requested";
//         buttonVariant = "outlined";
//         break;
//       case "followBack":
//         buttonText = "Follow back";
//         buttonVariant = "contained";
//         break;
//       default:
//         buttonText = "Follow";
//         buttonVariant = "contained";
//         break;
//     }
//   }

//   return (
//     <Button
//       onClick={onFollowClick}
//       disabled={isUpdating}
//       variant={buttonVariant}
//       className={`${className || ""} ${buttonClassName}`}
//     >
//       {isUpdating ? <CircularProgress size={20} /> : buttonText}
//     </Button>
//   );
// };


// FollowButton.tsx
import CircularProgress from "@mui/material/CircularProgress";
import { FollowStatus } from "@/types/profile";

import Button from "@mui/material/Button";

interface FollowButtonProps {
  isUpdating: boolean;
  followStatus: FollowStatus;
  onFollowClick: () => void;
  className?: string;
  isOwnProfile?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isUpdating,
  isOwnProfile,
  followStatus,
  onFollowClick,
  className,
}) => {
  if (isOwnProfile) {
    return null; 
  }

  let buttonText: string;
  let buttonVariant: "contained" | "outlined" | "text" = "contained"; // MUI button variants
  const buttonClassName: string = "";

  if (isUpdating) {
    buttonText = "";
  } else {
    switch (followStatus) {
      case "following":
        buttonText = "Following";
        buttonVariant = "outlined";
        break;
      case "requested":
        buttonText = "Requested";
        buttonVariant = "outlined";
        break;
      case "followBack":
        buttonText = "Follow back";
        buttonVariant = "contained";
        break;
      default:
        buttonText = "Follow";
        buttonVariant = "contained";
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
      {isUpdating ? <CircularProgress size={20} /> : buttonText}
    </Button>
  );
};