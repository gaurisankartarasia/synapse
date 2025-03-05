
// components/profile/ProfileHeader.tsx
import React from "react";
import { Calendar } from "lucide-react";
import { formatFullDate } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VscVerifiedFilled } from "react-icons/vsc";


interface ProfileHeaderProps {
  profilePhotoURL: string;
  username: string;
  displayName: string;
  isVerified: boolean;
  bio?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profilePhotoURL,
  username,
  displayName,
  isVerified,
  bio,
  createdAt,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-8">

    
      <div className=" mb-4">
        <Avatar className="h-32 w-32">
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
 </div>
      {bio && <p className="t600 text-center mb-4 ">{bio}</p>}
      <div className="flex items-center text-muted-foreground text-sm">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Joined {formatFullDate(createdAt)}</span>
      </div>
    </div>
  );
};
