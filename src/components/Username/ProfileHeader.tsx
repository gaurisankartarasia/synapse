
// components/profile/ProfileHeader.tsx
import React, { useState } from "react";
import { formatFullDate } from "@/utils/date";
import { useAuth } from "@/hooks/useAuth";
import { ReportModal } from "@/components/ReportModal";
import Link from "next/link";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles"; // Import useTheme to access spacing units if needed for gap

// MUI Icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { useBlockUser } from "@/hooks/COMMON/Block/useBlock";

interface ProfileHeaderProps {
  uid: string;
  profilePhotoURL: string;
  username: string;
  displayName: string;
  isVerified: boolean;
  account_type: string;
  bio?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  account_type,
  uid,
  profilePhotoURL,
  username,
  displayName,
  isVerified,
  bio,
  createdAt,
}) => {
  const { user } = useAuth();
  const theme = useTheme(); // Get theme for spacing if needed
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { isBlocked, loading, handleBlock } = useBlockUser(uid, {
    // Optional: Define callbacks if needed
    onSuccess: () => {
      console.log("User blocked successfully and redirected.");
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const handleClickSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
    handleCloseSettings();
  };

  const handleReport = async (reason: string) => {
    try {
      const response = await fetch(`/api/report/user_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reported_uid: uid,
          reason,
          report_type: "profile",
        }),
      });

      if (response.ok) {
        alert("Profile reported successfully");
        setIsReportModalOpen(false);
      } else {
        console.error("Failed to report profile:", await response.text());
        alert("Failed to report profile. Please try again.");
      }
    } catch (error) {
      console.error("Error reporting profile:", error);
      alert("An error occurred while reporting the profile.");
    }
  };

  const avatarSrc = profilePhotoURL
    ? `/api/proxy?url=${encodeURIComponent(profilePhotoURL)}`
    : undefined;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(4),
            mb: theme.spacing(2) /* Added baseline mb */,
          }}
        >
          {/* Original: <div className=" mb-4"> */}
          {/* Applying mb on parent Box instead, Avatar itself doesn't need specific margin here due to flex alignment */}
          <Box>
            <Avatar
              src={avatarSrc}
              alt={username}
              sx={{
                // Original: lg:h-24 lg:w-24 sm:h-14 sm:w-14
                width: { xs: 56, sm: 56, lg: 96 }, // 14*4 = 56, 24*4 = 96
                height: { xs: 56, sm: 56, lg: 96 },
                bgcolor: "primary.main", // Fallback BG
              }}
            >
              {username ? username.slice(0, 1).toUpperCase() : ""}
            </Avatar>
          </Box>

          {/* Original: <div> */}
          <Box>
            {/* Original: <div className="flex items-center gap-2 mb-2"> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(1),
                mb: theme.spacing(1),
              }}
            >
              {/* Original: <p className="text-xl font-semibold">{username}</p> */}
              <Typography
                variant="h6"
                component="p"
                sx={{ fontWeight: "600" /* semibold */ }}
              >
                {username}
              </Typography>
              {/* Original: {isVerified && <BadgeCheck />} */}
              {isVerified && (
                <VerifiedIcon color="primary" sx={{ fontSize: "1.25rem" }} />
              )}
            </Box>

            {/* Original: <h1 className=" mb-2">{displayName}</h1> */}
            <Typography
              variant="body1"
              component="h1"
              sx={{ mb: theme.spacing(1) }}
            >
              {displayName}
            </Typography>
          </Box>


          {/* Original: DropdownMenu with <button><Settings /></button> trigger */}
          {/* IconButton serves as the <button> trigger */}
          <IconButton
            aria-label="settings"
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClickSettings}
          >
            <SettingsOutlined />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseSettings}
            MenuListProps={{ "aria-labelledby": "settings-button" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {uid === user?.uid && (
              <MenuItem
                component={Link}
                href="/settings/profile/edit"
                onClick={handleCloseSettings}
              >
                Settings & privacy
              </MenuItem>
            )}
            {user?.uid !== uid && (
              <div>
                <MenuItem onClick={!loading ? handleBlock : undefined}>
                  {isBlocked ? "Blocked" : loading ? "Blocking..." : "Block"}
                </MenuItem>
                <MenuItem onClick={handleOpenReportModal}>Report</MenuItem>
              </div>
            )}
          </Menu>
        </Box>{" "}
        {/* End of inner flex row */}
        {/* Original: account_type paragraphs with opacity-70 */}
        {account_type === "digital_creator" && (
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            {" "}
            {/* Using opacity directly */}
            Digital creator
          </Typography>
        )}
        {account_type === "business" && (
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            Business account
          </Typography>
        )}
        {/* Original: <p className="t600 text-center mb-4 ">{bio}</p> */}
        {bio && (
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: theme.spacing(2),
              maxWidth: "600px",
            }}
          >
            {" "}
            {/* t600 style needs mapping */}
            {bio}
          </Typography>
        )}
        {/* Original: <div className="flex items-center text-muted-foreground text-sm"> */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            gap: theme.spacing(1),
          }}
        >
          {" "}
          {/* Gap replaces icon margin */}
          {/* Original: <Calendar className="w-4 h-4 mr-2" /> */}
          <CalendarTodayIcon sx={{ fontSize: "1rem" }} />{" "}
          {/* text-sm -> 1rem icon? */}
          {/* Original: <span>Joined {formatFullDate(createdAt)}</span> */}
          <Typography variant="body2" component="span">
            {" "}
            {/* text-sm -> body2 */}
            Joined {formatFullDate(createdAt)}
          </Typography>
        </Box>
      </Box>{" "}
      {/* End of outer flex column */}
      {/* Report Modal remains the same */}
      <ReportModal
        type="profile"
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />
    </>
  );
};

// Optional: export default ProfileHeader;
