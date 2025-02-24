//src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { UserProfile } from '@/types/profile';
import UserPosts from './Posts';
import { formatFullDate } from '@/utils/date';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Lock } from "lucide-react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import UserModal from './FollowModal';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
  const toast = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ user: UserProfile }>('/api/user/my_profile/query', {
          withCredentials: true
        });
        setProfile(response.data.user);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Spinner />;



  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!profile) return <div className="p-4">Profile not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
     
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
<Avatar className='w-32 h-32'>
      <AvatarImage src={`/api/proxy?url=${encodeURIComponent(profile.profilePhotoURL)}`} alt="@shadcn" />
      <AvatarFallback>{profile.displayName.slice(0,2)}</AvatarFallback>
    </Avatar>
    
             
            </div>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-2xl font-bold">@{profile.username}</p>
              {profile.isVerified && <RiVerifiedBadgeFill className="text-primary w-5 h-5" />}
            </div>
            <p className=" mb-1">{profile.displayName}</p>
           

            <div className="flex space-x-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setModalType("followers")}
                className="flex flex-col items-center p-8"
              >
                <span className="font-semibold">{profile.followerCount || 0}</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setModalType("following")}
                className="flex flex-col items-center p-8"
              >
                <span className="font-semibold">{profile.followingCount || 0}</span>
                <span className="text-sm text-muted-foreground">Following</span>
              </Button>
            </div>

            <div className="w-full space-y-4 text-center">
              {profile.bio && (
                <div>
                  <p>{profile.bio}</p>
                </div>
              )}

              {profile.isPrivate && (
                <div className="flex items-center text-yellow-600">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Private Account</span>
                </div>
              )}

              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Joined {formatFullDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalType && (
        <UserModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}

      <div className="mt-8">
        <UserPosts uid={profile.uid} />
      </div>
    </div>
  );
};