import React from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import {Image} from "@mui/material";
import "./globals.css";

const ProfileHeader: React.FC<{ 
  photoURL: string; 
  username: string; 
  displayName: string; 
  verified: boolean; 
  bio:string;
}> = ({ photoURL, username, displayName, verified, bio }) => {
  return (
    <div className="">
      <Image
      isBlurred
      isZoomed
        // src={photoURL || "/default.webp"}
        src={`/api/proxy?url=${encodeURIComponent(photoURL || '/default.webp')}`}
        className="text-large"
        alt="photo"
       
        width={100}
        // onError={(e) => {
        //   e.currentTarget.src = "/default.webp";
        // }}
      />
     
      <div className="flex items-center">
        <p className="user-name">@{username}</p>
        {verified && <VscVerifiedFilled size={22} className="text-blue-500 mt-1.5" />}
      </div>
      <h1 className="username mr-1 " >{displayName}</h1>

      <i>{bio}</i>
    </div>
  ); 
};

export default ProfileHeader;
