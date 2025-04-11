
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BlockButtonProps {
  targetUserId: string;
}

const BlockButton: React.FC<BlockButtonProps> = ({ targetUserId }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleBlock = async () => {
    if (window.confirm("Are you sure you want to block this user?")) {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/block/${targetUserId}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to block user");
        }

        setIsBlocked(true);
        router.push("/settings/blocked");
      } catch (error) {
        console.error("Error blocking user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <span
      onClick={handleBlock}
      className="w-full h-full"
    >
      {isBlocked ? "Blocked" : loading ? "Blocking..." : "Block"}
    </span>
  );
};

export default BlockButton;