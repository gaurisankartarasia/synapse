import { useState, useEffect } from "react";

interface UserInfo {
  username: string;
  profilePhotoURL: string;
  displayName: string;
  isVerified: string;
}

export function useUserProfile(userId: string) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/v1/user/${userId}/mini`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          document.title = `Inbox - ${data.username}`;
        } else {
          setError("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setError("Error loading user profile");
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, [userId]);

  return { userInfo, loading, error };
}