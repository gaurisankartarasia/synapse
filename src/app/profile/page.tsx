
// // src/app/profile/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Image from 'next/image';
// import { UserProfile } from '@/types/profile';
// import UserPosts from './Posts'
// import { formatFullDate } from '@/utils/date';
// import { Spinner } from '@/components/ui/spinner';
// import {Card} from '@/components/ui/card'
// import UserModal from './FollowModal';
// import {Button} from '@/components/ui/button'
// import { BadgeCheck } from 'lucide-react';


// export default function ProfilePage() {
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [modalType, setModalType] = useState<"followers" | "following" | null>(null);


//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get<{ user: UserProfile }>('/api/user/my_profile', {
//           withCredentials: true // Important: This ensures cookies are sent with the request
//         });
//         setProfile(response.data.user);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load profile data');
//         setLoading(false);
//       }
//     }; fetchProfile();

    
//   },[] );


//   if (loading) {
//     return <Spinner/>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">{error}</div>;
//   }

//   if (!profile) {
//     return <div className="p-4">Profile not found</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <Card className="p-5">
//         <div className="flex items-center space-x-4 mb-6">
//           {/* {profile.profilePhotoURL && ( */}
//             <div className="relative w-24 h-24">
//               <Image
//     src={profile.profilePhotoURL ? profile.profilePhotoURL : "/profile-default-photo.svg"}
//     alt={profile.displayName} 
//                 fill
//                 className="rounded-full object-cover"
//               />
//             </div>
//           {/* )} */}
//           <div>
//           <p className="text-2xl ">@{profile.username}</p>

//           {profile.isVerified && (
//             <BadgeCheck/>
//           )}

//             <p >{profile.displayName}</p>
//             <p className="text-gray-600">{profile.uid}</p>
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
//             <Button onClick={() => setModalType("followers")}>
//               <p>{profile.followerCount || 0} </p> &nbsp; Followers
//             </Button>
//             <Button onClick={() => setModalType("following")}>
//               <p>{profile.followingCount || 0} </p>&nbsp;  Following
//             </Button>
//           </div>
//         <div className="space-y-4">
//           {profile.bio && (
//             <div>
//               <h2 className="text-lg font-semibold mb-2">Bio</h2>
//               <p className="text-gray-700">{profile.bio}</p>
//             </div>
//           )}

//           <div>
//             <h2 className="text-lg font-semibold mb-2">Email</h2>
//             <p className="text-gray-700">{profile.email}</p>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold mb-2">Joined</h2>
//             <p className="text-gray-700">
//               {formatFullDate(profile.createdAt)}
//             </p>
//           </div>
//         </div>
//       </Card>
//       {modalType && (
//         <UserModal
//           isOpen={!!modalType}
//           onClose={() => setModalType(null)}
//           type={modalType}
//         />
//       )}
//       <UserPosts uid={profile.uid}/>
//     </div>
//   );
// }











// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Image from 'next/image';
// import { format } from 'date-fns';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card';
// import { CheckCircle, Lock, Calendar } from 'lucide-react';
// import { Spinner } from '@/components/ui/spinner';
// import UserModal from './FollowModal';
// import { Button } from '@/components/ui/button';
// import UserPosts from './Posts';
// import { UserProfile } from '@/types/profile';
// import { formatFullDate } from '@/utils/date';

// export default function ProfilePage() {
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get<{ user: UserProfile }>('/api/user/my_profile', {
//           withCredentials: true,
//         });
//         setProfile(response.data.user);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load profile data');
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (loading) {
//     return <Spinner />;
//   }

//   if (error) {
//     return <div className='p-4 text-red-500'>{error}</div>;
//   }

//   if (!profile) {
//     return <div className='p-4'>Profile not found</div>;
//   }

//   return (
//     <div className='container mx-auto px-4 py-8'>
//       <div className='max-w-2xl mx-auto'>
//         <div className='p-6'>
//           <div className='flex flex-col items-center'>
//             <div className='relative mb-4'>
//               <Image
//                 src={profile.profilePhotoURL || '/profile-default-photo.svg'}
//                 alt={profile.displayName}
//                 width={100}
//                 height={100}
//                 className='rounded-full object-cover'
//               />
//               {profile.isVerified && (
//                 <Badge className='absolute bottom-0 right-0 bg-primary'>
//                   <CheckCircle className='w-4 h-4 mr-1' /> Verified
//                 </Badge>
//               )}
//             </div>
//             <h1 className='text-2xl font-bold mb-1'>{profile.displayName}</h1>
//             <p className='text-muted-foreground mb-4'>@{profile.username}</p>
//             <div className='flex space-x-4 mb-6'>
//               <Button onClick={() => setModalType('followers')} variant="outline" >
//                 <p className='font-semibold'>{profile.followerCount}</p> Followers
//               </Button>
//               <Button onClick={() => setModalType('following')} variant="outline">
//                 <p className='font-semibold'>{profile.followingCount}</p> Following
//               </Button>
//             </div>
//             <div className='w-full space-y-2'>
//               {profile.isPrivate && (
//                 <div className='flex items-center text-yellow-600'>
//                   <Lock className='w-4 h-4 mr-2' />
//                   <span>Your account is private</span>
//                 </div>
//               )}
//               <div className='flex items-center text-muted-foreground'>
//                 <Calendar className='w-4 h-4 mr-2' />
//                 <span>Joined {formatFullDate(profile.createdAt)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {modalType && (
//         <UserModal isOpen={!!modalType} onClose={() => setModalType(null)} type={modalType} />
//       )}
//       <UserPosts uid={profile.uid} />
//     </div>
//   );
// }






'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { format } from "date-fns";
import { UserProfile } from '@/types/profile';
import UserPosts from './Posts';
import { formatFullDate } from '@/utils/date';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Lock, BadgeCheck } from "lucide-react";
import UserModal from './FollowModal';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ user: UserProfile }>('/api/user/my_profile', {
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
              <Image
                src={profile.profilePhotoURL || "/profile-default-photo.svg"}
                alt={profile.displayName}
                width={200}
                height={200}
                className="rounded-full object-cover"
              />
              {profile.isVerified && (
                <Badge className="absolute bottom-0 right-0 bg-primary">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold mb-1">{profile.displayName}</h1>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.isVerified && <BadgeCheck className="text-primary w-5 h-5" />}
            </div>

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

            <div className="w-full space-y-4">
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