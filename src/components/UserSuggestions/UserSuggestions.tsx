
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { VscVerifiedFilled } from "react-icons/vsc";
import Link from 'next/link';
import { FollowButton } from '../../app/[username]/FollowButton';
import { AppDispatch, RootState } from '@/redux/store';
import { setFollowStatus, toggleFollow } from '@/redux/features/followSlice';
import { fetchSuggestedUsers } from '@/redux/features/suggestionSlice';
import { Spinner } from '../ui/spinner';
import { UserHoverCard } from '../user-profile-hover-card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function UserSuggestions() {
  const dispatch = useDispatch<AppDispatch>();
  const { users: suggestions, loading, error } = useSelector((state: RootState) => state.suggestions);
  const followState = useSelector((state: RootState) => state.follow);

  useEffect(() => {
    if (suggestions.length === 0) {
      dispatch(fetchSuggestedUsers());
    }
  }, [dispatch, suggestions.length]);

  useEffect(() => {
    suggestions.forEach((user) => {
      dispatch(setFollowStatus({
        username: user.username,
        isFollowing: user.isFollowing,
        isRequested: user.isRequested || false,
        followerCount: 0,
      }));
    });
  }, [dispatch, suggestions]);

  const handleFollow = async (username: string) => {
    try {
      await dispatch(toggleFollow(username)).unwrap();
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return <div className='flex justify-center'><Spinner /></div>;
  }

  if (error) {
    return (
     null
    );
  }

  return (
    <div className="w-full max-w-sm">
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
                
                 <Avatar>
      <AvatarImage src={user.profilePhotoURL} alt={user.username} className='object-cover' />
      <AvatarFallback>{user.username.slice(0,1)}</AvatarFallback>
    </Avatar>
                <div>
                  <div className='flex'>
                    <UserHoverCard username={user.username} >
                    <Link href={`/${user.username}`} className="font-medium text-sm">{user.username}</Link>
</UserHoverCard>
                    {user.isVerified && <VscVerifiedFilled size={15} />}
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

