
// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { UserProfile } from '@/types/profile';
import UserPosts from './Posts'
import { formatFullDate } from '@/utils/date';
import {CircularProgress} from '@mui/material'
import {Card} from '@mui/material'
import UserModal from './FollowModal';
import {Button} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ user: UserProfile }>('/api/user/my_profile', {
          withCredentials: true // Important: This ensures cookies are sent with the request
        });
        setProfile(response.data.user);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    }; fetchProfile();

    
  },[] );


  if (loading) {
    return <CircularProgress/>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="p-4">Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-5">
        <div className="flex items-center space-x-4 mb-6">
          {/* {profile.profilePhotoURL && ( */}
            <div className="relative w-24 h-24">
              <Image
    src={profile.profilePhotoURL ? profile.profilePhotoURL : "/profile-default-photo.svg"}
    alt={profile.displayName} 
                fill
                className="rounded-full object-cover"
              />
            </div>
          {/* )} */}
          <div>
          <p className="text-2xl ">@{profile.username}</p>

          {profile.isVerified && (
            <VerifiedIcon/>
          )}

            <p >{profile.displayName}</p>
            <p className="text-gray-600">{profile.uid}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button onClick={() => setModalType("followers")}>
              <p>{profile.followerCount || 0} </p> &nbsp; Followers
            </Button>
            <Button onClick={() => setModalType("following")}>
              <p>{profile.followingCount || 0} </p>&nbsp;  Following
            </Button>
          </div>
        <div className="space-y-4">
          {profile.bio && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Bio</h2>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-2">Email</h2>
            <p className="text-gray-700">{profile.email}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Joined</h2>
            <p className="text-gray-700">
              {formatFullDate(profile.createdAt)}
            </p>
          </div>
        </div>
      </Card>
      {modalType && (
        <UserModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
      <UserPosts uid={profile.uid}/>
    </div>
  );
}











