// import React from "react";
// import Image from "next/image";
// import {RiVerifiedBadgeFill} from 'lucide-react';
// import "./globals.css";
// // import { formatFullDate } from "@/utils/date";

// const ProfileHeader: React.FC<{ 
//   profilePhotoURL: string; 
//   username: string; 
//   displayName: string; 
//   isVerified: boolean; 
//   createdAt: string;
//   bio:string;
// }> = ({ profilePhotoURL, username, displayName, isVerified, bio, createdAt }) => {
//   return (
//     <div className="">
//       <Image
//         // src={profilePhotoURL || "/default.webp"}
//         src={`/api/proxy?url=${encodeURIComponent(profilePhotoURL || '/default.webp')}`}
//         className="text-large"
//         alt="photo"
//        height={100}
//         width={100}
//         // onError={(e) => {
//         //   e.currentTarget.src = "/default.webp";
//         // }}
//       />
     
//       <div className="flex items-center">
//         <p className="user-name">@{username}</p>
//         {isVerified && <RiVerifiedBadgeFill className="text-blue-500 mt-1.5" />}
//       </div>
//       <h1 className="username mr-1 " >{displayName}</h1>

//       <i>{bio}</i>
//       {/* <small>Joined {formatFullDate(createdAt)}</small> */}
//     </div>
//   ); 
// };

// export default ProfileHeader;



// components/profile/ProfileHeader.tsx
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import {RiVerifiedBadgeFill} from 'react-icons/ri'
import { formatFullDate } from "@/utils/date";

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
      <div className="relative mb-4">
        <Image
          src={`/api/proxy?url=${encodeURIComponent(profilePhotoURL || '/default.webp')}`}
          alt={displayName}
          width={100}
          height={100}
          className="rounded-md object-cover"
        />
        
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xl">@{username}</p>
        {isVerified && <RiVerifiedBadgeFill className="text-blue-500 w-5 h-5" />}
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{displayName}</h1>
      {bio && <p className="t600 text-center mb-4 ">{bio}</p>}
      <div className="flex items-center text-muted-foreground text-sm">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Joined {formatFullDate(createdAt)}</span>
      </div>
    </div>
  );
};