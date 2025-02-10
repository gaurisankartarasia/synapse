import React from "react";
import Image from "next/image";
import VerifiedIcon from '@mui/icons-material/Verified';
import "./globals.css";
// import { formatFullDate } from "@/utils/date";

const ProfileHeader: React.FC<{ 
  profilePhotoURL: string; 
  username: string; 
  displayName: string; 
  isVerified: boolean; 
  createdAt: string;
  bio:string;
}> = ({ profilePhotoURL, username, displayName, isVerified, bio, createdAt }) => {
  return (
    <div className="">
      <Image
        // src={profilePhotoURL || "/default.webp"}
        src={`/api/proxy?url=${encodeURIComponent(profilePhotoURL || '/default.webp')}`}
        className="text-large"
        alt="photo"
       height={100}
        width={100}
        // onError={(e) => {
        //   e.currentTarget.src = "/default.webp";
        // }}
      />
     
      <div className="flex items-center">
        <p className="user-name">@{username}</p>
        {isVerified && <VerifiedIcon className="text-blue-500 mt-1.5" />}
      </div>
      <h1 className="username mr-1 " >{displayName}</h1>

      <i>{bio}</i>
      {/* <small>Joined {formatFullDate(createdAt)}</small> */}
    </div>
  ); 
};

export default ProfileHeader;
