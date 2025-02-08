import React from "react";
import Image from "next/image";
import VerifiedIcon from '@mui/icons-material/Verified';
import "./globals.css";
// import { formatFullDate } from "@/utils/date";

const ProfileHeader: React.FC<{ 
  photoURL: string; 
  username: string; 
  displayName: string; 
  is_verified: boolean; 
  created_at: string;
  bio:string;
}> = ({ photoURL, username, displayName, is_verified, bio, created_at }) => {
  return (
    <div className="">
      <Image
        // src={photoURL || "/default.webp"}
        src={`/api/proxy?url=${encodeURIComponent(photoURL || '/default.webp')}`}
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
        {is_verified && <VerifiedIcon className="text-blue-500 mt-1.5" />}
      </div>
      <h1 className="username mr-1 " >{displayName}</h1>

      <i>{bio}</i>
      {/* <small>Joined {formatFullDate(created_at)}</small> */}
    </div>
  ); 
};

export default ProfileHeader;
