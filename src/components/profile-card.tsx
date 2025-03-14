// src/components/Profile.tsx
import { useProfile } from "@/hooks/useProfile";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Profile() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner />
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
      className="flex items-center gap-2 py-4"
    >
      <Avatar>
        <AvatarImage
          src={profile.profilePhotoURL}
          alt="user"
          className="object-cover"
        />
        <AvatarFallback>{profile.username.slice(0, 1)}</AvatarFallback>
      </Avatar>

      <div>
        <p className="font-semibold text-sm">{profile.username}</p>

        <p className="opacity-70 text-sm">{profile.displayName}</p>
      </div>
    </Link>
  );
}
