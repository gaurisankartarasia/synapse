// components/profile/ProfileHeader.tsx
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { formatFullDate } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VscVerifiedFilled } from "react-icons/vsc";
import BlockButton from "@/components/BlockButton";
import { useAuth } from "@/hooks/useAuth";
import { ReportModal } from "@/components/ReportModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import QRCodeGenerator from "@/components/Qrcode";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
        console.error("Failed to report profile");
      }
    } catch (error) {
      console.error("Error reporting profile:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-8">
          <div className=" mb-4">
            <Avatar className="lg:h-24 lg:w-24 sm:h-14 sm:w-14">
              <AvatarImage
                src={`/api/proxy?url=${encodeURIComponent(profilePhotoURL)}`}
                alt="user"
                className="object-cover"
              />
              <AvatarFallback>{username.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xl font-semibold">{username}</p>
              {isVerified && (
                <VscVerifiedFilled className="text-blue-500 w-6 h-6" />
              )}
            </div>

            <h1 className=" mb-2">{displayName}</h1>
          </div>
          <Button variant="outline">
            {uid === user?.uid && (
              <QRCodeGenerator
                text={`https://${window.location.hostname}/${username}`}
                buttonText="QR Code"
              />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <SettingsOutlinedIcon fontSize="small" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {uid === user?.uid && (
                <Link href={"/settings/profile/edit"}>
                  <DropdownMenuItem>Settings & privacy</DropdownMenuItem>
                </Link>
              )}
              {user?.uid !== uid && (
                <>
                  <DropdownMenuItem>
                    <BlockButton target_uid={uid} />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsReportModalOpen(true)}>
                    Report
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {account_type === "digital_creator" && (
          <p className="opacity-70">Digital creator</p>
        )}
        {account_type === "business" && (
          <p className="opacity-70">Business account</p>
        )}

        {bio && <p className="t600 text-center mb-4 ">{bio}</p>}
        <div className="flex items-center text-muted-foreground text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Joined {formatFullDate(createdAt)}</span>
        </div>
      </div>
      <ReportModal
        type="profile"
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />
    </>
  );
};
