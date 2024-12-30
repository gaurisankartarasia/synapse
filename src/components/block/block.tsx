"use client";

import React, { useEffect, useState, useCallback } from "react";
import {auth} from '../../lib/firebaseClient';

interface BlockUnblockProps {
  username: string; // The target user's username
}

const BlockUnblockComponent: React.FC<BlockUnblockProps> = ({ username }) => {
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch block status
  const fetchBlockStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/check-block-status?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setIsBlocked(data.isBlocked);
      }
    } catch (error) {
      console.error("Error fetching block status:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Handle block
  const handleBlock = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/block-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUsername: username }),
      });
      if (response.ok) {
        setIsBlocked(true);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle unblock
  const handleUnblock = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/unblock-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUsername: username }),
      });
      if (response.ok) {
        setIsBlocked(false);
        window.location.reload();

      }
    } catch (error) {
      console.error("Error unblocking user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockStatus();
  }, [fetchBlockStatus]);

  if (loading) return 'Loading...';

  return (
    <div>
      <div
        onClick={isBlocked ? handleUnblock : handleBlock}
        className="m-2 "
      >
        {isBlocked ? "Unblock" : "Block"}
      </div>
    </div>
  );
};

export default BlockUnblockComponent;











