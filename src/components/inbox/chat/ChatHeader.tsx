import React, { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { VerifiedUser, MoreVert } from "@mui/icons-material";
import { useBlockUser } from "@/hooks/COMMON/Block/useBlock";

// Interface remains the same
interface UserInfo {
  username: string;
  profilePhotoURL: string;
  displayName: string;
  isVerified: string; // Assuming this is truthy/falsy or a specific string
}

// Interface remains the same
interface ChatHeaderProps {
  userInfo: UserInfo | null;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (isOpen: boolean) => void;
  targetUserId: string;
}

export default function ChatHeader({
  userInfo,
  targetUserId,
  setIsReportModalOpen,
}: ChatHeaderProps) {
  // State for the Menu component
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const { isBlocked, loading, handleBlock } = useBlockUser(targetUserId, {
    // Optional: Define callbacks if needed
    onSuccess: () => {
      console.log("User blocked successfully and redirected.");
    },
    onError: (err) => {
      // You could show a toast notification or alert here
      alert(`Error: ${err.message}`);
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true);
    handleMenuClose(); // Close the menu after clicking
  };

  if (!userInfo) return null;

  return (
    // Use Box for the header container, sx prop for styling
    <Box
      component="header"
      sx={{
        p: 2, // Equivalent to p-4 (MUI spacing unit is often 8px, so 2 * 8 = 16px)
        borderBottom: "1px solid",
        borderColor: "divider", // Use theme's divider color
      }}
    >
      {/* Use Box with display flex for layout */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Use Next.js Link, style the inner content */}
        <Link
          href={`/${userInfo.username}`}
          passHref
          style={{ textDecoration: "none", color: "inherit" }} // Remove link underline
        >
          {/* Stack for horizontal layout with spacing */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* MUI Avatar */}
            <Avatar
              src={userInfo.profilePhotoURL}
              alt={`${userInfo.username}'s avatar`}
              // Fallback is handled by children in MUI Avatar
            >
              {/* Fallback content */}
              {userInfo.username
                ? userInfo.username.slice(0, 1).toUpperCase()
                : ""}
            </Avatar>
            {/* MUI Typography for username */}
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
              {userInfo.username}
            </Typography>
            {/* MUI Icon for verified status */}
            {userInfo.isVerified && (
              <VerifiedUser color="primary" sx={{ fontSize: 20 }} />
            )}
          </Stack>
        </Link>

        {/* Menu for options */}
        <div>
          {/* IconButton triggers the menu */}
          <IconButton
            aria-label="user options"
            aria-controls={isMenuOpen ? "user-options-menu" : undefined}
            aria-haspopup="true"
            onClick={handleMenuOpen}
            size="small" // Match closer to original size
          >
            <MoreVert fontSize="inherit" />
          </IconButton>
          {/* MUI Menu */}
          <Menu
            id="user-options-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "user-options-button",
            }}
            anchorOrigin={{
              // Optional: Adjust menu position
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              // Optional: Adjust menu position
              vertical: "top",
              horizontal: "right",
            }}

            sx={{width:550}}
          >
            <MenuItem onClick={handleReportClick}>Report</MenuItem>
            <MenuItem
              onClick={!loading ? handleBlock : undefined} 
              className={`w-full h-full ${
                loading ? "cursor-wait opacity-70" : "cursor-pointer"
              }`}
            >
              {" "}
              {isBlocked ? "Blocked" : loading ? "Blocking..." : "Block"}{" "}
            </MenuItem>
          </Menu>
        </div>
      </Box>
    </Box>
  );
}
