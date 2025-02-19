
// components/UserSuggestions.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from "@/components/ui/card";
import { User } from '@/types/user';
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { FollowButton } from '../../app/[username]/FollowButton'
import { AppDispatch, RootState } from '@/redux/store';
import { setFollowStatus, toggleFollow } from '@/redux/features/followSlice';

export default function UserSuggestions() {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const followState = useSelector((state: RootState) => state.follow);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/user/suggested');
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        setSuggestions(data);
        
        // Initialize follow status in Redux for each suggestion
        data.forEach((user: User) => {
          dispatch(setFollowStatus({
            username: user.username,
            isFollowing: user.isFollowing,
            isRequested: user.isRequested || false,
            followerCount: 0,
          }));
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [dispatch]);

  const handleFollow = async (username: string) => {
    try {
      await dispatch(toggleFollow(username)).unwrap();
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-sm p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-sm p-4">
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-sm border-l-2">
      <h3 className="font-semibold mb-4">Suggested for you</h3>
      <div className="space-y-4">
        {suggestions.map((user) => {
          const currentFollowStatus = followState.followStatus[user.username] || {
            isFollowing: user.isFollowing,
            isRequested: user.isRequested || false,
            loading: false,
          };
          
          const followStatus = currentFollowStatus.isFollowing 
            ? "following" 
            : currentFollowStatus.isRequested 
            ? "requested" 
            : "none";

          return (
            <div key={user.uid} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src={user.profilePhotoURL || "/profile-default-photo.svg"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className='flex'>
                    <p className="font-medium text-sm">{user.username}</p>
                    {user.isVerified && <RiVerifiedBadgeFill size={15} />}
                  </div>
                  <p className="t500 text-xs">{user.displayName}</p>
                </div>
              </div>
              <FollowButton
                isUpdating={currentFollowStatus.loading || false}
                followStatus={followStatus}
                onFollowClick={() => handleFollow(user.username)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}




