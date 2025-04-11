// src/components/Profile.tsx
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

import {
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";

export function Profile() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <p> {error}</p>;
  }

  if (!profile) {
    return null;
  }

  return (
    <Link
      href={`/${profile.username}`}
      className="my-4"
    >
      <Card sx={{borderRadius:10}}  >
        <CardActionArea>
          <CardContent className="w-full flex items-center gap-2">
            <Avatar
              src={profile.profilePhotoURL}
              alt={profile.username.slice(0, 1)}
            >
              {profile.username.slice(0, 1)}
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{profile.username}</p>

              <p className="opacity-70 text-sm">{profile.displayName}</p>
            </div>{" "}
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
