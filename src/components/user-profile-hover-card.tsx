'use client';

import { useEffect, useState } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFullDate } from '@/utils/date';

interface UserHoverCardProps {
  username: string;
  children: React.ReactNode;
}

interface UserProfile {
  username: string;
  displayName: string;
  profilePhotoURL: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
}; 
  followerCount: number;
  followingCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing?: boolean;
  isRequested?: boolean;
}

export function UserHoverCard({ username, children }: UserHoverCardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && !profile) {
      const fetchProfile = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/user-profile/query?username=${username}`,
            { credentials: 'include' }
          );

          if (!response.ok) {
            throw new Error(
              response.status === 404 ? 'User not found' : 'Failed to fetch user'
            );
          }

          const data = await response.json();
          setProfile(data);
          setError(null);
        } catch (err) {
        //   setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [open, username, profile]);

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        {isLoading ? (
          <div className="flex space-x-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500">{error}</div>
        ) : profile ? (
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={profile.profilePhotoURL} />
              <AvatarFallback>
                {profile.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">
                  {profile.username}
                </h4>
                {profile.isVerified && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">{profile.displayName}</p>
              
              <div className="flex gap-4 pt-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {profile.followerCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Followers
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {profile.followingCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Following
                  </span>
                </div>
              </div>

              <div className="flex items-center pt-2 text-xs text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Joined {formatFullDate(profile.createdAt)}
              </div>

              {profile.isPrivate && (
                <div className="pt-2 text-xs text-yellow-600">
                  Private Account
                </div>
              )}
            </div>
          </div>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}





