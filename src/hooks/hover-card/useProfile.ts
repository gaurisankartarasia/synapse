import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setFollowStatus } from "@/redux/features/followSlice";
import { UserProfile } from "@/types/hover-card/profile";

export const useUserProfile = (username: string, open: boolean) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (open && !profile) {
      const fetchProfile = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/v1/user-profile/query?username=${username}`, {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(response.status === 404 ? "User not found" : "Failed to fetch user");
          }

          const data = await response.json();
          setProfile(data);

          dispatch(setFollowStatus({
            username: data.username,
            isFollowing: data.isFollowing,
            isRequested: data.isRequested,
            isFollowingWithoutFollowback: data.isFollowingWithoutFollowback,
            followerCount: data.followerCount,
          }));

          setError(null);
        } catch (err) {
          setError("Failed to load user data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [open, username, profile, dispatch]);

  return { profile, isLoading, error };
};
