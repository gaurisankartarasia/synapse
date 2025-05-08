"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, Avatar } from "@mui/material";
import { Verified } from "@mui/icons-material";

interface BlockedUser {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isVerified:string;
}

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/user/blocked");
      if (!response.ok) {
        throw new Error("Failed to fetch blocked users");
      }
      const data = await response.json();
      setBlockedUsers(data);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (target_uid: string) => {
    try {
      const response = await fetch(`/api/v1/user/unblock/${target_uid}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to unblock user");
      }

      // Remove the user from the list after successful unblock
      setBlockedUsers((prevUsers) => prevUsers.filter((user) => user.uid !== target_uid));
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Blocked Users</h2>

      {loading ? (
        <div className="flex justify-center"> <CircularProgress/> </div>
      ) : blockedUsers.length === 0 ? (
        <p>No blocked users.</p>
      ) : (
        <ul className="space-y-4">
          {blockedUsers.map((user) => (
            <li key={user.uid} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                
         <Avatar src={user.profilePhotoURL} alt={user.username}>{user.username}</Avatar> 
                <div>
                  <p className="font-medium">{user.username} <span>{user.isVerified && <Verified fontSize="small" /> }</span> </p>

                  <p className="text-sm opacity-70">{user.displayName}</p>
                </div>
              </div>
              <Button
                onClick={() => handleUnblock(user.uid)}
              >
                Unblock
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlockedUsers;




